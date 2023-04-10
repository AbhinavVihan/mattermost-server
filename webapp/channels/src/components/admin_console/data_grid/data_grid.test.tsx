// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import DataGrid from './data_grid';
import { renderWithIntl } from 'tests/react_testing_utils';
import { screen } from '@testing-library/react';

describe('components/admin_console/data_grid/DataGrid', () => {
    const baseProps = {
        page: 1,
        startCount: 0,
        endCount: 0,
        total: 0,
        loading: false,

        nextPage: jest.fn(),
        previousPage: jest.fn(),
        onSearch: jest.fn(),

        rows: [],
        columns: [],
        term: '',
    };

    test('should match snapshot with no items found', () => {
        renderWithIntl(
            <DataGrid
                {...baseProps}
            />,
        );
        expect(screen.queryByText('No items found')).toBeInTheDocument()
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
    });

    test('should match snapshot while loading', () => {
        renderWithIntl(
            <DataGrid
                {...baseProps}
                loading={true}
            />,
        );
        expect(screen.queryByText('No items found')).not.toBeInTheDocument()
        expect(screen.queryByText('Loading')).toBeInTheDocument()
    });

    test('should match snapshot with content and custom styling on rows', () => {
        const {container} = renderWithIntl(
            <DataGrid
                {...baseProps}
                rows={[
                    {cells: {name: 'Joe Schmoe', team: 'Admin Team'}},
                    {cells: {name: 'Foo Bar', team: 'Admin Team'}},
                    {cells: {name: 'Some Guy', team: 'Admin Team'}},
                ]}
                columns={[
                    {name: 'Name', field: 'name', width: 3, overflow: 'hidden'},
                    {name: 'Team', field: 'team', textAlign: 'center'},
                ]}
            />,
        );

        expect(container.firstChild).toHaveClass('DataGrid')
        expect(screen.getAllByTestId('DataGrid_row')).toHaveLength(3)

    });

    test('should match snapshot with custom classes', () => {
        const {container} = renderWithIntl(
            <DataGrid
                {...baseProps}
                rows={[
                    {cells: {name: 'Joe Schmoe', team: 'Admin Team'}},
                    {cells: {name: 'Foo Bar', team: 'Admin Team'}},
                    {cells: {name: 'Some Guy', team: 'Admin Team'}},
                ]}
                columns={[
                    {name: 'Name', field: 'name'},
                    {name: 'Team', field: 'team'},
                ]}
                className={'customTable'}
            />,
        );

        expect(container.firstChild).toHaveClass('customTable')

    });
});
