<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import HelperText from '@smui/textfield/helper-text';
  import type { ValidationResult } from '../FieldsConfig';

  type InputProps = {
    value?: string;
    key?: string;
    label?: string;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    key,
    label,
    value = $bindable(''),
    validationResult,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let helpText = $derived(validationResult?.helpText);
</script>

<div class="date-input">
  <label for={key}>{label}</label>
  <input
    type="date"
    id={key}
    name={key}
    bind:value
    {...restProps}
  />
  {#if helpText}
    <HelperText persistent={!isValid} class={isValid ? 'valid' : 'invalid'}>
      {helpText}
    </HelperText>
  {/if}
</div>

<style lang="scss">
  .date-input {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5em;

    input {
      font-family: 'Roboto';
      font-size: 1em;
      border-radius: 0.25em;
      border: 1px solid grey;
      padding: 0.25em;
      outline-width: 0;
    }

    :global(.mdc-text-field-helper-text.valid) {
      color: var(--mdc-theme-text-primary-on-background);
    }
    :global(.mdc-text-field-helper-text.invalid) {
      color: var(--mdc-theme-error);
    }
  }
</style>
