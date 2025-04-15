<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type {
    DynamicFieldConfig,
    FieldConfig,
    ValidationResult
  } from '$lib/components/Form/FieldsConfig';
  import FieldHint from '../FieldHint.svelte';

  type InputProps = {
    value?: string;
    key?: string;
    label?: string;
    fieldConfig?: FieldConfig<string> | DynamicFieldConfig;
    class?: string;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    key,
    label,
    value = $bindable(''),
    class: wrapperClass,
    fieldConfig,
    validationResult,
    ...restProps
  }: InputProps = $props();
</script>

<fieldset class={['date-input', wrapperClass]}>
  <legend>{label}</legend>
  <input type="date" id={key} name={key} bind:value {...restProps} />
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} />
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
      margin-top: 0.2em;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
</style>
