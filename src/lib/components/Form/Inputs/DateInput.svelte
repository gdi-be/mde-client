<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import FieldHint from '../FieldHint.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';
  import { onMount } from 'svelte';

  type InputProps = {
    value?: string;
    key?: string;
    label?: string;
    explanation?: string;
    fieldConfig?: FullFieldConfig<string>;
    class?: string;
    validationResult?: ValidationResult;
  } & HTMLInputAttributes;

  let {
    key,
    label,
    value = $bindable(''),
    class: wrapperClass,
    explanation,
    fieldConfig,
    validationResult,
    onblur,
    ...restProps
  }: InputProps = $props();

  let inputElement: HTMLInputElement;
  let isActive = $state(false);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  // This special handling is needed as the input[type="date"] is not automatically
  // focused when the datepicker is opened.
  onMount(() => {
    const handleFocus = () => (isActive = true);
    const handleBlur = () => (isActive = false);

    inputElement.addEventListener('focus', handleFocus);
    inputElement.addEventListener('blur', handleBlur);

    return () => {
      inputElement.removeEventListener('focus', handleFocus);
      inputElement.removeEventListener('blur', handleBlur);
    };
  });

  let invalid = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    return isEditingRole && !validationResult?.valid;
  });
</script>

<fieldset class={['date-input', wrapperClass, invalid && 'invalid']}>
  <legend>{label}</legend>
  <input
    class={[isActive && 'active']}
    bind:this={inputElement}
    type="date"
    id={key}
    name={key}
    bind:value
    onblur={(evt) => {
      value = (evt.currentTarget as HTMLInputElement).value;
      onblur?.(evt);
    }}
    {...restProps}
  />
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {explanation} />
  </div>
</fieldset>

<style lang="scss">
  .date-input {
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
      font-family: 'Roboto';
      font-size: 1em;
      border-radius: 0.25em;
      border: 1px solid grey;
      padding: 0.25em;
      margin-top: 0.5em;
      outline-width: 0;
      align-self: flex-start;

      &.active,
      &:focus,
      &:focus-visible {
        border-color: var(--mdc-theme-primary);
        outline: 1px solid var(--mdc-theme-primary);
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
