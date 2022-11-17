// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package app

import (
	"context"
	"net/http"
	"time"

	"github.com/mattermost/mattermost-server/v6/app/request"
	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/shared/mlog"
	"github.com/pkg/errors"
)

// DeletePersistentNotificationsPost stops persistent notifications, if mentioned user reacts, reply or ack on the post.
// Or if post-owner deletes the original post, in which case "checkMentionedUser" must be false and "mentionedUserID" can be empty.
func (a *App) DeletePersistentNotificationsPost(post *model.Post, mentionedUserID string, checkMentionedUser bool) *model.AppError {
	if posts, err := a.Srv().Store().PostPersistentNotification().Get(model.GetPersistentNotificationsPostsParams{PostID: post.Id}); err != nil {
		return model.NewAppError("DeletePersistentNotificationsPost", "app.post_priority.delete_persistent_notification_post.app_error", nil, "", http.StatusInternalServerError).Wrap(err)
	} else if len(posts) == 0 {
		// Either the notification post already deleted or was never a notification post
		return nil
	}

	if checkMentionedUser {
		if err := a.forEachPersistentNotificationPost([]*model.Post{post}, func(_ *model.Post, _ *model.Channel, _ *model.Team, mentions *ExplicitMentions, _ model.UserMap) error {
			if !mentions.isUserMentioned(mentionedUserID) {
				return errors.Errorf("User %s is not mentioned", mentionedUserID)
			}
			return nil
		}); err != nil {
			return model.NewAppError("DeletePersistentNotificationsPost", "app.post_priority.delete_persistent_notification_post.app_error", nil, "", http.StatusInternalServerError).Wrap(err)
		}
	}

	if err := a.Srv().Store().PostPersistentNotification().Delete([]string{post.Id}); err != nil {
		return model.NewAppError("DeletePersistentNotificationsPost", "app.post_priority.delete_persistent_notification_post.app_error", nil, "", http.StatusInternalServerError).Wrap(err)
	}

	return nil
}

func (a *App) SendPersistentNotifications() error {
	// notificationInterval := a.Config().ServiceSettings.PersistenceNotificationInterval
	notificationInterval, err := time.ParseDuration("5m")
	if err != nil {
		return errors.Wrap(err, "failed to parse persistent notifications interval")
	}

	// fetch posts for which first notificationInterval duration has passed
	maxCreateAt := time.Now().Add(-notificationInterval).UnixMilli()
	notificationPosts, err := a.Srv().Store().PostPersistentNotification().Get(model.GetPersistentNotificationsPostsParams{MaxCreateAt: maxCreateAt})
	if err != nil {
		return errors.Wrap(err, "failed to get posts for persistent notifications")
	}

	// No posts available at the moment for persistent notifications
	if len(notificationPosts) == 0 {
		return nil
	}

	postIds := make([]string, len(notificationPosts))
	for _, p := range notificationPosts {
		postIds = append(postIds, p.PostId)
	}
	posts, err := a.Srv().Store().Post().GetPostsByIds(postIds)
	if err != nil {
		return errors.Wrap(err, "failed to get posts by IDs")
	}

	// notificationMaxDuration := a.Config().ServiceSettings.PersistenceNotificationMaxDuration
	notificationMaxDuration, err := time.ParseDuration("30m")
	if err != nil {
		return errors.Wrap(err, "failed to parse persistent notifications max duration")
	}
	var expiredPosts []*model.Post
	var validPosts []*model.Post
	for _, p := range posts {
		expireAt := time.UnixMilli(p.CreateAt).Add(notificationMaxDuration)
		if time.Now().UTC().After(expireAt) {
			expiredPosts = append(expiredPosts, p)
		} else {
			validPosts = append(validPosts, p)
		}
	}

	expiredPostsIds := make([]string, len(expiredPosts))
	for _, p := range expiredPosts {
		expiredPostsIds = append(expiredPostsIds, p.Id)
	}
	// Delete expired notifications posts
	if err := a.Srv().Store().PostPersistentNotification().Delete(expiredPostsIds); err != nil {
		return errors.Wrapf(err, "failed to delete expired notifications: %v", expiredPostsIds)
	}

	// Send notifications to validPosts
	// return a.sendPersistentNotifications(validPosts)
	return a.forEachPersistentNotificationPost(validPosts, a.sendPersistentNotifications)
}

