<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';

  export type ComponentProps = {
    value?: Layer['shortDescription'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();
</script>

<TextInput
  label="Kurzbeschreibung"
  {value}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
