// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import PostDeletedModal from 'components/post_deleted_modal';
import {renderWithIntl} from 'tests/react_testing_utils';
import {fireEvent, screen} from '@testing-library/react';

describe('components/ChannelInfoModal', () => {
    const baseProps = {
        onExited: jest.fn(),
    };

    test('should match snapshot', () => {
        const {baseElement} = renderWithIntl(
            <PostDeletedModal {...baseProps}/>,
        );

        fireEvent.click(screen.getByTestId('postDeletedModalOkButton'));
        expect(baseProps.onExited).toHaveBeenCalledTimes(1);

        expect(baseElement).toMatchSnapshot();
    });
});
