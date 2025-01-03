<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";
  import type { Option } from "$lib/models/form";
  import type { ComponentProps } from "svelte";

  type InputProps = {
    key: string;
    label: string;
    search?: (input: string) => Promise<Option[] | false>;
    options?: Option[] | (() => Promise<Option[]>);
  } & ComponentProps<typeof Autocomplete>;

  let {
    value = $bindable<Option>({
      key: "",
      label: ""
    }),
    ...restProps
  }: InputProps = $props();

</script>

<Autocomplete
  bind:value
  getOptionLabel={(option: Option) => option?.label as string || ''}
  {...restProps}
/>
