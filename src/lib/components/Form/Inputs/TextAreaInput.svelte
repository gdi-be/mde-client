<script lang="ts">
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import FieldHint from '../FieldHint.svelte';
  import { getAccessToken } from '../../../context/TokenContext.svelte';
  import { getHighestRole } from '../../../util';

  type InputProps = {
    maxlength?: number;
    value?: string;
    class?: string;
    explanation?: string;
    label?: string;
    fieldConfig?: FullFieldConfig<string>;
    onfocus?: (evt: FocusEvent) => void;
    onblur?: (evt: FocusEvent) => void;
    validationResult?: ValidationResult;
  } & HTMLTextareaAttributes;

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  let {
    maxlength,
    fieldConfig,
    label,
    value = $bindable(),
    class: wrapperClass,
    explanation,
    validationResult,
    onblur,
    onfocus,
    ...restProps
  }: InputProps = $props();

  let fieldHasFocus = $state(false);

  let requiredButInvalid = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles, required } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    return isEditingRole && required && !validationResult?.valid;
  });
</script>

<fieldset class={['text-area-input', wrapperClass, requiredButInvalid ? 'invalid' : '']}>
  <legend>{label}</legend>
  <textarea
    {maxlength}
    bind:value
    onfocus={(evt) => {
      fieldHasFocus = true;
      onfocus?.(evt);
    }}
    onblur={(evt) => {
      fieldHasFocus = false;
      onblur?.(evt);
    }}
    {...restProps}
  ></textarea>
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {fieldHasFocus} {explanation} />
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

    &.invalid {
      border: 2px solid var(--mdc-theme-error) !important;
    }

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
