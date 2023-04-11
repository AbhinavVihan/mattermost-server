// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import DataRetentionSettings from './data_retention_settings';
import {renderWithIntl} from 'tests/react_testing_utils';
import {screen} from '@testing-library/react';
import {Provider as ReduxProvider} from 'react-redux';
import store from 'stores/redux_store';
import {JobTypes} from 'utils/constants';
import {JobType} from '@mattermost/types/jobs';
import userEvent from '@testing-library/user-event';

describe('components/admin_console/data_retention_settings/data_retention_settings', () => {
    const baseProps = {
        config: {
            DataRetentionSettings: {
                EnableMessageDeletion: true,
                EnableFileDeletion: true,
                EnableBoardsDeletion: true,
                MessageRetentionDays: 100,
                FileRetentionDays: 100,
                BoardsRetentionDays: 100,
                DeletionJobStartTime: '00:15',
            },
        },
        customPolicies: {},
        customPoliciesCount: 0,
        actions: {
            getDataRetentionCustomPolicies: jest.fn().mockResolvedValue([]),
            createJob: jest.fn(),
            getJobsByType: jest.fn().mockResolvedValue([]),
            deleteDataRetentionCustomPolicy: jest.fn(),
            updateConfig: jest.fn(),
        },
    };

    test('should match component state with no custom policies', async () => {
        renderWithIntl(
            <ReduxProvider store={store}>
                <DataRetentionSettings
                    {...baseProps}
                />
            </ReduxProvider>,
        );
        expect(screen.queryByText('Data Retention Policies')).toBeInTheDocument();

        expect(screen.queryByText('Global retention policy')).toBeInTheDocument();
        expect(screen.queryByText('Keep messages and files for a set amount of time.')).toBeInTheDocument();
        expect(screen.queryByText('Custom retention policies')).toBeInTheDocument();
        expect(screen.queryByText('Customize how long specific teams and channels will keep messages.')).toBeInTheDocument();

        expect(screen.getByTestId('jobTable')).toBeInTheDocument();
        expect(screen.queryByText('Daily time to check policies and run delete job:')).toBeInTheDocument();

        const timeArray = baseProps.config.DataRetentionSettings.DeletionJobStartTime?.split(':');
        let hour = parseInt(timeArray[0], 10);
        if (hour === 0) {
            hour = 12;
        }
        expect(screen.queryByText(`${hour}:${timeArray[1]} AM (UTC)`)).toBeInTheDocument();

        const job = {
            type: JobTypes.DATA_RETENTION as JobType,
        };

        expect(screen.queryByText('Daily log of messages and files removed based on the policies defined above.')).toBeInTheDocument();
        await userEvent.click(screen.getByText('Run Deletion Job Now'));

        await userEvent.click(screen.getByText('Edit'));

        expect(screen.getByTestId('global_message_retention_cell')).toBeInTheDocument();
        expect(screen.getByTestId('global_file_retention_cell')).toBeInTheDocument();

        expect(baseProps.actions.createJob).toHaveBeenCalled();
        expect(baseProps.actions.createJob).toHaveBeenCalledWith(job);
    });

    test('should match component state with custom policy', async () => {
        const props = baseProps;
        props.customPolicies = {
            1234567: {
                id: '1234567',
                display_name: 'Custom policy 1',
                post_duration: 60,
                team_count: 1,
                channel_count: 2,
            },
        };
        props.customPoliciesCount = 1;
        renderWithIntl(
            <ReduxProvider store={store}>
                <DataRetentionSettings
                    {...props}
                />
            </ReduxProvider>,
        );

        await userEvent.click(screen.getByText('Run Deletion Job Now'));
        await userEvent.click(screen.getByText('Edit'));
        expect(screen.getByText('60 days')).toBeInTheDocument();
        expect(screen.getByText('Custom policy 1')).toBeInTheDocument();

        expect(screen.queryByText('Keep forever')).not.toBeInTheDocument();
        expect(screen.getByText('1 team, 2 channels')).toBeInTheDocument();
        expect(screen.queryByText('1 - 1 of 1')).toBeInTheDocument();
    });

    test('should match component state with custom policy keep forever', async () => {
        const props = baseProps;
        props.customPolicies = {
            1234567: {
                id: '1234567',
                display_name: 'Custom policy 1',
                post_duration: -1,
                team_count: 1,
                channel_count: 2,
            },
        };
        props.customPoliciesCount = 1;
        renderWithIntl(
            <ReduxProvider store={store}>
                <DataRetentionSettings
                    {...props}
                />
            </ReduxProvider>,
        );
        await userEvent.click(screen.getByText('Run Deletion Job Now'));
        await userEvent.click(screen.getByText('Edit'));

        expect(screen.getByText('Custom policy 1')).toBeInTheDocument();

        expect(screen.getByText('Keep forever')).toBeInTheDocument();
        expect(screen.getByText('1 team, 2 channels')).toBeInTheDocument();

        expect(screen.getByTestId('global_message_retention_cell')).toBeInTheDocument();
        expect(screen.getByTestId('global_file_retention_cell')).toBeInTheDocument();
        screen.queryByText('95 results available. Select is focused ,type to refine list, press Down to open the menu,', {exact: false});
    });

    test('should match component state with Global Policies disabled', async () => {
        const props = baseProps;
        props.config.DataRetentionSettings.EnableMessageDeletion = false;
        props.config.DataRetentionSettings.EnableFileDeletion = false;
        props.config.DataRetentionSettings.EnableBoardsDeletion = false;
        renderWithIntl(
            <ReduxProvider store={store}>
                <DataRetentionSettings
                    {...props}
                />
            </ReduxProvider>,
        );

        await userEvent.click(screen.getByText('Edit'));

        expect(screen.getAllByText('Keep forever')).toHaveLength(3);

        screen.queryByText('Applied to', {exact: true});
        screen.getByText('Applies to all teams and channels, but does not apply to custom retention policies.', {exact: true});
    });
});
