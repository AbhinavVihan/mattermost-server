// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {fireEvent, screen} from '@testing-library/react';

import {Provider} from 'react-redux';

import {renderWithIntl} from 'tests/react_testing_utils';
import store from 'stores/redux_store';

import AutocompleteSelector from './autocomplete_selector';

describe('components/widgets/settings/AutocompleteSelector', () => {
    test('render component with required props', () => {
        const {container} = renderWithIntl(
            <Provider store={store}>
                <AutocompleteSelector
                    id='string.id'
                    label='some label'
                    value='some value'
                    providers={[]}
                />
            </Provider>,
        );
        expect(container).toMatchInlineSnapshot(`
            <div>
              <div
                class="form-group"
                data-testid="autoCompleteSelector"
              >
                <label
                  class="control-label "
                >
                  some label
                </label>
                <div
                  class=""
                >
                  <div
                    class="select-suggestion-container"
                  >
                    <div
                      aria-live="polite"
                      class="sr-only"
                      role="alert"
                    />
                    <div>
                      <input
                        autocomplete="off"
                        class="form-control"
                        data-testid="suggestionBox-input"
                        value="some value"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `);
    });

    test('check snapshot with value prop and changing focus', () => {
        const {container} = renderWithIntl(
            <Provider store={store}>
                <AutocompleteSelector
                    providers={[]}
                    label='some label'
                    value='value from prop'
                />
            </Provider>,
        );

        const inputNode = screen.getByTestId('suggestionBox-input');
        fireEvent.focusOut(inputNode);

        expect(container).toMatchInlineSnapshot(`
            <div>
              <div
                class="form-group"
                data-testid="autoCompleteSelector"
              >
                <label
                  class="control-label "
                >
                  some label
                </label>
                <div
                  class=""
                >
                  <div
                    class="select-suggestion-container"
                  >
                    <div
                      aria-live="polite"
                      class="sr-only"
                      role="alert"
                    />
                    <div>
                      <input
                        autocomplete="off"
                        class="form-control"
                        data-testid="suggestionBox-input"
                        value="value from prop"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `);

        fireEvent.change(inputNode, {target: {value: 'value from input'}});

        fireEvent.focus(inputNode);

        expect(container).toMatchInlineSnapshot(`
            <div>
              <div
                class="form-group"
                data-testid="autoCompleteSelector"
              >
                <label
                  class="control-label "
                >
                  some label
                </label>
                <div
                  class=""
                >
                  <div
                    class="select-suggestion-container"
                  >
                    <div
                      aria-live="polite"
                      class="sr-only"
                      role="alert"
                    />
                    <div>
                      <input
                        autocomplete="off"
                        class="form-control"
                        data-testid="suggestionBox-input"
                        value=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `);
    });

    test('onSelected', () => {
        const onSelected = jest.fn();
        const selected = {text: 'sometext', value: 'somevalue'};
        renderWithIntl(
            <Provider store={store}>
                <AutocompleteSelector
                    label='some label'
                    value='some value'
                    providers={[]}
                    onSelected={onSelected}
                />
            </Provider>,
        );

        onSelected(selected);

        expect(onSelected).toHaveBeenCalledTimes(1);
        expect(onSelected).toHaveBeenCalledWith(selected);
    });
});
