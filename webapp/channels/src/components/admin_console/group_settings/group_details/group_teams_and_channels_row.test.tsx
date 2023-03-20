// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import GroupTeamsAndChannelsRow from 'components/admin_console/group_settings/group_details/group_teams_and_channels_row';
import {renderWithIntl} from 'tests/react_testing_utils';
import {fireEvent, screen} from '@testing-library/react';

describe('components/admin_console/group_settings/group_details/GroupTeamsAndChannelsRow', () => {
    for (const type of [
        'public-team',
        'private-team',
        'public-channel',
        'private-channel',
    ]) {
        test('should match snapshot, for ' + type, () => {
            const wrapper = renderWithIntl(
                <GroupTeamsAndChannelsRow
                    id='xxxxxxxxxxxxxxxxxxxxxxxxxx'
                    type={type}
                    name={'Test ' + type}
                    hasChildren={false}
                    collapsed={false}
                    onRemoveItem={jest.fn()}
                    onToggleCollapse={jest.fn()}
                    onChangeRoles={jest.fn()}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    }
    test('should match snapshot, when has children', () => {
        const wrapper = renderWithIntl(
            <GroupTeamsAndChannelsRow
                id='xxxxxxxxxxxxxxxxxxxxxxxxxx'
                type='public-team'
                name={'Test team with children'}
                hasChildren={true}
                collapsed={false}
                onRemoveItem={jest.fn()}
                onToggleCollapse={jest.fn()}
                onChangeRoles={jest.fn()}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, when has children and is collapsed', () => {
        const wrapper = renderWithIntl(
            <GroupTeamsAndChannelsRow
                id='xxxxxxxxxxxxxxxxxxxxxxxxxx'
                type='public-team'
                name={'Test team with children'}
                hasChildren={true}
                collapsed={true}
                onRemoveItem={jest.fn()}
                onToggleCollapse={jest.fn()}
                onChangeRoles={jest.fn()}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should call onToggleCollapse on caret click', () => {
        const onToggleCollapse = jest.fn();
        renderWithIntl(
            <GroupTeamsAndChannelsRow
                id='xxxxxxxxxxxxxxxxxxxxxxxxxx'
                type='public-team'
                name={'Test team with children'}
                hasChildren={true}
                collapsed={true}
                onRemoveItem={jest.fn()}
                onToggleCollapse={onToggleCollapse}
                onChangeRoles={jest.fn()}
            />,
        );

        fireEvent.click(screen.getByTestId('fa-caret-right-link'));

        expect(onToggleCollapse).toBeCalledWith('xxxxxxxxxxxxxxxxxxxxxxxxxx');
    });

    test('should call onRemoveItem on remove link click', async () => {
        const onRemoveItem = jest.fn();
        renderWithIntl(
            <GroupTeamsAndChannelsRow
                id='xxxxxxxxxxxxxxxxxxxxxxxxxx'
                type='public-team'
                name={'Test team with children'}
                hasChildren={true}
                collapsed={true}
                onRemoveItem={onRemoveItem}
                onToggleCollapse={jest.fn()}
                onChangeRoles={jest.fn()}
            />,
        );
        const buttonRemove = screen.getByTestId('Test team with children_groupsyncable_remove');
        fireEvent.click(buttonRemove);
        const buttonRemoveConfirm = screen.queryByText('Yes, Remove');
        expect(buttonRemoveConfirm).toBeInTheDocument();
        fireEvent.click(buttonRemoveConfirm!);
        expect(onRemoveItem).toBeCalledWith(
            'xxxxxxxxxxxxxxxxxxxxxxxxxx',
            'public-team',
        );
    });
});
