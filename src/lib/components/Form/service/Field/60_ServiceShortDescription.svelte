<script lang="ts">
  import type { MetadataCollection, Service } from '$lib/models/metadata';
  import TextAreaInput from '$lib/components/Form/Inputs/TextAreaInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getFieldConfig, getValue } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import AutoFillButton from '$lib/components/Form/AutoFillButton.svelte';

  export type ServiceTypeProps = {
    value: Service['shortDescription'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value = $bindable(), onChange }: ServiceTypeProps = $props();

  const fieldConfig = getFieldConfig(60);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);

  const HELP_KEY = 'isoMetadata.services.shortDescription';

  const METADATA_DESCRIPTION_KEY = 'isoMetadata.description';
  const metadata = getContext<MetadataCollection>('metadata');
  const metadataDescription = $derived(getValue<string>(METADATA_DESCRIPTION_KEY, metadata));

  const getAutoFillValues = async () => {
    if (!metadataDescription) return;
    const response = await onChange(metadataDescription);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="service-description-field">
  <TextAreaInput
    bind:value
    label={fieldConfig?.label}
    maxlength={500}
    {fieldConfig}
    {validationResult}
    rows={5}
    onchange={async (e: Event) => {
      const response = await onChange((e.target as HTMLInputElement).value);
      if (response.ok) {
        showCheckmark = true;
      }
    }}
  />
  <FieldTools key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark}>
    {#if metadataDescription}
      <AutoFillButton title="Wert aus Vorlage übernehmen" onclick={getAutoFillValues} />
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
