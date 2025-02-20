<script lang="ts">
  import type { Option } from '$lib/models/form';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';
  import ValidationFeedbackText from '../ValidationFeedbackText.svelte';
  import type { ValidationResult } from '../FieldsConfig';

  type InputProps = {
    onChange?: (value: string) => void;
    key: string;
    label?: string;
    value?: string;
    options: Option[];
    validationResult?: ValidationResult;
  };

  let {
    onChange,
    value = $bindable<string>(),
    key,
    label,
    options,
    validationResult
  }: InputProps = $props();

  const onSelect = () => {
    onChange?.(value);
  };
</script>

<div class="radio-input">
  <label class="radio-group-label" for={`${key}-radio-group`}>
    {label}
  </label>
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
  <ValidationFeedbackText {validationResult} />
</div>

<style lang="scss">
  .radio-input {
    display: flex;
    flex-direction: column;
    gap: 0.5em;

    .radio-group-label {
      color: rgba(0, 0, 0, 0.6);
      font-family: 'Roboto', sans-serif;
      font-size: 0.75em;
    }

    .radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
    }
  }
</style>
