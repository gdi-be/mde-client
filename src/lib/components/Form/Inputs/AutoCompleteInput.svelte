<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";
  import type { AutocompleteInputConfig, Option } from "$lib/models/form";

  type InputProps = {
    config: AutocompleteInputConfig;
    value?: Option;
  }
  let {
    config,
    value = $bindable<Option>({
      key: "",
      label: ""
    })
  }: InputProps = $props();

  const { label, options } = config;

</script>

<Autocomplete
  {label}
  bind:value
  options={options}
  getOptionLabel={(option: Option) => option?.label as string || ''}
/>
