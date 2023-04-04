// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import AccessHistoryModal from 'components/access_history_modal/access_history_modal';
import {screen} from '@testing-library/react';
import {renderWithIntl} from 'tests/react_testing_utils';
import {Provider} from 'react-redux';
import store from 'stores/redux_store';
import userEvent from '@testing-library/user-event';

describe('components/AccessHistoryModal', () => {
    const baseProps = {
        onHide: jest.fn(),
        actions: {
            getUserAudits: jest.fn(),
        },
        userAudits: [],
        currentUserId: '',
    };

    test('should match snapshot when no audits exist', () => {
        renderWithIntl(
            <AccessHistoryModal {...baseProps}/>,
        );
        expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
        expect(screen.queryByText('Timestamp')).not.toBeInTheDocument();
        expect(screen.queryByText('IP Address')).not.toBeInTheDocument();
    });

    test('should match snapshot when audits exist', () => {
        renderWithIntl(
            <Provider store={store}>
                <AccessHistoryModal
                    {...baseProps}
                    userAudits={[{
                        id: 'audit1',
                        create_at: 1,
                        user_id: 'audit1',
                        action: 'audit1',
                        extra_info: 'audit1',
                        ip_address: 'audit1',
                        session_id: 'audit1'}, {id: 'audit2',
                        create_at: 2,
                        user_id: 'audit2',
                        action: 'audit2',
                        extra_info: 'audit2',
                        ip_address: 'audit2',
                        session_id: 'audit2'}]}
                /></Provider>,
        );

        expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
        expect(screen.queryByText('Timestamp')).toBeInTheDocument();
        expect(screen.queryByText('IP Address')).toBeInTheDocument();
    });

    test('should have called actions.getUserAudits when onShow is called', () => {
        const actions = {
            getUserAudits: jest.fn(),
        };
        const props = {...baseProps, actions};
        renderWithIntl(
            <AccessHistoryModal {...props}/>,
        );

        expect(actions.getUserAudits).toHaveBeenCalledTimes(1);
    });

    test('should match state when onHide is called', () => {
        renderWithIntl(
            <AccessHistoryModal {...baseProps}/>,
        );
        userEvent.click(screen.getByText('×'));
        expect(baseProps.onHide).toHaveBeenCalledTimes(1);
    });
});
