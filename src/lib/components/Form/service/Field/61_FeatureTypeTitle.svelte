<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { FeatureType } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';

  export type ComponentProps = {
    value?: FeatureType['title'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig= getSubFieldConfig('isoMetadata.services', 'featuretypes', 'title');

</script>

<div class="featuretype-title-field">
  <TextInput
    label={fieldConfig?.label || 'Titel des Objekttyps'}
    {value}
    {fieldConfig}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
</div>

<style lang="scss">
  .featuretype-title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
