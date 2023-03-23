// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Provider} from 'react-redux';

import mockStore from 'tests/test_store';

import {Channel} from '@mattermost/types/channels';
import {UserProfile} from '@mattermost/types/users';

import Constants from 'utils/constants';

import DraftTitle from './draft_title';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/drafts/draft_actions', () => {
    const baseProps = {
        channelType: '' as Channel['type'],
        channelName: '',
        membersCount: 5,
        selfDraft: false,
        teammate: {} as UserProfile,
        teammateId: '',
        type: 'channel' as 'channel' | 'thread',
    };

    it('should match snapshot', () => {
        const store = mockStore();

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...baseProps}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot for self draft', () => {
        const store = mockStore();

        const props = {
            ...baseProps,
            selfDraft: true,
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...props}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot for private channel', () => {
        const store = mockStore();

        const props = {
            ...baseProps,
            channelType: Constants.PRIVATE_CHANNEL as Channel['type'],
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...props}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot for DM channel', () => {
        const store = mockStore();

        const props = {
            ...baseProps,
            channelType: Constants.DM_CHANNEL as Channel['type'],
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...props}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot for DM channel with teammate', () => {
        const store = mockStore();

        const props = {
            ...baseProps,
            channelType: Constants.DM_CHANNEL as Channel['type'],
            teammate: {
                username: 'username',
                id: 'id',
                last_picture_update: 1000,
            } as UserProfile,
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...props}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot for GM channel', () => {
        const store = mockStore();

        const props = {
            ...baseProps,
            channelType: Constants.GM_CHANNEL as Channel['type'],
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...props}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot for thread', () => {
        const store = mockStore();

        const props = {
            ...baseProps,
            channelType: Constants.OPEN_CHANNEL as Channel['type'],
            type: 'thread' as 'channel' | 'thread',
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...props}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot for open channel', () => {
        const store = mockStore();

        const props = {
            ...baseProps,
            channelType: Constants.OPEN_CHANNEL as Channel['type'],
            type: 'channel' as 'channel' | 'thread',
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <DraftTitle
                    {...props}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
