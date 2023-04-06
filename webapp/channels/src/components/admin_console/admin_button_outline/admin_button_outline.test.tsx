// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import AdminButtonOutline from './admin_button_outline';
import {renderWithIntl} from 'tests/react_testing_utils';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('components/admin_console/admin_button_outline/AdminButtonOutline', () => {
    test('should match snapshot with prop disable false', () => {
        const onClick = jest.fn();
        renderWithIntl(
            <AdminButtonOutline
                onClick={onClick}
                className='admin-btn-default'
                disabled={false}
            />,
        );

        expect(screen.getByTestId('AdminButtonOutline-btn')).toHaveClass('admin-btn-default');
        expect(screen.getByTestId('AdminButtonOutline-btn')).not.toBeDisabled();
    });

    test('should match snapshot with prop disable true', () => {
        const onClick = jest.fn();
        renderWithIntl(
            <AdminButtonOutline
                onClick={onClick}
                className='admin-btn-default'
                disabled={true}
            />,
        );
        expect(screen.getByTestId('AdminButtonOutline-btn')).toHaveClass('admin-btn-default');
        expect(screen.getByTestId('AdminButtonOutline-btn')).toBeDisabled();
    });

    test('should match snapshot with children', () => {
        const onClick = jest.fn();
        renderWithIntl(
            <AdminButtonOutline
                onClick={onClick}
                className='admin-btn-default'
                disabled={true}
            >
                {'Test children'}
            </AdminButtonOutline>,
        );
        expect(screen.queryByText('Test children')).toBeInTheDocument();
        expect(screen.getByTestId('AdminButtonOutline-btn')).toHaveClass('admin-btn-default');
        expect(screen.getByTestId('AdminButtonOutline-btn')).toBeDisabled();
    });

    test('should match snapshot with className is not provided in scss file', () => {
        const onClick = jest.fn();
        renderWithIntl(
            <AdminButtonOutline
                onClick={onClick}
                className='btn-default'
                disabled={true}
            >
                {'Test children'}
            </AdminButtonOutline>,
        );
        expect(screen.queryByText('Test children')).toBeInTheDocument();
        expect(screen.getByTestId('AdminButtonOutline-btn')).not.toHaveClass('admin-btn-default');
        expect(screen.getByTestId('AdminButtonOutline-btn')).toHaveClass('btn-default');
        expect(screen.getByTestId('AdminButtonOutline-btn')).toBeDisabled();
    });

    test('should handle onClick', () => {
        const onClick = jest.fn();
        renderWithIntl(
            <AdminButtonOutline
                onClick={onClick}
                className='admin-btn-default'
                disabled={false}
            >
                {'Test children'}
            </AdminButtonOutline>,
        );

        expect(screen.queryByText('Test children')).toBeInTheDocument();
        expect(screen.getByTestId('AdminButtonOutline-btn')).toHaveClass('admin-btn-default');

        //button should not be disabled for the clickEvent to happen
        expect(screen.getByTestId('AdminButtonOutline-btn')).not.toBeDisabled();

        userEvent.click(screen.getByTestId('AdminButtonOutline-btn'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
