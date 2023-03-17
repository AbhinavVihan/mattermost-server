// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import * as useOpenPricingModal from 'components/common/hooks/useOpenPricingModal';

import AtPlanMention from './index';
import {renderWithIntl} from 'tests/react_testing_utils';
import {fireEvent, screen} from '@testing-library/react';

describe('components/AtPlanMention', () => {
    it('should open pricing modal when plan mentioned is trial', () => {
        const openPricingModal = jest.fn();
        jest.spyOn(useOpenPricingModal, 'default').mockImplementation(() => openPricingModal);

        renderWithIntl(<AtPlanMention plan='Enterprise trial'/>);
        fireEvent.click(screen.getByTestId('at_plan_mention'));

        expect(openPricingModal).toHaveBeenCalledTimes(1);
    });

    it('should open pricing modal when plan mentioned is Enterprise', () => {
        const openPricingModal = jest.fn();
        jest.spyOn(useOpenPricingModal, 'default').mockImplementation(() => openPricingModal);

        renderWithIntl(<AtPlanMention plan='Enterprise plan'/>);
        fireEvent.click(screen.getByTestId('at_plan_mention'));

        expect(openPricingModal).toHaveBeenCalledTimes(1);
    });

    it('should open purchase modal when plan mentioned is professional', () => {
        const openPricingModal = jest.fn();
        jest.spyOn(useOpenPricingModal, 'default').mockImplementation(() => openPricingModal);

        renderWithIntl(<AtPlanMention plan='Professional plan'/>);
        fireEvent.click(screen.getByTestId('at_plan_mention'));

        expect(openPricingModal).toHaveBeenCalledTimes(1);
    });
});
