// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {screen} from '@testing-library/react';

import {TestHelper} from 'utils/test_helper';

import AdminUserCard from 'components/admin_console/admin_user_card/admin_user_card';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/admin_console/admin_user_card/admin_user_card', () => {
    const user = TestHelper.getUserMock({
        first_name: 'Jim',
        last_name: 'Halpert',
        nickname: 'Big Tuna',
        id: '1234',
    });

    const defaultProps = {
        user,
    } as any;

    test('should match default snapshot', () => {
        const props = defaultProps;
        renderWithIntl(<AdminUserCard {...props}/>);
        screen.getByText(props.user.first_name, {exact: false});
        screen.getByText(props.user.last_name, {exact: false});
        screen.getByText(props.user.nickname, {exact: false});
    });

    test('should match snapshot if no nickname is defined', () => {
        const props = {
            ...defaultProps,
            user: {
                ...defaultProps.user,
                nickname: null,
            },
        };
        renderWithIntl(<AdminUserCard {...props}/>);
        screen.getByText(props.user.first_name, {exact: false});
        screen.getByText(props.user.last_name, {exact: false});
        expect(screen.queryByText(defaultProps.user.nickname)).not.toBeInTheDocument();
    });

    test('should match snapshot if no first/last name is defined', () => {
        const props = {
            ...defaultProps,
            user: {
                ...defaultProps.user,
                first_name: null,
                last_name: null,
            },
        };
        renderWithIntl(<AdminUserCard {...props}/>);
        expect(screen.queryByText(defaultProps.user.first_name)).not.toBeInTheDocument();
        expect(screen.queryByText(defaultProps.user.last_name)).not.toBeInTheDocument();
        screen.getByText(props.user.nickname, {exact: false});
    });

    test('should match snapshot if no first/last name or nickname is defined', () => {
        const props = {
            ...defaultProps,
            user: {
                ...defaultProps.user,
                first_name: null,
                last_name: null,
                nickname: null,
            },
        };
        renderWithIntl(<AdminUserCard {...props}/>);
        expect(screen.queryByText(defaultProps.user.first_name)).not.toBeInTheDocument();
        expect(screen.queryByText(defaultProps.user.last_name)).not.toBeInTheDocument();
        expect(screen.queryByText(defaultProps.user.nickname)).not.toBeInTheDocument();
        screen.getByText(props.user.id, {exact: false});
    });
});
