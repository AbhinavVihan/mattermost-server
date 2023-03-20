// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import RemoveFromTeamButton from 'components/admin_console/manage_teams_modal/remove_from_team_button';
import {renderWithIntl} from 'tests/react_testing_utils';
import {fireEvent, screen} from '@testing-library/react';

describe('RemoveFromTeamButton', () => {
    const baseProps = {
        teamId: '1234',
        handleRemoveUserFromTeam: jest.fn(),
    };

    test('should match snapshot init', () => {
        const wrapper = renderWithIntl(
            <RemoveFromTeamButton {...baseProps}/>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should call handleRemoveUserFromTeam on button click', () => {
        const wrapper = renderWithIntl(
            <RemoveFromTeamButton {...baseProps}/>,
        );
        fireEvent.click(screen.getByRole('button'));
        expect(baseProps.handleRemoveUserFromTeam).toHaveBeenCalledTimes(1);
    });
});
