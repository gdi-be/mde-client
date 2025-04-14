<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';

  export type ComponentProps = {
    value?: Layer['title'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();
</script>

<TextInput
  label="Titel der Kartenebene"
  {value}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
