<script lang="ts">
  import type { ValidationResult } from '../FieldsConfig';
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  type InputProps = {
    key: string;
    label?: string;
    maxlength?: number;
    value?: string;
    class?: string;
    validationResult?: ValidationResult;
  } & HTMLTextareaAttributes;

  let {
    key,
    label,
    maxlength,
    value = $bindable(),
    class: wrapperClass,
    validationResult,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let focused = $state(false);
  let showHelpText = $derived(focused || !isValid);
  let helpText = $derived(validationResult?.helpText);
</script>

<fieldset class={['text-area-input', wrapperClass]}>
  <legend>{label}</legend>
  <textarea id={key} {maxlength} bind:value {...restProps}></textarea>
  <div class="field-footer">
    <div class={['help-text', isValid ? 'valid' : 'invalid']}>
      {#if showHelpText}
        {helpText}
      {/if}
    </div>
    {#if maxlength}
      <div class="character-counter">
        {value ? value.length : 0} / {maxlength}
      </div>
    {/if}
  </div>
</fieldset>

<style lang="scss">
  .text-area-input {
    padding-top: 1.2em;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    legend {
      font-size: 1.5em;
    }

    textarea {
      font-size: 1em;
      font-family: arial;
      padding-bottom: 0.5em;
      padding: 0.5em;
      border: none;
      border-radius: 0.125em;
      outline: 1px solid rgba(0, 0, 0, 0.42);

      &:focus {
        outline-color: var(--mdc-theme-primary);
        outline-width: 2px;
      }
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

      .character-counter {
        color: var(--mdc-theme-text-primary-on-background);
        opacity: 0.75;
        font-size: 0.75em;
      }
    }
  }
</style>
