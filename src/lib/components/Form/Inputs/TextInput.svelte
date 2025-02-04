<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import HelperText from "@smui/textfield/helper-text";
  import type { ComponentProps } from "svelte";

  type InputProps = {
    key?: string;
    label: string;
    maxlength?: number;
    value?: string;
    helpText?: string;
    wrapperClass?: string;
    isValid?: boolean;
  } & ComponentProps<typeof Textfield>;

  let {
    key,
    label,
    maxlength,
    value = $bindable(""),
    helpText,
    wrapperClass,
    isValid = true,
    ...restProps
  }: InputProps = $props();

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
