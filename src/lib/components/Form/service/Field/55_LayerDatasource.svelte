<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import type { Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';

  export type ComponentProps = {
    value?: Layer['datasource'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getSubFieldConfig('isoMetadata.services', 'layers', 'datasource');

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeDataOwner', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="layer-short-description-field">
    <TextInput
      label={fieldConfig?.label || 'Ablageort der Daten'}
      {value}
      {fieldConfig}
      onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
    />
  </div>
{/if}

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
