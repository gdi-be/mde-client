<script lang="ts">
  import type { ValidationResult } from '../FieldsConfig';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type InputProps = {
    key?: string;
    label?: string;
    maxlength?: number;
    value?: string;
    class?: string;
    onfocus?: (evt: FocusEvent) => void;
    onblur?: (evt: FocusEvent) => void;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    key,
    label,
    maxlength,
    value = $bindable(''),
    class: wrapperClass,
    validationResult,
    onblur,
    onfocus,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let focused = $state(false);
  let showHelpText = $derived(focused || !isValid);
  let helpText = $derived(validationResult?.helpText);
</script>

<fieldset class={['text-input', wrapperClass]}>
  <legend>{label}</legend>
  <input
    type="text"
    id={key}
    onfocus={(evt) => {
      focused = true;
      onfocus?.(evt);
    }}
    onblur={(evt) => {
      focused = false;
      onblur?.(evt);
    }}
    bind:value
    {maxlength}
    {...restProps}
  />
  <div class="field-footer">
    <div class={['help-text', isValid ? 'valid' : 'invalid']}>
      {#if showHelpText}
        {helpText}
      {/if}
    </div>
    {#if maxlength}
      <div class="character-counter">
        {value.length} / {maxlength}
      </div>
    {/if}
  </div>
</fieldset>

<style lang="scss">
  .text-input {
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    legend {
      font-size: 1.5em;
    }

    input {
      font-size: 1em;
      padding-bottom: 0.5em;
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.42);

      &:focus {
        outline: none;
        border-color: var(--mdc-theme-primary);
        border-width: 2px;
        padding-bottom: calc(0.5em - 1px);
      }
    }

    .field-footer {
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

      .character-counter {
        color: var(--mdc-theme-text-primary-on-background);
        opacity: 0.75;
        font-size: 0.75em;
      }
    }

  }
</style>
