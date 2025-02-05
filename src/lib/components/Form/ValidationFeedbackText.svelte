<script lang="ts">
  import type { ValidationResult } from "./FieldsConfig.ts";

  type ValidtionFeedbackTextProps = {
    validationResult?: ValidationResult;
  }

  const {
    validationResult
  }: ValidtionFeedbackTextProps = $props();

</script>

{#if validationResult?.valid === false}
  <span class="validation-feedback-text">
    {validationResult?.helpText}
  </span>
{/if}

<style lang="scss">
  .validation-feedback-text {
    color: var(--mdc-theme-error);
    font-size: var(--mdc-typography-caption-font-size, 0.75rem);
  }
</style>
