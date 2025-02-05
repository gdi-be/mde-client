<script lang="ts">
  import Select, { Option as SelectOption } from "@smui/select";
  import type { Option } from "$lib/models/form";
  import ValidationFeedbackText from "../ValidationFeedbackText.svelte";
  import type { ValidationResult } from "../FieldsConfig.ts";

  let element = $state();

  type InputProps = {
    onChange?: (value: string) => void;
    value?: string;
    key: string;
    label: string;
    options: Option[];
    validationResult?: ValidationResult;
  }

  let {
    onChange,
    value = $bindable<string | undefined>(undefined),
    key,
    label,
    options,
    validationResult
  }: InputProps = $props();

  // Remove duplicates
  options = Array.from(new Map(options.map(item => [item.key, item])).values());

  const onSelect = (newValue: string) => {
    onChange?.(newValue);
  };

</script>

<Select
  bind:this={element}
  class="select-input"
  {label}
  hiddenInput
  input$name={key}
  menu$anchorElement={document.body}
  bind:value
>
  {#each options as option}
    <SelectOption
      onSMUIAction={() => {
        if (option.disabled) return;
        onSelect(option.key);
      }}
      value={option.key}
      disabled={option.disabled}
    >
      {option.label}
    </SelectOption>
  {/each}
</Select>
<ValidationFeedbackText {validationResult} />

<style lang="scss">
  :global(.select-input .mdc-menu) {
    top: 56px !important;
    // calc(items * item height + top margin)
    max-height: calc(5 * 48px + 8px);

    :global([aria-disabled="true"]) {
      opacity: 0.5;
      pointer-events: none;
    }
  }
</style>
