<script lang="ts">
  import type { FullFieldConfig, ValidationResult } from './FieldsConfig.js';
  import { getHighestRole } from '$lib/util.js';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  type FieldBottomTextProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldConfig?: FullFieldConfig<any>;
    validationResult?: ValidationResult;
    showHint?: boolean;
    required?: boolean;
  };

  const {
    validationResult,
    fieldConfig,
    showHint = false,
    required = false
  }: FieldBottomTextProps = $props();

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const isValid = $derived(validationResult?.valid !== false);

  let text = $derived.by(() => {
    if (!isValid) {
      return validationResult?.helpText;
    }
    if (highestRole === 'MdeDataOwner') {
      if (showHint) {
        return fieldConfig?.hint || fieldConfig?.explanation;
      } else {
        return fieldConfig?.explanation;
      }
    }
  });
</script>

<span
  class={[
    'field-hint',
    highestRole.toLowerCase(),
    isValid ? 'valid' : 'invalid',
    required || fieldConfig?.required ? 'required' : ''
  ]}
>
  {text}
</span>

<style lang="scss">
  .field-hint {
    font-size: var(--mdc-typography-caption-font-size, 0.75rem);

    &.invalid {
      color: var(--mdc-theme-secondary);

      &.required {
        color: var(--mdc-theme-error);
      }
    }
  }
</style>
