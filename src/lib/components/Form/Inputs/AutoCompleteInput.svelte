<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";
  import type { AutocompleteInputConfig, Option } from "$lib/models/form";

  type InputProps = {
    config: AutocompleteInputConfig;
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
