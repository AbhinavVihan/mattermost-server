// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {TestHelper} from 'utils/test_helper';

import GroupMembersModal from './group_members_modal';
import {Provider} from 'react-redux';
import store from 'stores/redux_store';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('admin_console/team_channel_settings/group/GroupList', () => {
    test('should match snapshot while visible', () => {
        const group = TestHelper.getGroupMock({});

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <GroupMembersModal
                    group={group}
                    onExited={jest.fn()}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
