<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import { getHighestRole } from '$lib/util';
  import type { Token } from '$lib/models/keycloak';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';

  export type ComponentProps = {
    value?: Layer['title'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.workspace';
  const fieldConfig = getSubFieldConfig('isoMetadata.services', 'workspace');

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="service-id-field">
    <TextInput
      label={fieldConfig?.label || 'Identifikator des Kartendienstes'}
      {value}
      {fieldConfig}
      onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
    />
    <FieldTools key={HELP_KEY} />
  </div>
{/if}

<style lang="scss">
  .service-id-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
