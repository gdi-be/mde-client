<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';

  export type ComponentProps = {
    value?: Layer['legendImage'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getFieldConfig(53);
  const validationResult = $derived(fieldConfig?.validator(value));
</script>

<div class="layer-legend-image-field">
  <TextInput
    label={fieldConfig?.label || 'Legende'}
    {value}
    {fieldConfig}
    {validationResult}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
</div>

<style lang="scss">
  .layer-legend-image-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
