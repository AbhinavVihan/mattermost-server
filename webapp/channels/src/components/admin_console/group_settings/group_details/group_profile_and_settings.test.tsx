// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {screen} from '@testing-library/react';
import React from 'react';
import {renderWithIntl} from 'tests/react_testing_utils';

import {GroupProfileAndSettings} from './group_profile_and_settings';

describe('components/admin_console/group_settings/group_details/GroupProfileAndSettings', () => {
    test('should match snapshot, with toggle off', () => {
        const wrapper = renderWithIntl(
            <GroupProfileAndSettings
                displayname='GroupProfileAndSettings'
                mentionname='GroupProfileAndSettings'
                allowReference={false}
                onChange={jest.fn()}
                onToggle={jest.fn()}
            />,
        );
        expect(screen.getByTestId('allowReferenceSwitch')).toBeInTheDocument();
        expect(screen.queryByText('Group Mention:', {exact: true})).not.toBeInTheDocument();
        expect(wrapper.container).toMatchSnapshot();
    });

    test('should match snapshot, with toggle on', () => {
        const wrapper = renderWithIntl(
            <GroupProfileAndSettings
                displayname='GroupProfileAndSettings'
                mentionname='GroupProfileAndSettings'
                allowReference={true}
                onChange={jest.fn()}
                onToggle={jest.fn()}
            />,
        );
        expect(screen.getByTestId('allowReferenceSwitch')).toBeInTheDocument();
        expect(screen.queryByText('Group Mention:', {exact: true})).toBeInTheDocument();
        expect(wrapper.container).toMatchSnapshot();
    });
});
