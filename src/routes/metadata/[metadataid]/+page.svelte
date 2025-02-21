<script lang="ts">
  import { page } from '$app/state';
  import Form from '$lib/components/Form/Form.svelte';
  import { setFormData } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import { getHighestRole } from '$lib/util.js';
  import type { Token } from '$lib/models/keycloak.js';
  import MetadataDisplay from '$lib/components/ReadOnly/MetadataDisplay.svelte';

  const activeSection = page.url.hash.slice(1) || 'basedata';
  const readOnlyParam = page.url.searchParams.get('readOnly') === 'true';

  let { data } = $props();
  const metadata = $derived(data.metadata);

  $effect(() => {
    setFormData(metadata);
  });

  const token = getContext<Token>('user_token');

  const readOnly = $derived(getHighestRole(token) === 'QualityAssurance' || readOnlyParam);
</script>

<div class="metadata">
  <h1>{metadata.isoMetadata.title}</h1>
  {#if readOnly}
    <MetadataDisplay {metadata} />
  {:else}
    <Form {metadata} {activeSection} />
  {/if}
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
