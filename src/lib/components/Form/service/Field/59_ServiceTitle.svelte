<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { MetadataCollection, Service } from '$lib/models/metadata';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getFieldConfig, getValue } from '$lib/context/FormContext.svelte';
  import AutoFillButton from '$lib/components/Form/AutoFillButton.svelte';
  import { getContext } from 'svelte';

  export type ServiceTypeProps = {
    value: Service['title'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ServiceTypeProps = $props();

  const HELP_KEY = 'isoMetadata.services.title';

  const METADATA_TITLE_KEY = 'isoMetadata.title';

  const metadata = getContext<MetadataCollection>('metadata');
  const metadataTitle = $derived(getValue<string>(METADATA_TITLE_KEY, metadata));

  const fieldConfig = getFieldConfig(59);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);

  const getAutoFillValues = async () => {
    if (!metadataTitle) return;
    const response = await onChange(metadataTitle);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="service-title-field">
  <TextInput
    label={fieldConfig?.label}
    {value}
    {fieldConfig}
    {validationResult}
    maxlength={250}
    onchange={async (e: Event) => {
      const response = await onChange((e.target as HTMLInputElement).value);
      if (response.ok) {
        showCheckmark = true;
      }
    }}
  />
  <FieldTools noCopyButton key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark}>
    {#if metadataTitle}
      <AutoFillButton title="Wert aus Vorlage übernehmen" onclick={getAutoFillValues} />
    {/if}
  </FieldTools>
</div>

<style lang="scss">
  .service-title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
