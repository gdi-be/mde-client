<script lang="ts">
  import FieldHint from '../FieldHint.svelte';
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type InputProps = {
    value?: number;
    key?: string;
    label?: string;
    class?: string;
    fieldConfig?: FullFieldConfig<number>;
    onfocus?: (evt: FocusEvent) => void;
    onblur?: (evt: FocusEvent) => void;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    value = $bindable(0),
    key,
    label,
    class: wrapperClass,
    validationResult,
    onblur,
    fieldConfig,
    onfocus,
    ...restProps
  }: InputProps = $props();

  let showHint = $state(false);
</script>

<fieldset class={['number-input', wrapperClass]}>
  <legend>{label}</legend>
  <input
    type="number"
    id={key}
    onfocus={(evt) => {
      showHint = true;
      onfocus?.(evt);
    }}
    onblur={(evt) => {
      showHint = false;
      onblur?.(evt);
    }}
    bind:value
    {...restProps}
  />
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {showHint} />
  </div>
</fieldset>

<style lang="scss">
  .number-input {
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
    }
  }
</style>
