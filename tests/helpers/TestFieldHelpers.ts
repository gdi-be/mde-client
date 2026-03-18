/* eslint-disable @typescript-eslint/no-unused-vars */
import { screen, fireEvent, waitFor, within } from '@testing-library/svelte';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';

import { fetchMock } from '../setup';
import { FieldConfigs } from '$lib/components/Form/FieldsConfig';
import { tick } from 'svelte';

type FieldType =
  | 'text' // TextInput.svelte
  | 'textarea' // TextAreaInput.svelte
  | 'number' // NumberInput.svelte
  | 'date' // DateInput.svelte
  | 'select' // SelectInput.svelte
  | 'radio' // RadioInput.svelte
  | 'multiselect' // MultiSelectInput.svelte
  | 'switch'
  | 'collection' // Multiple fields in a collection item
  | 'service'; // fields in the layer subform

interface TestFieldOptions {
  fieldset?: HTMLElement;
  fieldType?: FieldType;

  // For text/textarea/number/date inputs
  fieldInput?: string | number;
  maxLength?: number;

  // For select/radio inputs
  selectOptionText?: string;
  selectOptionValue?: string | number;

  // For multiselect
  multiSelectOptions?: string[];

  // For radio
  radioOptionKey?: string;

  // For switch
  switchValue?: boolean;

  // Validation
  requiredMessage?: string;
  expectInvalidClass?: boolean;

  // Help
  help?: boolean;

  // Progress tracking
  testProgress?: {
    section: string;
    label?: string;
    expectIncrease?: boolean;
    expectDecrease?: boolean;
    expectNoChange?: boolean;
  };

  // For collection
  addButtonTitle?: string;
  collectionFields?: Array<{
    fieldKey: string;
    fieldType: Exclude<FieldType, 'collection'>;
    fieldInput?: string | number;
    optionsCode?: string;
    fieldsetSelector: () => HTMLElement;
    help?: boolean;
    maxLength?: number;
  }>;
}

function extractBaseKey(key: string): string {
  const firstDotIndex = key.indexOf('.');
  if (firstDotIndex === -1) {
    return key;
  }

  const rest = key.slice(firstDotIndex + 1);
  const match = rest.match(/^([^[.\]]+)/);
  if (!match) {
    return key;
  }

  const firstSegment = match[1];

  return key.slice(0, firstDotIndex) + '.' + firstSegment;
}

function getProgressValue(bar: Element): number {
  let progress = 0;
  const ariaValueNow = bar.getAttribute('aria-valuenow');
  if (ariaValueNow) {
    progress = parseFloat(ariaValueNow);
    if (progress > 1) {
      progress = progress / 100;
    }
  }

  if (progress === 0) {
    const progressBarInner = bar.querySelector('.mdc-linear-progress__bar-inner');
    if (progressBarInner) {
      const parentBar = progressBarInner.parentElement;
      if (parentBar) {
        const transform = window.getComputedStyle(parentBar).transform;
        const scaleMatch = transform.match(/scaleX\(([\d.]+)\)/);
        if (scaleMatch) {
          progress = parseFloat(scaleMatch[1]);
        }
      }
    }
  }

  return progress;
}

async function waitForPatchCall(
  previousCallCount: number,
  predicate: (body: unknown, call: unknown[]) => boolean
): Promise<RequestInit> {
  return await waitFor(() => {
    const calls = fetchMock.mock.calls.slice(previousCallCount);

    for (const call of calls) {
      const [, requestInit] = call;

      if (requestInit?.method !== 'PATCH') continue;

      const body = requestInit.body ? JSON.parse(requestInit.body as string) : null;

      if (predicate(body, call)) {
        return requestInit as RequestInit;
      }
    }

    throw new Error('No matching PATCH call yet');
  });
}

