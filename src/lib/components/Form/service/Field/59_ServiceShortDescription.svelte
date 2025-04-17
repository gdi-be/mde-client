<script lang="ts">
  import type { MetadataCollection, Service } from '$lib/models/metadata';
  import TextAreaInput from '$lib/components/Form/Inputs/TextAreaInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getSubFieldConfig, getValue } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import AutoFillButton from '$lib/components/Form/AutoFillButton.svelte';

  export type ServiceTypeProps = {
    value: Service['shortDescription'];
    onChange: (newValue: string) => void;
  };

  let { value = $bindable(), onChange }: ServiceTypeProps = $props();

  const fieldConfig = getSubFieldConfig('isoMetadata.services', 'shortDescription');

  const HELP_KEY = 'isoMetadata.services.shortDescription';

  const METADATA_DESCRIPTION_KEY = 'isoMetadata.description';
  const metadata = getContext<MetadataCollection>('metadata');
  const metadataDescription = $derived(getValue<string>(METADATA_DESCRIPTION_KEY, metadata));

  const getAutoFillValues = async () => {
    if (!metadataDescription) return;
    onChange(metadataDescription);
  };
</script>

<div class="service-description-field">
  <TextAreaInput
    bind:value
    label={fieldConfig?.label}
    maxlength={500}
    {fieldConfig}
    rows={5}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
  <FieldTools key={HELP_KEY} noCheckmark>
    {#if metadataDescription}
      <AutoFillButton
        title="Beschreibung des Metadatensatzes übernehmen"
        onclick={getAutoFillValues}
      />
    {/if}
  </FieldTools>
</div>

<style lang="scss">
  .service-description-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-area-input) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
