<script lang="ts">
  import Chip, { Set as ChipSet, Text, TrailingIcon } from '@smui/chips';
  import Autocomplete from '@smui-extra/autocomplete';
  import type { Option } from '$lib/models/form';
  import { page } from '$app/state';
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import FieldHint from '../FieldHint.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';

  type InputProps = {
    onChange?: (value: string[]) => void;
    value?: string[];
    class?: string;
    label?: string;
    explanation?: string;
    fieldConfig?: FullFieldConfig<string[]>;
    options: Option[];
    validationResult?: ValidationResult;
    disabled?: boolean;
  };

  const t = $derived(page.data.t);
  let {
    onChange,
    value = [],
    label,
    class: wrapperClass,
    explanation,
    fieldConfig,
    disabled = false,
    options,
    validationResult
  }: InputProps = $props();

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  let element: HTMLFieldSetElement;
  let inputValue = $state<string>();

  const chips = $derived<Option[]>(
    (value
      ?.map((val) => options.find((option) => option.key === val))
      .filter(Boolean) as Option[]) || []
  );

  const filteredOptions = $derived<Option[]>(
    options.filter((option) => !value?.includes(option.key))
  );

  const onSelect = (event: CustomEvent<Option>) => {
    event.preventDefault();

    // we don't want to show the selection in the input field
    inputValue = '';

    // TODO: list does not close on selection. workaround needed
    const selectedOption = event.detail;

    if (element) {
      element.querySelector('input')?.blur();
    }

    let uniqueValues = [];
    if (value) {
      uniqueValues = Array.from(new Set([...value, selectedOption.key]));
    } else {
      uniqueValues = [selectedOption.key];
    }
    onChange?.(uniqueValues);
  };

  const removeChip = (chip: Option) => {
    const removedKey = chip.key;
    const newValue = value.filter((val) => val !== removedKey);
    onChange?.(newValue);
  };

  const onRemove = (eventOrObj: CustomEvent<{ chipId: Option }> | { chipId: Option }) => {
    if ('detail' in eventOrObj) {
      eventOrObj.preventDefault?.();
      removeChip(eventOrObj.detail.chipId);
    } else {
      removeChip(eventOrObj.chipId);
    }
  };

  const getLabel = (option: Option) => {
    if (!option) return '';
    return option.label || option.key;
  };

  let isInvalid = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    return isEditingRole && !validationResult?.valid;
  });
</script>

<fieldset bind:this={element} class={['multi-select-input', wrapperClass, isInvalid && 'invalid']}>
  <legend>{label}</legend>
  <ChipSet {chips} nonInteractive key={(chip) => `${chip.key}`}>
    {#snippet chip(chip)}
      <Chip {chip} onSMUIChipRemoval={onRemove}>
        <Text>{chip.label}</Text>
        {#if !disabled}
          <TrailingIcon
            title={t('multiselectinput.remove', { keyword: chip.label })}
            class="material-icons remove-icon"
            onclick={() => removeChip(chip)}
          >
            close
          </TrailingIcon>
        {/if}
      </Chip>
    {/snippet}
  </ChipSet>
  {#if !disabled}
    <Autocomplete
      options={filteredOptions}
      bind:value={inputValue}
      getOptionLabel={getLabel}
      selectOnExactMatch={false}
      showMenuWithNoInput
      onSMUIAutocompleteSelected={onSelect}
    >
      {#snippet noMatches()}
        <Text>{t('multiselectinput.noOptions')}</Text>
      {/snippet}
    </Autocomplete>
  {/if}
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {explanation} />
  </div>
</fieldset>

<style lang="scss">
  :global(.multi-select-input) {
    padding-top: 1.2em;
    :global(.remove-icon) {
      cursor: pointer;
    }
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.invalid {
      border: 2px solid var(--mdc-theme-error) !important;
    }

    legend {
      font-size: 1.5em;
    }

    .field-footer {
      margin-top: 0.2em;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    :global(.smui-autocomplete) {
      justify-self: stretch;
    }

    :global(.mdc-text-field) {
      display: flex;
    }

    :global(.mdc-menu) {
      top: 56px !important;
      bottom: auto !important;
      // calc(items * item height + top margin)
      max-height: calc(5 * 48px + 8px);

      :global([aria-disabled='true']) {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }
</style>
