<script lang="ts">
  import Form from '$lib/components/Form/Form.svelte';
  import {
    type FormState,
    FORMSTATE_CONTEXT,
    initializeFormContext
  } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import { setRefreshToken } from '$lib/context/TokenContext.svelte.js';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  let { data } = $props();

  // svelte-ignore state_referenced_locally
  initializeFormContext(data.metadata);

  const metadata = $derived(data.metadata);

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  $effect(() => {
    formState.metadata = data.metadata;
  });

  const refreshToken = $derived(data.refreshToken);
  $effect(() => {
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
  });
</script>

<div class="metadata">
  {#if !metadata?.isoMetadata}
    <h1>{t('general.broken_metadata_title')}</h1>
    <p>{t('general.broken_metadata_message')}</p>
  {:else}
    <h1>{metadata.isoMetadata.title}</h1>
    <Form />
  {/if}
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      text-align: center;
    }
  }
</style>
