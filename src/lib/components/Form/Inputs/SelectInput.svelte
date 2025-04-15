<script lang="ts">
  import Select, { Option as SelectOption } from '@smui/select';
  import type { Option } from '$lib/models/form';
  import type { DynamicFieldConfig, FieldConfig, ValidationResult } from '../FieldsConfig.ts';
  import FieldHint from '../FieldHint.svelte';

  type InputProps = {
    onChange?: (value: string) => void;
    value?: string;
    class?: string;
    label?: string;
    fieldConfig?: FieldConfig<string> | DynamicFieldConfig;
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
</script>

<fieldset class={['select-input', wrapperClass]}>
  <legend>{label}</legend>
  <Select
    bind:this={element}
    {disabled}
    hiddenInput
    menu$anchorElement={document.body}
    bind:value
  >
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
    {/each}
  </Select>
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
      // calc(items * item height + top margin)
      max-height: calc(5 * 48px + 8px);

      :global([aria-disabled='true']) {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }
</style>
