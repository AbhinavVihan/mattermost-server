// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {PostType} from '@mattermost/types/posts';
import {PluginComponent} from 'types/store/plugins';

import {TestHelper} from 'utils/test_helper';

import ActionsMenu, {PLUGGABLE_COMPONENT, Props} from './actions_menu';
import {renderWithIntl} from 'tests/react_testing_utils';
import {screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import store from 'stores/redux_store';

jest.mock('utils/utils', () => {
    const original = jest.requireActual('utils/utils');
    return {
        ...original,
        isMobile: jest.fn(() => false),
    };
});

const dropdownComponents: PluginComponent[] = [
    {
        id: 'the_component_id',
        pluginId: 'playbooks',
        action: jest.fn(),
        text: 'the_component_text',
    },
];

describe('components/actions_menu/ActionsMenu', () => {
    const baseProps: Omit<Props, 'intl'> = {
        appBindings: [],
        appsEnabled: false,
        teamId: 'team_id_1',
        handleDropdownOpened: jest.fn(),
        isMenuOpen: true,
        isSysAdmin: true,
        pluginMenuItems: [],
        post: TestHelper.getPostMock({id: 'post_id_1', is_pinned: false, type: '' as PostType}),
        components: {},
        location: 'center',
        canOpenMarketplace: false,
        actions: {
            openModal: jest.fn(),
            openAppsModal: jest.fn(),
            handleBindingClick: jest.fn(),
            postEphemeralCallResponseForPost: jest.fn(),
            fetchBindings: jest.fn(),
        },
    };

    test('sysadmin - should have divider when plugin menu item exists', () => {
        const {rerender} = renderWithIntl(
            <Provider store={store}>
                <ActionsMenu {...baseProps}/>
            </Provider>,
        );

        expect(screen.queryByTestId('divider_post')).not.toBeInTheDocument();
        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    pluginMenuItems={dropdownComponents}
                    canOpenMarketplace={true}
                />
            </Provider>
        </IntlProvider>);
        expect(screen.getByTestId('divider_post')).toBeInTheDocument();
    });

    test('has actions - marketplace enabled and user has SYSCONSOLE_WRITE_PLUGINS - should show actions and app marketplace', () => {
        const {rerender} = renderWithIntl(
            <ActionsMenu {...baseProps}/>,
        );

        expect(screen.queryByText('App Marketplace')).not.toBeInTheDocument();
        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    pluginMenuItems={dropdownComponents}
                    canOpenMarketplace={true}
                />
            </Provider>
        </IntlProvider>);

        expect(screen.queryByText('App Marketplace')).toBeInTheDocument();
    });

    test('has actions - marketplace disabled or user not having SYSCONSOLE_WRITE_PLUGINS - should not show actions and app marketplace', () => {
        const {rerender} = renderWithIntl(
            <ActionsMenu {...baseProps}/>,
        );
        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    pluginMenuItems={dropdownComponents}
                    canOpenMarketplace={false}
                />
            </Provider>
        </IntlProvider>);

        expect(screen.queryByText('App Marketplace')).not.toBeInTheDocument();
    });

    test('no actions - sysadmin - menu should show visit marketplace', () => {
        const {rerender} = renderWithIntl(
            <ActionsMenu {...baseProps}/>,
        );

        expect(screen.queryByTestId('divider_post')).not.toBeInTheDocument();
        expect(screen.queryByText('App Marketplace')).not.toBeInTheDocument();

        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    pluginMenuItems={dropdownComponents}
                    canOpenMarketplace={true}
                />
            </Provider>
        </IntlProvider>);

        expect(screen.getByTestId('divider_post')).toBeInTheDocument();
        expect(screen.queryByText('App Marketplace')).toBeInTheDocument();
    });

    test('no actions - end user - menu should not be visible to end user', () => {
        const {rerender} = renderWithIntl(
            <ActionsMenu {...baseProps}/>,
        );

        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    isSysAdmin={false}
                />
            </Provider>
        </IntlProvider>);

        // menu should be empty
        expect(screen.queryByText('App Marketplace')).not.toBeInTheDocument();
        expect(screen.queryByText('No Actions currently\nconfigured for this server')).not.toBeInTheDocument();
    });

    test('sysadmin - should have divider when pluggable menu item exists', () => {
        const {rerender} = renderWithIntl(
            <ActionsMenu {...baseProps}/>,
        );

        expect(screen.queryByTestId('divider_post')).not.toBeInTheDocument();
        expect(screen.queryByText('App Marketplace')).not.toBeInTheDocument();

        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    canOpenMarketplace={true}
                    components={{[PLUGGABLE_COMPONENT]: dropdownComponents}}
                />
            </Provider>
        </IntlProvider>);

        expect(screen.getByTestId('divider_post')).toBeInTheDocument();
        expect(screen.queryByText('App Marketplace')).toBeInTheDocument();
    });

    test('end user - should not have divider when pluggable menu item exists', () => {
        const {rerender} = renderWithIntl(
            <ActionsMenu {...baseProps}/>,
        );

        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    isSysAdmin={false}
                />
            </Provider>
        </IntlProvider>);
        expect(screen.queryByTestId('divider_post')).not.toBeInTheDocument();

        rerender(<IntlProvider locale='en'>
            <Provider store={store}>
                <ActionsMenu
                    {...baseProps}
                    components={{[PLUGGABLE_COMPONENT]: dropdownComponents}}
                />
            </Provider>
        </IntlProvider>);
        expect(screen.getByLabelText('Post extra options')).toBeInTheDocument();
        expect(screen.queryByTestId('divider_post')).not.toBeInTheDocument();
    });
});
