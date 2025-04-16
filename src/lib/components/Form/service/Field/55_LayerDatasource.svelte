<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';

  export type ComponentProps = {
    value?: Layer['datasource'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig= getSubFieldConfig('isoMetadata.services', 'layers', 'datasource');
</script>

<div class="layer-short-description-field">
  <TextInput
    label={fieldConfig?.label || 'Ablageort der Daten'}
    {value}
    {fieldConfig}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
</div>

<style lang="scss">
  .layer-short-description-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
