<script lang="ts">
  import Select, { Option } from "@smui/select";
  import type { SelectInputConfig } from "$lib/models/form";

  type InputProps = {
    onChange?: (value: string | undefined) => void;
    value?: string;
    config: SelectInputConfig;
  }

  let {
    config,
    onChange,
    value = $bindable<string | undefined>(undefined),
  }: InputProps = $props();

  const { key, label, options = [] } = config;

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
    <Option
      onSMUIAction={onSelect}
      value={option.value}
    >
      {option.label}
    </Option>
  {/each}
</Select>