async function testTextInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, fieldInput, requiredMessage, maxLength, expectInvalidClass } = options;

  const input = await within(fieldset!).findByRole('textbox');
  expect(input).toBeInTheDocument();

  if (maxLength) {
    expect(input).toHaveAttribute('maxlength', maxLength.toString());
    const counter = within(fieldset!).getByText(new RegExp(`/ ${maxLength}`));
    expect(counter).toBeInTheDocument();
  }

  await userEvent.click(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  if (requiredMessage) {
    await waitFor(() => {
      expect(screen.queryByText(requiredMessage)).toBeVisible();
    });
  }

  await userEvent.clear(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  await userEvent.type(input, fieldInput as string);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const previousCallCount = fetchMock.mock.calls.length;

  await fireEvent.blur(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const requestInit = await waitForPatchCall(previousCallCount, (body) => {
    return JSON.stringify(body).includes(fieldInput as string);
  });
  const body = JSON.parse(requestInit.body as string);

  if (body.key) {
    expect(extractBaseKey(body.key)).toBe(extractBaseKey(fieldKey));
  }

  let value = body.layers || body.value;

  if (value.default) {
    value = body.value.default;
  }

  if (Array.isArray(value)) {
    value = value[value.length - 1];
  }

  if (typeof value === 'object' && value.legendImage) {
    value = value.legendImage;
  }

  if (typeof value === 'object') {
    expect(JSON.stringify(value)).toContain(String(fieldInput));
  } else {
    expect(value).toContain(fieldInput);
  }

  await waitFor(() => {
    expect(input).toHaveValue(fieldInput as string);
  });

  if (maxLength) {
    const counter = within(fieldset!).getByText(
      new RegExp(`${(fieldInput as string).length} / ${maxLength}`)
    );
    expect(counter).toBeInTheDocument();
  }

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });

  if (expectInvalidClass !== undefined) {
    if (expectInvalidClass) {
      expect(fieldset).toHaveClass('invalid');
    } else {
      expect(fieldset).not.toHaveClass('invalid');
    }
  }

  if (maxLength) {
    const longInput = 'x'.repeat(maxLength);
    const longInputAdd = 'x'.repeat(maxLength + 10);
    await userEvent.click(input!);
    await tick();
    await new Promise((r) => setTimeout(r, 0));
    await userEvent.clear(input!);
    await tick();
    await new Promise((r) => setTimeout(r, 0));
    await userEvent.type(input!, longInputAdd);
    await tick();
    await new Promise((r) => setTimeout(r, 0));
    await fireEvent.blur(input!);
    await tick();
    await new Promise((r) => setTimeout(r, 0));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.any(URL), {
        method: 'PATCH',
        body: JSON.stringify({
          key: fieldKey,
          value: longInput
        }),
        headers: {
          'content-type': 'application/json'
        }
      });
    });
  }
}

async function testTextAreaInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, fieldInput, maxLength } = options;

  const textarea = await waitFor(() => {
    const el = fieldset!.querySelector('textarea');
    expect(el).toBeInTheDocument();
    return el as HTMLElement;
  });

  if (maxLength) {
    expect(textarea).toHaveAttribute('maxlength', maxLength.toString());
  }

  const previousCallCount = fetchMock.mock.calls.length;

  await userEvent.click(textarea!);
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  await userEvent.clear(textarea!);
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  await userEvent.type(textarea!, fieldInput as string);
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  await fireEvent.blur(textarea!);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const requestInit = await waitForPatchCall(previousCallCount, (body) => {
    return JSON.stringify(body).includes(fieldKey!);
  });
  const body = JSON.parse(requestInit.body as string);

  expect(extractBaseKey(body.key)).toBe(extractBaseKey(fieldKey));
  expect(body.value).toBe(fieldInput);

  await waitFor(() => {
    expect(textarea).toHaveValue(fieldInput as string);
  });

  if (maxLength) {
    const counter = within(fieldset!).getByText(
      new RegExp(`${(fieldInput as string).length} / ${maxLength}`)
    );
    expect(counter).toBeInTheDocument();
  }

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });

  if (maxLength) {
    const longInput = 'x'.repeat(maxLength);
    const longInputAdd = 'x'.repeat(maxLength + 10);
    await userEvent.click(textarea!);
    await tick();
    await new Promise((r) => setTimeout(r, 0));
    await userEvent.clear(textarea!);
    await tick();
    await new Promise((r) => setTimeout(r, 0));
    await userEvent.type(textarea!, longInputAdd);
    await tick();
    await new Promise((r) => setTimeout(r, 0));
    await fireEvent.blur(textarea!);
    await tick();
    await new Promise((r) => setTimeout(r, 0));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.any(URL), {
        method: 'PATCH',
        body: JSON.stringify({
          key: fieldKey,
          value: longInput
        }),
        headers: {
          'content-type': 'application/json'
        }
      });
    });
  }
}

