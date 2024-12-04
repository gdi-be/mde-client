<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";
  import type { FormItemConfig, Option } from "$lib/models/form";

  type InputProps = {
    config: FormItemConfig;
  }
  let {
    config
  }: InputProps = $props();

  const { key, label } = config;

  let value: Option | null = $state({ value: 'apple', label: 'Apple' });
</script>

<Autocomplete
  {label}
  bind:value
  options={config.options}
  getOptionLabel={(option: Option) => option?.label}
/>
