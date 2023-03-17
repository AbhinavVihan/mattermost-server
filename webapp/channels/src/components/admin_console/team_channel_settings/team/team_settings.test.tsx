// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {TeamsSettings} from './team_settings';
import {Provider} from 'react-redux';
import store from 'stores/redux_store';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('admin_console/team_channel_settings/team/TeamSettings', () => {
    test('should match snapshot', () => {
        const wrapper = renderWithIntl(
            <Provider store={store}>

                <TeamsSettings
                    siteName='site'
                />
            </Provider>,

        );
        expect(wrapper).toMatchSnapshot();
    });
});
