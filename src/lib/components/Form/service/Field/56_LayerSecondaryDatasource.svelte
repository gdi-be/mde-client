<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import type { Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';

  export type ComponentProps = {
    value?: Layer['secondaryDatasource'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getFieldConfig(56);
  const validationResult = $derived(fieldConfig?.validator(value));

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="layer-short-description-field">
    <TextInput
      label={fieldConfig?.label || 'sekundäre Datenhaltung'}
      {value}
      {fieldConfig}
      {validationResult}
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
