// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import * as reactRedux from 'react-redux';
import {render, screen, waitFor} from '@testing-library/react';

import mockStore from 'tests/test_store';

import {CloudProducts, LicenseSkus} from 'utils/constants';

import ADLDAPUpsellBanner from './ad_ldap_upsell_banner';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('component/user_groups_modal/ad_ldap_upsell_banner', () => {
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');

    beforeEach(() => {
        useDispatchMock.mockClear();
        useSelectorMock.mockClear();
    });

    const initState = {
        entities: {
            general: {
                license: {
                    Cloud: 'false',
                    SkuShortName: LicenseSkus.Professional,
                    ExpiresAt: 100000000,
                },
                config: {},
            },
            cloud: {},
            admin: {
                prevTrialLicense: {
                    IsLicensed: 'false',
                },
            },
            users: {
                currentUserId: 'user1',
                profiles: {
                    user1: {
                        id: 'user1',
                        roles: 'system_admin',
                    },
                },
            },
        },
    };

    test('should display for admin users on professional with option to start trial if no self-hosted trial before', () => {
        const store = mockStore(initState);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        renderWithIntl(
            <reactRedux.Provider store={store}>
                <ADLDAPUpsellBanner/>
            </reactRedux.Provider>,
        );

        expect(screen.getByText('AD/LDAP group sync creates groups faster')).toBeInTheDocument();
        expect(screen.getByTestId('start_trial_btn')).toHaveTextContent('Start trial');
    });

    test('should display for admin users on professional with option to start trial if no cloud trial before', async () => {
        const state = JSON.parse(JSON.stringify(initState));
        state.entities.admin = {};
        state.entities.general.license = {
            Cloud: 'true',
            ExpiresAt: 100000000,
        };
        state.entities.cloud = {
            subscription: {
                product_id: 'prod_professional',
                is_free_trial: 'false',
                trial_end_at: 0,
            },
            products: {
                prod_professional: {
                    id: 'prod_professional',
                    sku: CloudProducts.PROFESSIONAL,
                },
            },
        };
        const store = mockStore(state);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <reactRedux.Provider store={store}>
                <ADLDAPUpsellBanner/>
            </reactRedux.Provider>,
        );

        await waitFor(() => expect(screen.getByText('AD/LDAP group sync creates groups faster')).toBeInTheDocument());
        await (waitFor(() => expect(screen.getByTestId('start_cloud_trial_btn')).toHaveTextContent('Start trial')));
    });

    test('should display for admin users on professional with option to contact sales if self-hosted trialed before', () => {
        const state = JSON.parse(JSON.stringify(initState));
        state.entities.admin.prevTrialLicense.IsLicensed = 'true';
        const store = mockStore(state);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <reactRedux.Provider store={store}>
                <ADLDAPUpsellBanner/>
            </reactRedux.Provider>,
        );

        expect(screen.getByText('AD/LDAP group sync creates groups faster')).toBeInTheDocument();
        expect(screen.getByTestId('contact-sales-btn')).toHaveTextContent('Contact sales to use');
    });

    test('should display for admin users on professional with option to contact sales if cloud trialed before', async () => {
        const state = JSON.parse(JSON.stringify(initState));
        state.entities.admin = {};
        state.entities.general.license = {
            Cloud: 'true',
            ExpiresAt: 100000000,
        };
        state.entities.cloud = {
            subscription: {
                product_id: 'prod_professional',
                is_free_trial: 'false',
                trial_end_at: 1,
            },
            products: {
                prod_professional: {
                    id: 'prod_professional',
                    sku: CloudProducts.PROFESSIONAL,
                },
            },
        };
        const store = mockStore(state);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <reactRedux.Provider store={store}>
                <ADLDAPUpsellBanner/>
            </reactRedux.Provider>,
        );

        await waitFor(() => expect(screen.getByText('AD/LDAP group sync creates groups faster')).toBeInTheDocument());
        await (waitFor(() => expect(screen.getByTestId('contact-sales-btn')).toHaveTextContent('Contact sales to use')));
    });

    test('should not display for non admin users', () => {
        const state = JSON.parse(JSON.stringify(initState));
        state.entities.users.profiles.user1.roles = 'system_user';
        const store = mockStore(state);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <reactRedux.Provider store={store}>
                <ADLDAPUpsellBanner/>
            </reactRedux.Provider>,
        );

        expect(screen.queryByText('AD/LDAP group sync creates groups faster')).not.toBeInTheDocument();
    });

    test('should not display for non self-hosted professional users', () => {
        const state = JSON.parse(JSON.stringify(initState));
        state.entities.general.license.SkuShortName = LicenseSkus.Enterprise;
        const store = mockStore(state);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <reactRedux.Provider store={store}>
                <ADLDAPUpsellBanner/>
            </reactRedux.Provider>,
        );

        expect(screen.queryByText('AD/LDAP group sync creates groups faster')).not.toBeInTheDocument();
    });

    test('should not display for non cloud professional users', async () => {
        const state = JSON.parse(JSON.stringify(initState));
        state.entities.admin = {};
        state.entities.general.license = {
            Cloud: 'true',
            ExpiresAt: 100000000,
        };
        state.entities.cloud = {
            subscription: {
                product_id: 'prod_starter',
                is_free_trial: 'false',
                trial_end_at: 1,
            },
            products: {
                prod_starter: {
                    id: 'prod_starter',
                    sku: CloudProducts.STARTER,
                },
            },
        };
        const store = mockStore(state);
        const dummyDispatch = jest.fn();
        useDispatchMock.mockReturnValue(dummyDispatch);

        render(
            <reactRedux.Provider store={store}>
                <ADLDAPUpsellBanner/>
            </reactRedux.Provider>,
        );

        await waitFor(() => expect(screen.queryByText('AD/LDAP group sync creates groups faster')).not.toBeInTheDocument());
    });
});
