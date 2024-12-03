<script lang="ts">
  import Select, { Option } from "@smui/select";
  import type { FormItemConfig } from "../../../lib/models/form";

  type InputProps = {
    config: FormItemConfig;
  }
  let {
    config
  }: InputProps = $props();

  const { key, label, options = [] } = config;

</script>

<Select {label} input$id={key} >
  {#each options as option}
    <Option
      value={option.value}
    >
      {option.label}
    </Option>
  {/each}
</Select>
