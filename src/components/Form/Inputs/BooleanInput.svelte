<script lang="ts">
  import FormField from "@smui/form-field";
  import Switch from "@smui/switch";

  type InputProps = {
    key: string,
    label: string
  }
  let {
    label: inputLabel,
    // key
  }: InputProps = $props();

  // type InputConfig = {}
  // const config: InputConfig = {}
</script>

<FormField>
  <Switch />
  {#snippet label()}
    {inputLabel}
  {/snippet}
</FormField>
