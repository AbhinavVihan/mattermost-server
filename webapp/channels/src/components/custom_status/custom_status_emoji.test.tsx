// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Provider} from 'react-redux';

import * as CustomStatusSelectors from 'selectors/views/custom_status';
import {renderWithIntl} from 'tests/react_testing_utils';

import mockStore from 'tests/test_store';

import CustomStatusEmoji from './custom_status_emoji';

jest.mock('selectors/views/custom_status');
jest.mock('selectors/general');

describe('components/custom_status/custom_status_emoji', () => {
    const store = mockStore({});

    const getCustomStatus = () => {
        return null;
    };
    (CustomStatusSelectors.makeGetCustomStatus as jest.Mock).mockReturnValue(getCustomStatus);
    (CustomStatusSelectors.isCustomStatusEnabled as any as jest.Mock).mockReturnValue(true);
    it('should match snapshot', () => {
        const wrapper = renderWithIntl(<Provider store={store}><CustomStatusEmoji/></Provider>);
        expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot with props', () => {
        const wrapper = renderWithIntl(
            <Provider store={store}><CustomStatusEmoji
                emojiSize={34}
                showTooltip={true}
                tooltipDirection='bottom'
            /></Provider>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should not render when EnableCustomStatus in config is false', () => {
        (CustomStatusSelectors.isCustomStatusEnabled as any as jest.Mock).mockReturnValue(false);
        const wrapper = renderWithIntl(<Provider store={store}><CustomStatusEmoji/></Provider>);

        expect(wrapper.container).toBeEmptyDOMElement();
    });

    it('should not render when custom status is expired', () => {
        (CustomStatusSelectors.isCustomStatusEnabled as any as jest.Mock).mockReturnValue(true);
        (CustomStatusSelectors.isCustomStatusExpired as jest.Mock).mockReturnValue(true);
        const wrapper = renderWithIntl(<Provider store={store}><CustomStatusEmoji/></Provider>);

        expect(wrapper.container).toBeEmptyDOMElement();
    });
});
