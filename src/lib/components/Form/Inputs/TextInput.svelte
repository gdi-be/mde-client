<script lang="ts">
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import FieldHint from '../FieldHint.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';

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
  } & HTMLInputAttributes;

  let {
    maxlength,
    label,
    fieldConfig,
    value = $bindable(),
    class: wrapperClass,
    validationResult,
    onblur,
    onfocus,
    explanation,
    // eslint-disable-next-line
    ...restProps
  }: InputProps = $props();

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  let fieldHasFocus = $state(false);
  if (value === undefined) {
    value = '';
  }

  let isInvalid = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    return isEditingRole && !validationResult?.valid;
  });
</script>

<fieldset class={['text-input', wrapperClass, isInvalid && 'invalid']}>
  <legend>{label}</legend>
  <input
    type="text"
    autocomplete="off"
    onfocus={(evt) => {
      fieldHasFocus = true;
      onfocus?.(evt);
    }}
    onblur={(evt) => {
      fieldHasFocus = false;
      onblur?.(evt);
    }}
    bind:value
    {maxlength}
    {...restProps}
  />
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {fieldHasFocus} {explanation} />
    {#if maxlength}
      <div class="character-counter">
        {value?.length ?? 0} / {maxlength}
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

      .character-counter {
        color: var(--mdc-theme-text-primary-on-background);
        opacity: 0.75;
        font-size: 0.75em;
      }
    }
  }
</style>
