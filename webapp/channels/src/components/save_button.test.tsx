// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {screen} from '@testing-library/react';

import SaveButton from 'components/save_button';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/SaveButton', () => {
    const baseProps = {
        saving: false,
    };

    test('should match snapshot, on defaultMessage', () => {
        const {container} = renderWithIntl(
            <SaveButton
                {...baseProps}
                defaultMessage='Go'
            />,
        );

        expect(screen.getAllByTestId('saveSetting')[0]).not.toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    test('should match snapshot, on savingMessage', () => {
        const props = {...baseProps, saving: true, disabled: true};
        const {container} = renderWithIntl(
            <SaveButton
                {...props}
                savingMessage='Saving Config...'
            />,
        );

        expect(screen.getAllByTestId('saveSetting')[0]).toBeDisabled();
        expect(container).toMatchSnapshot();
    });

    test('should match snapshot, extraClasses', () => {
        const props = {...baseProps, extraClasses: 'some-class'};
        const {container} = renderWithIntl(
            <SaveButton {...props}/>,
        );

        expect(container).toMatchSnapshot();
    });
});
