<script lang="ts">
  import Chip, { Set as ChipSet, Text, TrailingAction } from '@smui/chips';
  import Autocomplete from '@smui-extra/autocomplete';
  import type { Option } from '$lib/models/form';
  import type { DynamicFieldConfig, FieldConfig, ValidationResult } from '../FieldsConfig.js';
  import FieldHint from '../FieldHint.svelte';

  type InputProps = {
    onChange?: (value: string[]) => void;
    value?: string[];
    class?: string;
    label?: string;
    fieldConfig?: FieldConfig<string> | DynamicFieldConfig;
    options: Option[];
    validationResult?: ValidationResult;
    disabled?: boolean;
  };

  let {
    onChange,
    value = [],
    label,
    class: wrapperClass,
    fieldConfig,
    options,
    validationResult
  }: InputProps = $props();

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

  const onRemove = (event: CustomEvent<{ chipId: Option }>) => {
    event.preventDefault();
    const removedChip = event.detail;
    const removedKey = removedChip.chipId.key;
    const newValue = value.filter((val) => val !== removedKey);
    onChange?.(newValue);
  };

  // const getKey = (option: Option) => option.key;
  const getLabel = (option: Option) => {
    if (!option) return '';
    return option.label || option.key;
  };
</script>

<fieldset bind:this={element} class={['multi-select-input', wrapperClass]}>
  <legend>{label}</legend>
  <ChipSet {chips} nonInteractive key={(chip) => `${chip.key}`}>
    {#snippet chip(chip)}
      <Chip {chip} onSMUIChipRemoval={onRemove}>
        <Text>{chip.label}</Text>
        <TrailingAction icon$class="material-icons">cancel</TrailingAction>
      </Chip>
    {/snippet}
  </ChipSet>
  <Autocomplete
    options={filteredOptions}
    bind:value={inputValue}
    getOptionLabel={getLabel}
    selectOnExactMatch={false}
    showMenuWithNoInput
    onSMUIAutocompleteSelected={onSelect}
  >
    {#snippet noMatches()}
      <Text>Keine weiteren Optionen verfügbar</Text>
    {/snippet}
  </Autocomplete>
  <FieldHint {validationResult} {fieldConfig} />
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} />
  </div>
</fieldset>

<style lang="scss">
  .multi-select-input {
    padding-top: 1.2em;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    legend {
      font-size: 1.5em;
    }

    .field-footer {
      margin-top: 0.2em;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    :global(.mdc-text-field) {
      display: flex;
    }

    :global(.mdc-menu) {
      top: 56px !important;
      // calc(items * item height + top margin)
      max-height: calc(5 * 48px + 8px);

      :global([aria-disabled='true']) {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }
</style>
