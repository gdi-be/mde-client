<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Icon from "@smui/textfield/icon";
  import type { ComponentProps } from "svelte";
  import type { ValidationResult } from "../FieldsConfig";

  type InputProps = {
    value?: string;
    key?: string;
    label?: string;
    validationResult?: ValidationResult;
  } & ComponentProps<typeof Textfield>;

  let {
    key,
    label,
    value = $bindable(''),
    validationResult,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let helpText = $derived(validationResult?.helpText);
</script>

<div class="date-input">
  <Textfield
    type="date"
    {label}
    id={key}
    input$name={key}
    bind:value
    {...restProps}
  >
    {#snippet leadingIcon()}
      <Icon class="material-icons">
        calendar_month
      </Icon>
    {/snippet}
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
  .date-input {
    :global(.mdc-text-field-helper-text.valid) {
      color: var(--mdc-theme-text-primary-on-background);
    }
    :global(.mdc-text-field-helper-text.invalid) {
      color: var(--mdc-theme-error);
    }
  }
</style>
