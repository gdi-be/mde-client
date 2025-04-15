<script lang="ts">
  import Select, { Option as SelectOption } from '@smui/select';
  import type { Option } from '$lib/models/form';
  import type { ValidationResult } from '../FieldsConfig.ts';

  type InputProps = {
    onChange?: (value: string) => void;
    value?: string;
    key: string;
    class?: string;
    label?: string;
    options: Option[];
    validationResult?: ValidationResult;
    disabled?: boolean;
  };

  let {
    onChange,
    value = $bindable<string | undefined>(undefined),
    key,
    label,
    class: wrapperClass,
    options,
    disabled = false,
    validationResult
  }: InputProps = $props();

  let element = $state();
  let isValid = $derived(validationResult?.valid !== false);
  let focused = $state(false);
  let showHelpText = $derived(focused || !isValid);
  let helpText = $derived(validationResult?.helpText);

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
    input$name={key}
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
    <div class={['help-text', isValid ? 'valid' : 'invalid']}>
      {#if showHelpText}
        {helpText}
      {/if}
    </div>
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
      height: 1em;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .help-text {
        color: var(--mdc-theme-text-primary-on-background);
        font-size: 0.75em;

        &.invalid {
          color: var(--mdc-theme-error);
        }
      }
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