func (a *App) forEachPersistentNotificationPost(posts []*model.Post, fn func(post *model.Post, channel *model.Channel, team *model.Team, mentions *ExplicitMentions, profileMap model.UserMap) error) error {
	// postsMentions, err := a.getMentionsForPersistentNotifications(posts)
	// if err != nil {
	// 	return err
	// }

	channelIds := make(model.StringSet)
	for _, p := range posts {
		channelIds.Add(p.ChannelId)
	}
	channels, err := a.Srv().Store().Channel().GetChannelsByIds(channelIds.Val(), false)
	if err != nil {
		return errors.Wrap(err, "failed to get channels by IDs")
	}
	channelsMap := make(map[string]*model.Channel, len(channels))
	for _, c := range channels {
		channelsMap[c.Id] = c
	}

	teamIds := make(model.StringSet)
	for _, c := range channels {
		if c.TeamId != "" {
			teamIds.Add(c.TeamId)
		}
	}
	teams := make([]*model.Team, len(teamIds))
	if len(teamIds) > 0 {
		teams, err = a.Srv().Store().Team().GetMany(teamIds.Val())
		if err != nil {
			return errors.Wrap(err, "failed to get teams by IDs")
		}
	}
	teamsMap := make(map[string]*model.Team, len(teams))
	for _, t := range teams {
		teamsMap[t.Id] = t
	}

	channelGroupMap := make(map[string]map[string]*model.Group, len(channelsMap))
	channelProfileMap := make(map[string]model.UserMap, len(channelsMap))
	channelKeywords := make(map[string]map[string][]string, len(channelsMap))
	for _, c := range channelsMap {
		if c.Type != model.ChannelTypeDirect {
			groups, appErr := a.getGroupsAllowedForReferenceInChannel(c, teamsMap[c.TeamId])
			if appErr != nil {
				return errors.Wrap(err, "failed to get groups for channels")
			}
			channelGroupMap[c.Id] = make(map[string]*model.Group, len(groups))
			for k, v := range groups {
				channelGroupMap[c.Id][k] = v
			}
		}

		profileMap, err := a.Srv().Store().User().GetAllProfilesInChannel(context.Background(), c.Id, true)
		if err != nil {
			return errors.Wrapf(err, "failed to get profiles for channel %s", c.Id)
		}
		channelProfileMap[c.Id] = profileMap

		channelKeywords[c.Id] = make(map[string][]string, len(profileMap))
		for k, v := range profileMap {
			channelKeywords[c.Id]["@"+v.Username] = []string{k}
		}
	}

	for _, post := range posts {
		channel := channelsMap[post.ChannelId]
		team := teamsMap[channel.Id]
		if channel.IsGroupOrDirect() {
			team = &model.Team{}
		}
		profileMap := channelProfileMap[channel.Id]

		mentions := &ExplicitMentions{}
		if channel.Type == model.ChannelTypeDirect {
			otherUserId := channel.GetOtherUserIdForDM(post.UserId)
			if _, ok := profileMap[otherUserId]; ok {
				mentions.addMention(otherUserId, DMMention)
			}
		} else {
			keywords := channelKeywords[channel.Id]
			mentions = getExplicitMentions(post, keywords, channelGroupMap[channel.Id])
			for _, group := range mentions.GroupMentions {
				_, err := a.insertGroupMentions(group, channel, profileMap, mentions)
				if err != nil {
					return errors.Wrapf(err, "failed to include mentions from group - %s for channel - %s", group.Id, channel.Id)
				}
			}
		}

		if err := fn(post, channel, team, mentions, profileMap); err != nil {
			return err
		}
	}

	return nil
}

func (a *App) sendPersistentNotifications(post *model.Post, channel *model.Channel, team *model.Team, mentions *ExplicitMentions, profileMap model.UserMap) error {
	mentionedUsersList := make(model.StringArray, 0)
	for id := range mentions.Mentions {
		mentionedUsersList = append(mentionedUsersList, id)
	}

	sender := profileMap[post.UserId]
	notification := &PostNotification{
		Post:       post,
		Channel:    channel,
		ProfileMap: profileMap,
		Sender:     sender,
	}

	// TODO: remove false
	if false && *a.Config().EmailSettings.SendEmailNotifications {
		mentionedUsersList = model.RemoveDuplicateStrings(mentionedUsersList)

		for _, id := range mentionedUsersList {
			if profileMap[id] == nil {
				continue
			}

			//If email verification is required and user email is not verified don't send email.
			if *a.Config().EmailSettings.RequireEmailVerification && !profileMap[id].EmailVerified {
				mlog.Debug("Skipped sending notification email, address not verified.", mlog.String("user_email", profileMap[id].Email), mlog.String("user_id", id))
				continue
			}

			// if a.userAllowsEmail(c, profileMap[id], channelMemberNotifyPropsMap[id], post) {
			senderProfileImage, _, err := a.GetProfileImage(sender)
			if err != nil {
				a.Log().Warn("Unable to get the sender user profile image.", mlog.String("user_id", sender.Id), mlog.Err(err))
			}
			if err := a.sendNotificationEmail(request.EmptyContext(a.Log()), notification, profileMap[id], team, senderProfileImage); err != nil {
				mlog.Warn("Unable to send notification email.", mlog.Err(err))
			}
			// }
		}
	}

	// Check for channel-wide mentions in channels that have too many members for those to work
	if int64(len(mentionedUsersList)) > *a.Config().TeamSettings.MaxNotificationsPerChannel {
		return errors.Errorf("mentioned users: %d are more than allowed users: %d", len(mentionedUsersList), *a.Config().TeamSettings.MaxNotificationsPerChannel)
	}

	if a.canSendPushNotifications() {
		for _, id := range mentionedUsersList {
			if profileMap[id] == nil {
				continue
			}

			var status *model.Status
			var err *model.AppError
			if status, err = a.GetStatus(id); err != nil {
				status = &model.Status{UserId: id, Status: model.StatusOffline, Manual: false, LastActivityAt: 0, ActiveChannel: ""}
			}

			// if ShouldSendPushNotification(profileMap[id], channelMemberNotifyPropsMap[id], true, status, post) {
			if status.Status != model.StatusDnd && status.Status != model.StatusOutOfOffice {
				mentionType := mentions.Mentions[id]

				a.sendPushNotification(
					notification,
					profileMap[id],
					mentionType == KeywordMention || mentionType == ChannelMention || mentionType == DMMention,
					mentionType == ChannelMention,
					"",
				)
			}
		}
	}

	return nil
}
