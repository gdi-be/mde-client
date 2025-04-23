<script lang="ts">
  import {
    type DynamicFieldConfig,
    type FieldConfig,
    type ValidationResult
  } from '../FieldsConfig';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import FieldHint from '../FieldHint.svelte';

  type InputProps = {
    maxlength?: number;
    value?: string;
    class?: string;
    label?: string;
    fieldConfig?: FieldConfig<string> | DynamicFieldConfig;
    onfocus?: (evt: FocusEvent) => void;
    onblur?: (evt: FocusEvent) => void;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    maxlength,
    label,
    fieldConfig,
    value = $bindable(''),
    class: wrapperClass,
    validationResult,
    onblur,
    onfocus,
    ...restProps
  }: InputProps = $props();

  let showHint = $state(false);
</script>

<fieldset class={['text-input', wrapperClass]}>
  <legend>{label}</legend>
  <input
    type="text"
    autocomplete="off"
    onfocus={(evt) => {
      showHint = true;
      onfocus?.(evt);
    }}
    onblur={(evt) => {
      showHint = false;
      onblur?.(evt);
    }}
    bind:value
    {maxlength}
    placeholder={fieldConfig?.placeholder}
    {...restProps}
  />
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {showHint} />
    {#if maxlength}
      <div class="character-counter">
        {value.length} / {maxlength}
      </div>
    {/if}
  </div>
</fieldset>

<style lang="scss">
  .text-input {
    padding-top: 1.2em;
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

      .character-counter {
        color: var(--mdc-theme-text-primary-on-background);
        opacity: 0.75;
        font-size: 0.75em;
      }
    }
  }
</style>
