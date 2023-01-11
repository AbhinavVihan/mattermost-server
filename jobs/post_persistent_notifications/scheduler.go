// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package post_persistent_notifications

import (
	"time"

	"github.com/mattermost/mattermost-server/v6/jobs"
	"github.com/mattermost/mattermost-server/v6/model"
)

type Scheduler struct {
	*jobs.PeriodicScheduler
}

func (scheduler *Scheduler) NextScheduleTime(cfg *model.Config, _ time.Time, _ bool, _ *model.Job) *time.Time {
	nextTime := time.Now().Add((time.Duration(*cfg.ServiceSettings.PersistentNotificationInterval) * time.Minute) / 2)
	return &nextTime
}

func MakeScheduler(jobServer *jobs.JobServer, license func() *model.License) model.Scheduler {
	isEnabled := func(_ *model.Config) bool {
		l := license()
		return l != nil && (l.SkuShortName == model.LicenseShortSkuProfessional || l.SkuShortName == model.LicenseShortSkuEnterprise)
	}
	return &Scheduler{jobs.NewPeriodicScheduler(jobServer, model.JobTypePostPersistentNotifications, 0, isEnabled)}
}
