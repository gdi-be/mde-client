<script lang="ts">
  import FieldHint from '../FieldHint.svelte';
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { getHighestRole } from '$lib/util';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  type InputProps = {
    value?: number;
    key?: string;
    label?: string;
    class?: string;
    explanation?: string;
    fieldConfig?: FullFieldConfig<number>;
    onfocus?: (evt: FocusEvent) => void;
    onblur?: (evt: FocusEvent) => void;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    value = $bindable(),
    key,
    label,
    class: wrapperClass,
    explanation,
    validationResult,
    onblur,
    fieldConfig,
    onfocus,
    ...restProps
  }: InputProps = $props();

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  let fieldHasFocus = $state(false);

  let isInvalid = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    return isEditingRole && !validationResult?.valid;
  });
</script>

<fieldset class={['number-input', wrapperClass, isInvalid && 'invalid']}>
  <legend>{label}</legend>
  <input
    type="number"
    id={key}
    onfocus={(evt) => {
      fieldHasFocus = true;
      onfocus?.(evt);
    }}
    onblur={(evt) => {
      fieldHasFocus = false;
      onblur?.(evt);
    }}
    bind:value
    {...restProps}
  />
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {explanation} {fieldHasFocus} />
  </div>
</fieldset>

<style lang="scss">
  .number-input {
    padding-top: 1.2em;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.invalid {
      border: 2px solid var(--mdc-theme-error) !important;
    }

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
