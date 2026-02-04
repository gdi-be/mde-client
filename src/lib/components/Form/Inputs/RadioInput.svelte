<script lang="ts">
  import type { Option } from '$lib/models/form';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';
  import { type FullFieldConfig, type ValidationResult } from '$lib/components/Form/FieldsConfig';
  import FieldHint from '../FieldHint.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';

  type InputProps = {
    onChange?: (value: string) => void;
    key: string;
    label?: string;
    explanation?: string;
    value?: string;
    fieldConfig?: FullFieldConfig<string>;
    options: Option[];
    validationResult?: ValidationResult;
  };

  let {
    onChange,
    value = $bindable<string>(),
    key,
    label,
    explanation,
    fieldConfig,
    options,
    validationResult
  }: InputProps = $props();

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const onSelect = () => {
    onChange?.(value);
  };

  let isInvalid = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    return isEditingRole && !validationResult?.valid;
  });
</script>

<fieldset class={['radio-input', isInvalid && 'invalid']}>
  <legend>{label}</legend>
  <div id={`${key}-radio-group`} class="radio-group">
    {#each options as option}
      <FormField>
        <Radio id={option.key} onchange={onSelect} bind:group={value} value={option.key} />
        {#snippet label()}
          <label for={option.key}>{option.label}</label>
        {/snippet}
      </FormField>
    {/each}
  </div>
  <div class="field-footer">
    <FieldHint {validationResult} {fieldConfig} {explanation} />
  </div>
</fieldset>

<style lang="scss">
  .radio-input {
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

    .field-footer {
      margin-top: 0.2em;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
    }
  }
</style>
