<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { MetadataCollection, Service } from '$lib/models/metadata';
  import { getFieldConfig, getValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import AutoFillButton from '$lib/components/Form/AutoFillButton.svelte';
  import { getContext } from 'svelte';

  export type ComponentProps = {
    value?: Service['preview'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getFieldConfig(46);
  const validationResult = $derived(fieldConfig?.validator(value));

  const METADATA_PREVIEW_KEY = 'isoMetadata.preview';

  const metadata = getContext<MetadataCollection>('metadata');
  const metadataPreview = $derived(getValue<string>(METADATA_PREVIEW_KEY, metadata));

  let showCheckmark = $state(false);
  const HELP_KEY = 'isoMetadata.services.preview';

  const getAutoFillValues = async () => {
    if (!metadataPreview) return;
    const response = await onChange(metadataPreview);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="service-preview-field">
  <TextInput
    label={fieldConfig?.label || 'Vorschau des Kartendienstes'}
    {value}
    {fieldConfig}
    {validationResult}
    onchange={async (e: Event) => {
      const response = await onChange((e.target as HTMLInputElement).value);
      if (response.ok) {
        showCheckmark = true;
      }
    }}
  />
  <FieldTools key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark}>
    {#if metadataPreview}
      <AutoFillButton
        title="Vorschaubild des Metadatensatzes übernehmen"
        onclick={getAutoFillValues}
      />
    {/if}
  </FieldTools>
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
