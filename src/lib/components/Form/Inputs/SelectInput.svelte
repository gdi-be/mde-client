<script lang="ts">
  import Select, { Option as SelectOption } from "@smui/select";
  import type { Option } from "$lib/models/form";

  type InputProps = {
    onChange?: (value: string | undefined) => void;
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

  const onSelect = () => {
    onChange?.(value);
  };
</script>

<Select
  {label}
  hiddenInput
  input$name={key}
  bind:value
>
  {#each options as option}
    <SelectOption
      onSMUIAction={onSelect}
      value={option.key}
    >
      {option.label}
    </SelectOption>
  {/each}
</Select>
