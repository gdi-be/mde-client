<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { ColumnInfo } from '$lib/models/metadata';

  export type ServiceTypeProps = {
    value?: ColumnInfo['name'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();
</script>

<TextInput
  label="Attribut-Name"
  {value}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
