<script lang="ts">
  import { getContext } from 'svelte';
  import type { DynamicFieldConfig, FieldConfig, ValidationResult } from './FieldsConfig.js';
  import type { Token } from '$lib/models/keycloak.js';
  import { getHighestRole } from '$lib/util.js';

  type FieldBottomTextProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldConfig?: FieldConfig<any> | DynamicFieldConfig;
    validationResult?: ValidationResult;
    showHint?: boolean;
  };

  const {
    validationResult,
    fieldConfig,
    showHint = false,
  }: FieldBottomTextProps = $props();

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const isValid = $derived(validationResult?.valid !== false);


  let text = $derived.by(() => {
    if (highestRole === 'MdeDataOwner') {
      if (showHint) {
        return fieldConfig?.hint || fieldConfig?.explanation;
      } else {
        return fieldConfig?.explanation;
      }
    }
    if (!isValid) {
      return validationResult?.helpText;
    }
  });
</script>

<span
  class={[
    "field-hint",
    highestRole.toLowerCase(),
    isValid ? "valid" : "invalid",
  ]}
>
  {text}
</span>

<style lang="scss">
  .field-hint {
    font-size: var(--mdc-typography-caption-font-size, 0.75rem);

    &.invalid:not(.mdedataowner) {
      color: var(--mdc-theme-error);
    }
  }
</style>