async function testNumberInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, fieldInput } = options;

  const input = await waitFor(() => {
    const el = fieldset!.querySelector('input[type="number"]');
    expect(el).toBeInTheDocument();
    return el as HTMLElement;
  });

  await userEvent.click(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  await userEvent.clear(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  await userEvent.type(input, fieldInput!.toString());
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  await fireEvent.blur(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  const previousCallCount = fetchMock.mock.calls.length;

  const requestInit = await waitForPatchCall(previousCallCount, (body) => {
    return JSON.stringify(body).includes(fieldInput as string);
  });
  let body = JSON.parse(requestInit.body as string);

  if (body.value == null) {
    const requestInit = await waitForPatchCall(previousCallCount + 1, (body) => {
      return JSON.stringify(body).includes(fieldKey!);
    });
    body = JSON.parse(requestInit.body as string);
  }

  expect(extractBaseKey(body.key)).toBe(extractBaseKey(fieldKey));

  let value = body.value;
  if (body.value.default) {
    value = body.value.default;
  }

  if (Array.isArray(value)) {
    value = value[value.length - 1];
  }

  if (typeof value === 'object') {
    expect(JSON.stringify(value)).toContain(Number(fieldInput));
  } else {
    expect(body.value).toContain(Number(fieldInput));
  }

  await waitFor(() => {
    expect(input).toHaveValue(Number(fieldInput));
  });

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });
}

async function testDateInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, fieldInput } = options;

  const input = await waitFor(() => {
    const el = fieldset!.querySelector('input[type="date"]');
    expect(el).toBeInTheDocument();
    return el as HTMLElement;
  });

  await userEvent.click(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const previousCallCount = fetchMock.mock.calls.length;
  await fireEvent.change(input, { target: { value: fieldInput } });
  await tick();
  await new Promise((r) => setTimeout(r, 0));
  await fireEvent.blur(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const requestInit = await waitForPatchCall(previousCallCount, (body) => {
    return JSON.stringify(body).includes(fieldKey!);
  });
  const body = JSON.parse(requestInit.body as string);

  expect(extractBaseKey(body.key)).toBe(extractBaseKey(fieldKey));
  const dateValue = body.value;
  if (dateValue) {
    const date = new Date(dateValue);
    expect(date.toISOString().split('T')[0]).toBe(fieldInput);
  }

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });
}

async function testSelectInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, selectOptionText, selectOptionValue, requiredMessage } = options;

  await userEvent.click(fieldset!);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  if (requiredMessage) {
    await waitFor(() => {
      expect(screen.queryByText(requiredMessage)).toBeVisible();
    });
  }

  const option = await within(fieldset!).findByRole('option', {
    name: selectOptionText!
  });

  const previousCallCount = fetchMock.mock.calls.length;

  await userEvent.click(option);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const requestInit = await waitForPatchCall(previousCallCount, (body) => {
    return JSON.stringify(body).includes(selectOptionValue as string);
  });
  const body = JSON.parse(requestInit.body as string);

  expect(extractBaseKey(body.key)).toBe(extractBaseKey(fieldKey));
  let value = body.value;
  if (body.value.default) {
    value = body.value.default;
  }

  if (Array.isArray(value)) {
    value = value[value.length - 1];
  }

  if (typeof value === 'object') {
    expect(JSON.stringify(value)).toContain(String(selectOptionValue));
  } else {
    expect(value).toBe(selectOptionValue);
  }
  
  if (selectOptionText) {
    await waitFor(() => {
      const candidates = Array.from(document.querySelectorAll('[aria-selected="true"]'));
      const match = candidates.find(el =>
        el.textContent?.includes(selectOptionText!)
      );
      expect(match).toBeDefined();
    });
  };

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });
}

