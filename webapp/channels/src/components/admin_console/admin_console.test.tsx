// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Team} from '@mattermost/types/teams';
import {SelfHostedSignupProgress} from '@mattermost/types/cloud';
import {AdminConfig, ExperimentalSettings} from '@mattermost/types/config';

import {Theme} from 'mattermost-redux/selectors/entities/preferences';

import AdminDefinition from 'components/admin_console/admin_definition';
import {TestHelper} from 'utils/test_helper';
import * as Utils from 'utils/utils';

import AdminConsole from './admin_console';
import type {Props} from './admin_console';
import {renderWithIntl, renderWithIntlAndStore} from 'tests/react_testing_utils';
import {BrowserRouter} from 'react-router-dom';
import {screen} from '@testing-library/react';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        Redirect: jest.fn(({to}) => `Redirect to=${to}`),
    };
});

describe('components/AdminConsole', () => {
    const baseProps: Props = {
        config: {
            TestField: true,
            ExperimentalSettings: {
                RestrictSystemAdmin: false,
            } as ExperimentalSettings,
        } as Partial<AdminConfig>,
        adminDefinition: AdminDefinition,
        environmentConfig: {},
        unauthorizedRoute: '/',
        consoleAccess: {
            read: {},
            write: {},
        },
        team: {} as Team,
        license: {},
        cloud: {
            limits: {
                limits: {},
                limitsLoaded: false,
            },
            errors: {},
            selfHostedSignup: {
                progress: SelfHostedSignupProgress.START,
            },
        },
        buildEnterpriseReady: true,
        match: {
            url: '',
        },
        roles: {
            channel_admin: TestHelper.getRoleMock(),
            channel_user: TestHelper.getRoleMock(),
            team_admin: TestHelper.getRoleMock(),
            team_user: TestHelper.getRoleMock(),
            system_admin: TestHelper.getRoleMock(),
            system_user: TestHelper.getRoleMock(),
        },
        showNavigationPrompt: false,
        isCurrentUserSystemAdmin: false,
        currentUserHasAnAdminRole: false,
        currentTheme: {} as Theme,
        actions: {
            getConfig: jest.fn(),
            getEnvironmentConfig: jest.fn(),
            setNavigationBlocked: jest.fn(),
            confirmNavigation: jest.fn(),
            cancelNavigation: jest.fn(),
            loadRolesIfNeeded: jest.fn(),
            editRole: jest.fn(),
            selectLhsItem: jest.fn(),
            selectTeam: jest.fn(),
        },
    };

    beforeEach(() => {
        jest.spyOn(Utils, 'applyTheme').mockImplementation(() => {});
        jest.spyOn(Utils, 'resetTheme').mockImplementation(() => {});
    });

    test('should redirect to town-square when not system admin', () => {
        const props = {
            ...baseProps,
            unauthorizedRoute: '/team-id/channels/town-square',
            isCurrentUserSystemAdmin: false,
            currentUserHasAnAdminRole: true,
            consoleAccess: {read: {}, write: {}},
            team: {name: 'development'} as Team,
        };
        const wrapper = renderWithIntlAndStore(
            <div id='root'><BrowserRouter><AdminConsole {...props}/></BrowserRouter></div>, {}
        );
        screen.getAllByText(baseProps.match.url, {exact: false});
        expect(wrapper.container).toMatchSnapshot();
    });

    test('should generate the routes', () => {
        const props = {
            ...baseProps,
            unauthorizedRoute: '/team-id/channels/town-square',
            isCurrentUserSystemAdmin: true,
            currentUserHasAnAdminRole: true,
            consoleAccess: {read: {}, write: {}},
            team: {name: 'development'} as Team,
        };
        const wrapper = renderWithIntlAndStore(
            <div id='root'><BrowserRouter><AdminConsole {...props}/></BrowserRouter></div>, {}
        );
        screen.getAllByText(baseProps.match.url, {exact: false});
        expect(wrapper.container).toMatchSnapshot();

    });
});
