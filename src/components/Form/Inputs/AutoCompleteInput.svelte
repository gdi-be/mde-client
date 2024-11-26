<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";

  type InputProps = {
    key: string,
    label: string
  }

  let {
    key,
    label
  }: InputProps = $props();

  type Option = Record<string, string | number>;
  type InputConfig = {
    options: Option[]
  }
  const config: InputConfig = {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' }
    ]
  }

  let value: Option | null = $state({ value: 'apple', label: 'Apple' });
</script>

<Autocomplete
  {label}
  bind:value
  options={config.options}
  getOptionLabel={(option: Option) => option?.label}
/>
