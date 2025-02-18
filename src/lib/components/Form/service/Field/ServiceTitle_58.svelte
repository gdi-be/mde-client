<script lang="ts">
  import Paper from "@smui/paper";
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import type { Service } from "$lib/models/metadata";

  export type ServiceTypeProps = {
    value: Service["title"]
    onChange: (newValue: string) => void
  };

  let {
    value,
    onChange
  }: ServiceTypeProps = $props();
</script>

<Paper>
  <TextInput
    label="Titel"
    key="title"
    {value}
    maxlength={100}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
</Paper>
