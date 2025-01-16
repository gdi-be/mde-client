<script lang="ts">
  import Select, { Option as SelectOption } from "@smui/select";
  import type { Option } from "$lib/models/form";

  let element = $state();

  type InputProps = {
    onChange?: (value: string) => void;
    value?: string;
    key: string;
    label: string;
    options: Option[];
  }

  let {
    onChange,
    value = $bindable<string | undefined>(undefined),
    key,
    label,
    options
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
      onSMUIAction={() => onSelect(option.key)}
      value={option.key}
    >
      {option.label}
    </SelectOption>
  {/each}
</Select>

<style lang="scss">
  :global(.select-input .mdc-menu) {
    top: 56px !important;
    // calc(items * item height + top margin)
    max-height: calc(5 * 48px + 8px);
  }
</style>
