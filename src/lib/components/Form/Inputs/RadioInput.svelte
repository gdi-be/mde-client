<script lang="ts">
  import type { Option } from '$lib/models/form';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';
  import type { ValidationResult } from '../FieldsConfig';

  type InputProps = {
    onChange?: (value: string) => void;
    key: string;
    label?: string;
    value?: string;
    options: Option[];
    validationResult?: ValidationResult;
  };

  let {
    onChange,
    value = $bindable<string>(),
    key,
    label,
    options,
    validationResult
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let focused = $state(false);
  let showHelpText = $derived(focused || !isValid);
  let helpText = $derived(validationResult?.helpText);

  const onSelect = () => {
    onChange?.(value);
  };
</script>

<fieldset class="radio-input">
  <legend>{label}</legend>
  <div id={`${key}-radio-group`} class="radio-group">
    {#each options as option}
      <FormField>
        <Radio id={option.key} onchange={onSelect} bind:group={value} value={option.key} />
        {#snippet label()}
          <label for={option.key}>{option.label}</label>
        {/snippet}
      </FormField>
    {/each}
  </div>
  <div class="field-footer">
    <div class={['help-text', isValid ? 'valid' : 'invalid']}>
      {#if showHelpText}
        {helpText}
      {/if}
    </div>
  </div>
</fieldset>

<style lang="scss">
  .radio-input {
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

    .radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
    }
  }
</style>
