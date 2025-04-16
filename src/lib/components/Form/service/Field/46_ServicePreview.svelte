<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';

  export type ComponentProps = {
    value?: Layer['title'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

const fieldConfig= getSubFieldConfig('isoMetadata.services', 'preview');
const HELP_KEY = 'isoMetadata.services.preview';
</script>

<div class="service-preview-field">
  <TextInput
    label={fieldConfig?.label || 'Vorschau des Kartendienstes'}
    {value}
    {fieldConfig}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
  <FieldTools key={HELP_KEY} noCheckmark />
</div>

<style lang="scss">
  .service-preview-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
