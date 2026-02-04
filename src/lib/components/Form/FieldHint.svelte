<script lang="ts">
  import type { FullFieldConfig, ValidationResult } from './FieldsConfig.js';
  import { getHighestRole } from '$lib/util.js';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  type FieldBottomTextProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldConfig?: FullFieldConfig<any>;
    validationResult?: ValidationResult;
    fieldHasFocus?: boolean;
    required?: boolean;
    explanation?: string;
  };

  const {
    validationResult,
    fieldConfig,
    required = false,
    explanation,
    fieldHasFocus = false
  }: FieldBottomTextProps = $props();
  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const isValid = $derived(validationResult?.valid !== false);

  let validationText = $derived.by(() => {
    if (!isValid && fieldHasFocus) {
      return validationResult?.helpText;
    }
    return null;
  });
  let explanationText = $derived.by(() => {
    if (highestRole === 'MdeDataOwner') {
      return explanation;
    }
    return null;
  });
</script>

<span
  class={[
    'field-hint',
    highestRole.toLowerCase(),
    required || fieldConfig?.required ? 'required' : ''
  ]}
>
  {#if explanationText}
    <div class="explanation-text">{explanationText}</div>
  {/if}
  {#if validationText}
    <div class="validation-help-text">{validationText}</div>
  {/if}
</span>

<style lang="scss">
  .field-hint {
    font-size: var(--mdc-typography-caption-font-size, 0.75rem);

    .validation-help-text {
      color: var(--mdc-theme-error);
    }
  }
</style>
