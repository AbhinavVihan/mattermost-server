// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {readAccess} from './types';

import SystemRolePermissionDropdown from './system_role_permission_dropdown';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('admin_console/system_role_permission_dropdown', () => {
    const props = {
        section: {
            name: 'environemnt',
            hasDescription: true,
            subsections: [],
        },
        access: readAccess,
        updatePermissions: jest.fn(),
        isDisabled: false,
    };

    test('should match snapshot', () => {
        const wrapper = renderWithIntl(
            <SystemRolePermissionDropdown
                {...props}
            />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot with isDisabledTrue', () => {
        const wrapper = renderWithIntl(
            <SystemRolePermissionDropdown
                {...props}
                isDisabled={true}
            />);

        expect(wrapper).toMatchSnapshot();
    });
});