async function testRadioInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, radioOptionKey } = options;

  const previousCallCount = fetchMock.mock.calls.length;

  const radioInput = await waitFor(() => {
    const el = fieldset!.querySelector(`input[value="${radioOptionKey}"]`);
    expect(el).toBeInTheDocument();
    return el as HTMLElement;
  });

  await userEvent.click(radioInput);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const requestInit = await waitForPatchCall(previousCallCount, (body) => {
    return JSON.stringify(body).includes(fieldKey!);
  });
  const body = JSON.parse(requestInit.body as string);

  expect(extractBaseKey(body.key)).toBe(fieldKey);

  await waitFor(() => {
    expect(radioInput).toBeChecked();
  });

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });
}

async function testSwitchInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, switchValue = true } = options;

  await waitFor(() => {
    expect(fieldset).toBeInTheDocument();
  });

  const switchElement = within(fieldset!).getByRole('switch');

  await userEvent.click(switchElement);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          key: fieldKey,
          value: switchValue
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
    );
  });

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });

  await waitFor(() => {
    const updatedSwitch = within(fieldset!).getByRole('switch');
    if (switchValue) {
      expect(updatedSwitch).toHaveClass('mdc-switch--selected');
    } else {
      expect(updatedSwitch).not.toHaveClass('mdc-switch--selected');
    }
  });
}

async function testMultiSelectInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, multiSelectOptions = [], testProgress } = options;

  let initialProgress: number | undefined;
  let progressBar: Element | undefined;

  if (testProgress) {
    const tabButton = screen.getAllByRole('button', {
      name: new RegExp(testProgress.label || testProgress.section, 'i')
    })[0];
    const tabContainer = tabButton.closest('.tab-container');

    if (tabContainer) {
      progressBar = within(tabContainer as HTMLElement).queryByRole('progressbar') || undefined;
      if (progressBar) {
        initialProgress = getProgressValue(progressBar);
      }
    }
  }

  for (const optionText of multiSelectOptions) {
    const autocomplete = fieldset!.querySelector('.smui-autocomplete') as HTMLElement;

    const input = within(autocomplete).getByRole('textbox');

    const previousCallCount = fetchMock.mock.calls.length;

    await userEvent.type(input, optionText.substring(0, 3));
    await tick();
    await new Promise((r) => setTimeout(r, 0));

    await waitFor(() => {
      expect(within(fieldset!).getAllByRole('menuitem').length).toBeGreaterThan(0);
      expect(within(fieldset!).queryByText('multiselectinput.noOptions')).not.toBeInTheDocument();
    });

    const menuItem = await waitFor(() => within(fieldset!).getByText(optionText));
    await userEvent.click(menuItem);
    await tick();
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
    await new Promise((r) => setTimeout(r, 0));

    const requestInit = await waitForPatchCall(previousCallCount, (body) => {
      return JSON.stringify(body).includes(fieldKey!);
    });
    const body = JSON.parse(requestInit.body as string);
    expect(extractBaseKey(body.key)).toBe(fieldKey);

    let value = body.value;
    if (body.value.default) {
      value = body.value.default;
    }

    if (Array.isArray(value) && typeof value[0] === 'object') {
      value = Object.values(value[0]);
    }

    if (typeof value === 'object') {
      value = Object.values(value);
    }

    expect(value).toContain(optionText);

    await waitFor(() => {
      const chip = within(fieldset!).getAllByText(optionText)[0];
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass('mdc-chip__text');
    });
  }

  if (testProgress && progressBar && initialProgress !== undefined) {
    await waitFor(
      () => {
        const newProgress = getProgressValue(progressBar!);

        if (testProgress.expectIncrease) {
          expect(newProgress).toBeGreaterThan(initialProgress!);
        } else if (testProgress.expectDecrease) {
          expect(newProgress).toBeLessThan(initialProgress!);
        } else if (testProgress.expectNoChange) {
          expect(newProgress).toBe(initialProgress!);
        }
      },
      { timeout: 3000 }
    );
  }

  if (multiSelectOptions.length > 0) {
    const previousCallCount = fetchMock.mock.calls.length;

    const firstChipText = multiSelectOptions[0];

    const closeButton = within(fieldset!).queryAllByText('close')[0];

    if (closeButton) {
      await userEvent.click(closeButton);
      await tick();
      await new Promise((r) => setTimeout(r, 0));

      const requestInit = await waitForPatchCall(previousCallCount, (body) => {
        return JSON.stringify(body).includes(fieldKey!);
      });
      const body = JSON.parse(requestInit.body as string);

      expect(extractBaseKey(body.key)).toBe(fieldKey);
      let value = body.value;
      if (body.value.default) {
        value = body.value.default;
      }

      if (typeof value === 'object') {
        value = Object.values(value);
      }

      expect(value).not.toContain(firstChipText);

      await waitForPatchCall(previousCallCount, (body) => {
        return JSON.stringify(body).includes(fieldKey!);
      });

      await waitFor(() => {
        expect(within(fieldset!).queryAllByText(firstChipText)).toHaveLength(1);
      });
    }
  }

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });
}

