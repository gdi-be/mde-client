<script lang="ts">
  import Select, { Option as SelectOption } from '@smui/select';
  import type { Option } from '$lib/models/form';
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import FieldHint from '../FieldHint.svelte';

  type InputProps = {
    onChange?: (value: string) => void;
    value?: string;
    class?: string;
    label?: string;
    fieldConfig?: FullFieldConfig<string>;
    options: Option[];
    validationResult?: ValidationResult;
    disabled?: boolean;
  };

  let {
    onChange,
    value = $bindable<string | undefined>(undefined),
    label,
    class: wrapperClass,
    fieldConfig,
    options,
    disabled = false,
    validationResult
  }: InputProps = $props();

  let element = $state();

  // Remove duplicates
  options = Array.from(new Map(options.map((item) => [item.key, item])).values());

  const onSelect = (newValue: string) => {
    onChange?.(newValue);
  };

  const selectedDescription = $derived(options.find((item) => item.key === value)?.description);
</script>

<fieldset class={['select-input', wrapperClass]}>
  <legend>{label}</legend>
  <Select bind:this={element} {disabled} menu$anchorElement={document.body} bind:value>
    {#each options as option}
      <SelectOption
        onSMUIAction={() => {
          if (option.disabled) return;
          onSelect(option.key);
        }}
        value={option.key}
        disabled={option.disabled}
      >
        {option.label}
      </SelectOption>
      {#if option.description && !option.disabled}
        <div class="option-description">{option.description}</div>
      {/if}
    {/each}
  </Select>
  <div class="selected-description">{selectedDescription}</div>
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} />
  </div>
</fieldset>

<style lang="scss">
  .select-input {
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

    :global(.mdc-menu) {
      top: 56px !important;
      bottom: auto !important;
      // calc(items * item height + top margin)
      max-height: calc(5 * 48px + 8px);

      :global([aria-disabled='true']) {
        display: none;
      }
    }

    :global(li:hover + .option-description) {
      background-color: #f5f5f5;
    }

    :global(li[aria-selected='true'] + .option-description) {
      background-color: #d6d6d6;
      color: black;
    }

    .option-description {
      font-size: 0.66em;
      color: grey;
      padding-left: 3em;
      padding-bottom: 1em;
      line-height: 1em;
      border-bottom: 1px solid lightgrey;
    }

    .selected-description {
      font-size: 0.66em;
      color: grey;
      padding: 0.5em;
      line-height: 1em;
    }
  }
</style>
