<script lang="ts">
  import FormField from "@smui/form-field";
  import Switch from "@smui/switch";
  import type { BooleanInputConfig } from "$lib/models/form";

  type InputProps = {
    config: BooleanInputConfig;
    value?: boolean;
  }
  let {
    config,
    value = false
  }: InputProps = $props();

  const {
    key,
    label: inputLabel
  } = config;
</script>

<FormField
  input$name={key}
  bind:value
>
  <Switch/>
  {#snippet label()}
    {inputLabel}
  {/snippet}
</FormField>
