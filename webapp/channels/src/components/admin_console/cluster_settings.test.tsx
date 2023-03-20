// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import ClusterSettings from 'components/admin_console/cluster_settings.jsx';
import {renderWithIntl} from 'tests/react_testing_utils';
import {screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {mockStore} from 'tests/test_store';
import configureStore from 'store';

describe('components/ClusterSettings', () => {
    const baseProps = {
        license: {
            IsLicensed: 'true',
            Cluster: 'true',
        },
    };
    const store = configureStore(mockStore);

    test('should match snapshot, encryption disabled', () => {
        const props = {
            ...baseProps,
            value: [],
        };
        const config = {
            ClusterSettings: {
                Enable: true,
                ClusterName: 'test',
                OverrideHostname: '',
                UseIPAddress: false,
                EnableExperimentalGossipEncryption: false,
                EnableGossipCompression: false,
                GossipPort: 8074,
                SteamingPort: 8075,
            },
        };
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <ClusterSettings
                    {...props}
                    config={config}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();

        expect(
            screen.getByTestId('EnableExperimentalGossipEncryptionfalse'),
        ).toBeChecked();
    });

    test('should match snapshot, encryption enabled', () => {
        const props = {
            ...baseProps,
            value: [],
        };
        const config = {
            ClusterSettings: {
                Enable: true,
                ClusterName: 'test',
                OverrideHostname: '',
                UseIPAddress: false,
                EnableExperimentalGossipEncryption: true,
                EnableGossipCompression: false,
                GossipPort: 8074,
                SteamingPort: 8075,
            },
        };
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <ClusterSettings
                    {...props}
                    config={config}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();

        expect(
            screen.getByTestId('EnableExperimentalGossipEncryptiontrue'),
        ).toBeChecked();
    });

    test('should match snapshot, compression enabled', () => {
        const props = {
            ...baseProps,
            value: [],
        };
        const config = {
            ClusterSettings: {
                Enable: true,
                ClusterName: 'test',
                OverrideHostname: '',
                UseIPAddress: false,
                EnableExperimentalGossipEncryption: false,
                EnableGossipCompression: true,
                GossipPort: 8074,
                SteamingPort: 8075,
            },
        };
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <ClusterSettings
                    {...props}
                    config={config}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();

        expect(screen.getByTestId('EnableGossipCompressiontrue')).toBeChecked();
    });

    test('should match snapshot, compression disabled', () => {
        const props = {
            ...baseProps,
            value: [],
        };
        const config = {
            ClusterSettings: {
                Enable: true,
                ClusterName: 'test',
                OverrideHostname: '',
                UseIPAddress: false,
                EnableExperimentalGossipEncryption: false,
                EnableGossipCompression: false,
                GossipPort: 8074,
                SteamingPort: 8075,
            },
        };
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <ClusterSettings
                    {...props}
                    config={config}
                />
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();

        expect(
            screen.getByTestId('EnableGossipCompressionfalse'),
        ).toBeChecked();
    });
});
