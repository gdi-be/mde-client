<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { ValidationResult } from '../FieldsConfig';

  type InputProps = {
    value?: string;
    key?: string;
    label?: string;
    class?: string;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    key,
    label,
    value = $bindable(''),
    class: wrapperClass,
    validationResult,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let focused = $state(false);
  let showHelpText = $derived(focused || !isValid);
  let helpText = $derived(validationResult?.helpText);
</script>

<fieldset class={['date-input', wrapperClass]}>
  <legend>{label}</legend>
  <input
    type="date"
    id={key}
    name={key}
    bind:value
    {...restProps}
  />
  <div class="field-footer">
    <div class={['help-text', isValid ? 'valid' : 'invalid']}>
      {#if showHelpText}
        {helpText}
      {/if}
    </div>
  </div>
</fieldset>

<style lang="scss">
  .date-input {
    padding-top: 1.2em;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    legend {
      font-size: 1.5em;
    }

    input {
      font-family: 'Roboto';
      font-size: 1em;
      border-radius: 0.25em;
      border: 1px solid grey;
      padding: 0.25em;
      margin-top: 0.5em;
      outline-width: 0;
      align-self: flex-start;
    }

    .field-footer {
      height: 1em;
      margin-top: 0.2em;
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
  }
</style>
