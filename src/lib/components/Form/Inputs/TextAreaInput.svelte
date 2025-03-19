<script lang="ts">
  import Textfield from '@smui/textfield';
  import type { ComponentProps } from 'svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import HelperText from '@smui/textfield/helper-text';

  type InputProps = {
    key: string;
    label?: string;
    maxlength?: number;
    value?: string;
    validationResult?: ValidationResult;
  } & ComponentProps<typeof Textfield>;

  let {
    key,
    label,
    maxlength,
    value = $bindable(''),
    validationResult,
    ...restProps
  }: InputProps = $props();

  let isValid = $derived(validationResult?.valid !== false);
  let helpText = $derived(validationResult?.helpText);
</script>

<div class="text-area-input">
  <Textfield
    textarea
    {label}
    input$name={key}
    input$maxlength={maxlength}
    bind:value
    {...restProps}
  >
    {#snippet helper()}
      <HelperText persistent={!isValid} class={isValid ? 'valid' : 'invalid'}>
        {helpText}
      </HelperText>
      {#if maxlength}
        <div class="mdc-text-field-character-counter">
          {value.length} / {maxlength}
        </div>
      {/if}
    {/snippet}
  </Textfield>
</div>

<style lang="scss">
  .text-area-input {
    :global(.mdc-floating-label) {
      background-color: white;
      color: var(--title-color);
    }

    :global(.mdc-text-field-helper-text.valid) {
      color: var(--mdc-theme-text-primary-on-background);
    }
    :global(.mdc-text-field-helper-text.invalid) {
      color: var(--mdc-theme-error);
    }
  }
</style>
