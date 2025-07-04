<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer, MetadataProfile } from '$lib/models/metadata';
  import { getFieldConfig, getValue } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  export type ComponentProps = {
    value?: Layer['styleTitle'];
    onChange: (newValue: string) => Promise<Response>;
  };

  const PROFILE_KEY = 'isoMetadata.metadataProfile';
  const HELP_KEY = 'clientMetadata.layers.styleTitle';

  let { value, onChange }: ComponentProps = $props();
  let showCheckmark = $state(false);

  let metadataProfile = $derived(getValue<MetadataProfile>(PROFILE_KEY));
  const fieldConfig = getFieldConfig(52);
  const validationResult = $derived(fieldConfig?.validator(value));

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(
    highestRole === 'MdeAdministrator' ||
      (metadataProfile === 'INSPIRE_HARMONISED' && highestRole === 'MdeEditor')
  );
</script>

{#if fieldVisible}
  <div class="layer-style-title-field">
    <TextInput
      label={fieldConfig?.label || 'Titel des Styles'}
      {value}
      maxlength={250}
      {fieldConfig}
      {validationResult}
      onchange={async (e: Event) => {
        const response = await onChange((e.target as HTMLInputElement).value);
        if (response.ok) {
          showCheckmark = true;
        }
      }}
    />
    <FieldTools key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .layer-style-title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
