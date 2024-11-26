<script lang="ts">
  import Select, { Option } from "@smui/select";

  type InputProps = {
    key: string,
    label: string
  }
  let {
    label,
    // key
  }: InputProps = $props();

  type InputConfig = {
    options: Record<string, string | number>[]
  }
  const config: InputConfig = {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' }
    ]
  }

</script>

<Select {label}>
  {#each config.options as option}
    <Option value={option.value}>{option.label}</Option>
  {/each}
</Select>
