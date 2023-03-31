// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import FileUploadOverlay from 'components/file_upload_overlay';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/FileUploadOverlay', () => {
    test('should match snapshot when file upload is showing with no overlay type', () => {
        const {container} = renderWithIntl(
            <FileUploadOverlay
                overlayType=''
            />,
        );

        container.className.includes('file-overlay');

        expect(container).toMatchSnapshot();
    });

    test('should match snapshot when file upload is showing with overlay type of right', () => {
        const {container} = renderWithIntl(
            <FileUploadOverlay
                overlayType='right'
            />,
        );

        container.className.includes('right-file-overlay');
        expect(container).toMatchSnapshot();
    });

    test('should match snapshot when file upload is showing with overlay type of center', () => {
        const {container} = renderWithIntl(
            <FileUploadOverlay
                overlayType='center'
            />,
        );
        container.className.includes('center-file-overlay');

        expect(container).toMatchSnapshot();
    });
});
