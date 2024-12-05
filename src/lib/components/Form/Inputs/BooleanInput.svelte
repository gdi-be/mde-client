<script lang="ts">
  import FormField from "@smui/form-field";
  import Switch from "@smui/switch";
  import type { FormItemConfig } from "$lib/models/form";

  type InputProps = {
    config: FormItemConfig;
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
