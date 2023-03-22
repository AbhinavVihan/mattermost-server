// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {ChannelModes} from './channel_modes';
import {renderWithIntl} from 'tests/react_testing_utils';
import {Provider} from 'react-redux';
import store from 'stores/redux_store';

describe('admin_console/team_channel_settings/channel/ChannelModes', () => {
    test('should match snapshot', () => {
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <ChannelModes
                    onToggle={jest.fn()}
                    isPublic={true}
                    isSynced={false}
                    isDefault={false}
                    isDisabled={false}
                    groupsSupported={true}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot - not licensed for Group', () => {
        const wrapper = renderWithIntl(
            <ChannelModes
                onToggle={jest.fn()}
                isPublic={true}
                isSynced={false}
                isDefault={false}
                isDisabled={false}
                groupsSupported={false}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
