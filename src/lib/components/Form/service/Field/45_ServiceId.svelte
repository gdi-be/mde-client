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
  };

  let { value }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.serviceIdentification';
  const fieldConfig = getSubFieldConfig('isoMetadata.services', 'serviceIdentification');

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="service-id-field">
    <TextInput
      label={fieldConfig?.label || 'Identifikator des Kartendienstess'}
      {value}
      {fieldConfig}
      readonly
    />
    <FieldTools key={HELP_KEY} noCheckmark />
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
