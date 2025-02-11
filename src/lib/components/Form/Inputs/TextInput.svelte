<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import HelperText from "@smui/textfield/helper-text";
  import type { ComponentProps } from "svelte";
  import type { ValidationResult } from "../FieldsConfig";

  type InputProps = {
    key?: string;
    label?: string;
    maxlength?: number;
    value?: string;
    wrapperClass?: string;
    validationResult?: ValidationResult;
  } & ComponentProps<typeof Textfield>;

  let {
    key,
    label,
    maxlength,
    value = $bindable(""),
    wrapperClass,
    validationResult,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let helpText = $derived(validationResult?.helpText);
</script>

<div class={['text-input', wrapperClass]} >
  <Textfield
    {label}
    input$name={key}
    input$maxlength={maxlength}
    bind:value
    {...restProps}
  >
    {#snippet helper()}
      <HelperText
        persistent={!isValid}
        class={isValid ? 'valid' : 'invalid'}
      >
        {helpText}
      </HelperText>
      {#if maxlength}
        <CharacterCounter />
      {/if}
    {/snippet}
  </Textfield>
</div>

<style lang="scss">
  .text-input {
    :global(.mdc-text-field-helper-text.valid) {
      color: var(--mdc-theme-text-primary-on-background);
    }
    :global(.mdc-text-field-helper-text.invalid) {
      color: var(--mdc-theme-error);
    }
  }
</style>
