// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Group} from '@mattermost/types/groups';
import {Channel} from '@mattermost/types/channels';
import {Team} from '@mattermost/types/teams';
import {Scheme} from '@mattermost/types/schemes';

import ChannelDetails from './channel_details';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import store from 'stores/redux_store';
import {BrowserRouter} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

describe('admin_console/team_channel_settings/channel/ChannelDetails', () => {
    test('should match snapshot', async () => {
        const groups: Group[] = [{
            id: '123',
            name: 'name',
            display_name: 'DN',
            description: 'descript',
            source: 'A',
            remote_id: 'id',
            create_at: 0,
            update_at: 0,
            delete_at: 0,
            has_syncables: false,
            member_count: 3,
            scheme_admin: false,
            allow_reference: false,
        }];
        const allGroups = {
            123: groups[0],
        };
        const testChannel: Channel & {team_name: string} = {
            id: '123',
            team_name: 'team',
            create_at: 0,
            update_at: 0,
            delete_at: 0,
            team_id: 'id_123',
            type: 'O',
            display_name: 'name',
            name: 'DN',
            header: 'header',
            purpose: 'purpose',
            last_post_at: 0,
            last_root_post_at: 0,
            creator_id: 'id',
            scheme_id: 'id',
            group_constrained: false,
        };
        const team: Partial<Team> = {
            display_name: 'test',
        };
        const teamScheme: Scheme = {
            id: 'asdf',
            name: 'asdf',
            description: 'asdf',
            display_name: 'asdf',
            create_at: 0,
            update_at: 0,
            delete_at: 0,
            scope: 'team',
            default_team_admin_role: 'asdf',
            default_team_user_role: 'asdf',
            default_team_guest_role: 'asdf',
            default_channel_admin_role: 'asdf',
            default_channel_user_role: 'asdf',
            default_channel_guest_role: 'asdf',
            default_playbook_admin_role: 'asdf',
            default_playbook_member_role: 'asdf',
            default_run_member_role: 'asdf',
        };

        const actions = {
            getChannel: jest.fn().mockResolvedValue([]),
            getTeam: jest.fn().mockResolvedValue([]),
            linkGroupSyncable: jest.fn(),
            conver: jest.fn(),
            patchChannel: jest.fn(),
            setNavigationBlocked: jest.fn(),
            unlinkGroupSyncable: jest.fn(),
            getGroups: jest.fn().mockResolvedValue([]),
            membersMinusGroupMembers: jest.fn(),
            updateChannelPrivacy: jest.fn(),
            patchGroupSyncable: jest.fn(),
            getChannelModerations: jest.fn().mockResolvedValue([]),
            patchChannelModerations: jest.fn(),
            loadScheme: jest.fn(),
            addChannelMember: jest.fn(),
            removeChannelMember: jest.fn(),
            updateChannelMemberSchemeRoles: jest.fn(),
            deleteChannel: jest.fn(),
            unarchiveChannel: jest.fn(),
        };

        const additionalProps = {
            channelPermissions: [],
            guestAccountsEnabled: true,
            channelModerationEnabled: true,
            channelGroupsEnabled: true,
            isDisabled: false,
        };

        if (!testChannel.id) {
            return;
        }

        const {rerender} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <IntlProvider locale='en'>
                        <ChannelDetails
                            teamScheme={teamScheme}
                            groups={groups}
                            team={team}
                            totalGroups={groups.length}
                            actions={actions}
                            channel={testChannel}
                            channelID={testChannel.id}
                            allGroups={allGroups}
                            {...additionalProps}
                        /></IntlProvider></Provider></BrowserRouter>);

        expect(actions.getGroups).toHaveBeenCalledWith(testChannel.id);
        expect(actions.getChannelModerations).toHaveBeenCalledWith(testChannel.id);
        expect(actions.getTeam).toHaveBeenCalledWith(testChannel.team_id);

        expect(screen.getByText('Choose between inviting members manually or syncing members automatically from groups.')).toBeInTheDocument();

        expect(screen.getByText('Sync Group Members')).toBeInTheDocument();

        rerender(
            <BrowserRouter>
                <Provider store={store}>
                    <IntlProvider locale='en'>
                        <ChannelDetails
                            teamScheme={teamScheme}
                            groups={groups}
                            team={{}}
                            totalGroups={groups.length}
                            actions={actions}
                            channel={testChannel}
                            channelID={testChannel.id}
                            allGroups={allGroups}
                            channelPermissions={[]}
                            guestAccountsEnabled={false}
                            channelModerationEnabled={false}
                            channelGroupsEnabled={true}
                            isDisabled={false}
                        /></IntlProvider></Provider></BrowserRouter>);

        //should not exist when props are set to false
        expect(screen.queryByText('Guests')).not.toBeInTheDocument();
        expect(screen.queryByText('Permissions')).not.toBeInTheDocument();

        //team's display name should not exist if team is not given in prop
        expect(screen.queryByText('test')).not.toBeInTheDocument();
    });
});