async function testCollectionInput(options: TestFieldOptions): Promise<void> {
  const n = within(options.fieldset!).queryAllByRole('button', { name: 'delete' }).length;

  await userEvent.click(within(options.fieldset!).getByTitle(options.addButtonTitle!));
  await tick();
  await waitFor(() => {
    expect(document.body).toBeInTheDocument();
  });
  await new Promise((r) => setTimeout(r, 0));

  const nNew = within(options.fieldset!).queryAllByRole('button', { name: 'delete' }).length;

  await waitFor(async () => {
    expect(
      within(options.fieldset!).queryAllByRole('button', { name: 'delete' }).length
    ).toBeGreaterThan(0);
    expect(
      within(options.fieldset!).getAllByRole('button', { name: 'delete' })[0]
    ).not.toBeDisabled();
    expect(nNew).toBe(n + 1);
  });

  if (options.collectionFields) {
    const fields = options.collectionFields;

    const initialCallCount = fetchMock.mock.calls.length;

    for (let i = 0; i < fields.length; i++) {
      const fieldConfig = fields[i];

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(`/help/${fieldConfig.fieldKey}`);
      });

      const fieldset = fieldConfig.fieldsetSelector();
      if (fieldConfig.fieldType === 'text') {
        const input = within(fieldset).getByRole('textbox') as HTMLInputElement;
        await userEvent.click(input);
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await userEvent.clear(input);
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await userEvent.type(input, fieldConfig.fieldInput as string);
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await fireEvent.blur(input);
        await tick();
        await new Promise((r) => setTimeout(r, 0));

        await waitFor(() => {
          expect(input).toHaveValue(fieldConfig.fieldInput as string);
        });
      } else if (fieldConfig.fieldType === 'select') {
        const option = await waitFor(() =>
          within(fieldset!).getByRole('option', { name: String(fieldConfig.fieldInput) })
        );
        await userEvent.click(option);
        await waitFor(() => {
          expect(document.body).toBeInTheDocument();
        });
        await tick();
        await new Promise((r) => setTimeout(r, 0));
      } else if (fieldConfig.fieldType === 'date') {
        const input = fieldset!.querySelector('input[type="date"]') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        await userEvent.click(input);
        await tick();
        await new Promise((r) => setTimeout(r, 0));
        await fireEvent.change(input, { target: { value: String(fieldConfig.fieldInput) } });
        await tick();
        await new Promise((r) => setTimeout(r, 0));
        await fireEvent.blur(input);
        await tick();
        await new Promise((r) => setTimeout(r, 0));
      } else {
        throw new Error(`Unsupported field type in collection: ${fieldConfig.fieldType}`);
      }

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          expect.any(URL),
          expect.objectContaining({
            method: 'PATCH',
            body: expect.stringContaining(
              fieldConfig.fieldType === 'select'
                ? String(fieldConfig.optionsCode)
                : String(fieldConfig.fieldInput)
            ),
            headers: {
              'content-type': 'application/json'
            }
          })
        );
      });

      await waitFor(() => {
        expect(document.querySelector('.running')).toBeVisible();
      });

      await new Promise((r) => setTimeout(r, 50));
    }
  }
}

