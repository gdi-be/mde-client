<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { ColumnInfo } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';

  export type ComponentProps = {
    value?: ColumnInfo['name'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getSubFieldConfig(
    'isoMetadata.services',
    'featuretypes',
    'attributes',
    'name'
  );
</script>

<div class="attribute-name-field">
  <TextInput
    label={fieldConfig?.label || 'Attribut-Name'}
    {value}
    {fieldConfig}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
</div>

<style lang="scss">
  .attribute-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
