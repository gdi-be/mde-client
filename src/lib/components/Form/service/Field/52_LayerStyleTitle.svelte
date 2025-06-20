<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer, MetadataProfile } from '$lib/models/metadata';
  import { getContext } from 'svelte';
  import { getFieldConfig, getValue } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import type { Token } from '$lib/models/keycloak';

  export type ComponentProps = {
    value?: Layer['styleTitle'];
    onChange: (newValue: string) => void;
  };

  const PROFILE_KEY = 'isoMetadata.metadataProfile';

  let { value, onChange }: ComponentProps = $props();

  let metadataProfile = $derived(getValue<MetadataProfile>(PROFILE_KEY));
  const fieldConfig = getFieldConfig(52);
  const validationResult = $derived(fieldConfig?.validator(value));

  const token = getContext<Token>('user_token');
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
      onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
    />
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
