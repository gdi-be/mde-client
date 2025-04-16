<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { DownloadInfo } from '$lib/models/metadata';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import { getHighestRole } from '$lib/util';
  import type { Token } from '$lib/models/keycloak';

  export type ComponentProps = {
    value?: DownloadInfo['href'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig= getSubFieldConfig('isoMetadata.services', 'downloads', 'href');

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if !fieldVisible}
  <div class="download-href-field">
    <TextInput
      label={fieldConfig?.label || 'Download-Titel'}
      {value}
      {fieldConfig}
      onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
    />
  </div>
{/if}

<style lang="scss">
  .download-href-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
