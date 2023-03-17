// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import AppsFormHeader from './apps_form_header';
import {Provider} from 'react-redux';
import store from 'stores/redux_store';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/apps_form/AppsFormHeader', () => {
    test('should render message with supported values', () => {
        const props = {
            id: 'testsupported',
            value: '**bold** *italic* [link](https://mattermost.com/) <br/> [link target blank](!https://mattermost.com/)',
        };
        const wrapper = renderWithIntl(<Provider store={store}>
            <AppsFormHeader {...props}/>            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should not fail on empty value', () => {
        const props = {
            id: 'testblankvalue',
            value: '',
        };
        const wrapper = renderWithIntl(<Provider store={store}>
            <AppsFormHeader {...props}/>            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
