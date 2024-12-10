<script lang="ts">
  import Select, { Option } from "@smui/select";
  import type { SelectInputConfig } from "$lib/models/form";

  type InputProps = {
    onChange?: (key: string, value: string | undefined) => void;
    value?: string;
    config: SelectInputConfig;
  }

  let {
    config,
    onChange,
    value = $bindable<string | undefined>(undefined),
  }: InputProps = $props();

  const { key, label, options = [] } = config;

  $effect(() => {
    onChange?.(key, value);
  });
</script>

<Select
  {label}
  hiddenInput
  input$name={key}
  bind:value
>
  {#each options as option}
    <Option
      value={option.value}
    >
      {option.label}
    </Option>
  {/each}
</Select>