async function testServiceInput(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldset, fieldInput, requiredMessage } = options;

  const input = await within(fieldset!).findByRole('textbox');

  await userEvent.click(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  if (requiredMessage) {
    await waitFor(() => {
      expect(screen.queryByText(requiredMessage)).toBeVisible();
    });
  }

  await userEvent.clear(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  await userEvent.type(input, fieldInput as string);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  const previousCallCount = fetchMock.mock.calls.length;

  await fireEvent.blur(input);
  await tick();
  await new Promise((r) => setTimeout(r, 0));

  await waitForPatchCall(previousCallCount, (body) => {
    return JSON.stringify(body).includes(fieldInput as string);
  });

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining(fieldInput as string),
        headers: {
          'content-type': 'application/json'
        }
      })
    );
  });

  await waitFor(() => {
    expect(input).toHaveValue(fieldInput as string);
  });

  await waitFor(() => {
    expect(document.querySelector('.running')).toBeVisible();
  });
}

export const isRequiredField = (fieldKey: string, section: string) => {
  return FieldConfigs.some(
    (config) => config.key === fieldKey && config.section === section && config.required
  );
};

export async function testField(fieldKey: string, options: TestFieldOptions): Promise<void> {
  const { fieldType = 'text', testProgress } = options;

  let initialProgress: number | undefined;
  let progressBar: Element | undefined;

  if (testProgress) {
    const tabButton = screen.getAllByRole('button', {
      name: new RegExp(testProgress.label || testProgress.section, 'i')
    })[0];
    const tabContainer = tabButton.closest('.tab-container');

    if (tabContainer) {
      progressBar = within(tabContainer as HTMLElement).queryByRole('progressbar') || undefined;
      if (progressBar) {
        initialProgress = getProgressValue(progressBar);
      }
    }
  }

  if (options.help) {
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(`/help/${fieldKey}`);
    });
  }

  switch (fieldType) {
    case 'text':
      await testTextInput(fieldKey, options);
      break;

    case 'textarea':
      await testTextAreaInput(fieldKey, options);
      break;

    case 'number':
      await testNumberInput(fieldKey, options);
      break;

    case 'date':
      await testDateInput(fieldKey, options);
      break;

    case 'select':
      await testSelectInput(fieldKey, options);
      break;

    case 'radio':
      await testRadioInput(fieldKey, options);
      break;

    case 'switch':
      await testSwitchInput(fieldKey, options);
      break;

    case 'multiselect':
      await testMultiSelectInput(fieldKey, options);
      break;

    case 'collection':
      await testCollectionInput(options);
      break;

    case 'service':
      await testServiceInput(fieldKey, options);
      break;
  }

  if (testProgress && fieldType !== 'multiselect' && progressBar && initialProgress !== undefined) {
    await waitFor(
      () => {
        const newProgress = getProgressValue(progressBar!);

        if (testProgress.expectIncrease) {
          expect(newProgress).toBeGreaterThan(initialProgress!);
        } else if (testProgress.expectDecrease) {
          expect(newProgress).toBeLessThan(initialProgress!);
        } else if (testProgress.expectNoChange) {
          expect(newProgress).toBe(initialProgress!);
        }
      },
      { timeout: 3000 }
    );
  }
}
