<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Service } from '$lib/models/metadata';
  import { getContext } from 'svelte';
  import { getHighestRole } from '$lib/util';
  import type { Token } from '$lib/models/keycloak';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';

  export type ComponentProps = {
    value?: Service['workspace'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.workspace';
  const fieldConfig = getFieldConfig(45);
  const validationResult = $derived(fieldConfig?.validator(value));

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
      {validationResult}
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
