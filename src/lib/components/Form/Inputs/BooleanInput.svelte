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
    label: inputLabel
  } = config;
</script>

<FormField>
  <Switch
    bind:checked={value}
  />
  {#snippet label()}
    {inputLabel}
  {/snippet}
</FormField>
