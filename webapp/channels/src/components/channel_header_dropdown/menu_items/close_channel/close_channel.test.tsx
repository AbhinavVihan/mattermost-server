// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import CloseChannel from './close_channel';
import {fireEvent, render, screen} from '@testing-library/react';

describe('components/ChannelHeaderDropdown/MenuItem.CloseChannel', () => {
    const baseProps = {
        isArchived: true,
        actions: {
            goToLastViewedChannel: jest.fn(),
        },
    };

    it('should match snapshot', () => {
        const wrapper = render(<CloseChannel {...baseProps}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('shoud be hidden if the channel is not archived', () => {
        const props = {
            ...baseProps,
            isArchived: false,
        };
        const wrapper = render(<CloseChannel {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('should runs goToLastViewedChannel function on click', () => {
        const props = {
            ...baseProps,
            actions: {
                ...baseProps.actions,
                goToLastViewedChannel: jest.fn(),
            },
        };
        const wrapper = render(<CloseChannel {...props}/>);
        fireEvent.click(screen.queryByText('Close Channel')!);
        expect(props.actions.goToLastViewedChannel).toHaveBeenCalled();
    });
});
