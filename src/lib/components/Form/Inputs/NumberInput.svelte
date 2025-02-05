<script lang="ts">
  import Textfield from "@smui/textfield";
  import type { ComponentProps } from "svelte";
  import type { ValidationResult } from "../FieldsConfig";
  import HelperText from "@smui/textfield/helper-text";

  type InputProps = {
    value?: number;
    key?: string;
    label?: string;
    type?: 'float' | 'integer';
    validationResult?: ValidationResult;
  } & ComponentProps<typeof Textfield>;

  let {
    value = $bindable(0),
    key,
    label,
    type = 'integer',
    validationResult,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let helpText = $derived(validationResult?.helpText);
</script>

<div class="number-input">
  <Textfield
    input$step={type === 'float' ? '0.1' : undefined}
    input$name={key}
    {...restProps}
    type="number"
    {label}
    bind:value
  >
    {#snippet helper()}
      <HelperText
        persistent={!isValid}
        class={isValid ? 'valid' : 'invalid'}
      >
        {helpText}
      </HelperText>
    {/snippet}
  </Textfield>
</div>

<style lang="scss">
  .number-input {
    :global(.mdc-text-field-helper-text.valid) {
      color: var(--mdc-theme-text-primary-on-background);
    }
    :global(.mdc-text-field-helper-text.invalid) {
      color: var(--mdc-theme-error);
    }
  }
</style>
