<script lang="ts">
  import FormField from "@smui/form-field";
  import Switch from "@smui/switch";
  import type { BooleanInputConfig } from "$lib/models/form";

  type InputProps = {
    config: BooleanInputConfig;
  }
  let {
    config
  }: InputProps = $props();

  const {
    // key,
    label: inputLabel
  } = config;
</script>

<FormField>
  <Switch/>
  {#snippet label()}
    {inputLabel}
  {/snippet}
</FormField>
