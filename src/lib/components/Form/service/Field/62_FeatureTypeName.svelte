<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { FeatureType } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import { getHighestRole } from '$lib/util';
  import type { Token } from '$lib/models/keycloak';

  export type ComponentProps = {
    value?: FeatureType['name'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig= getSubFieldConfig('isoMetadata.services', 'featuretypes', 'name');

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="featuretype-name-field">
    <TextInput
      label={fieldConfig?.label || 'Titel des Objekttyps'}
      {value}
      {fieldConfig}
      onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
    />
  </div>
{/if}

<style lang="scss">
  .featuretype-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
