<script lang="ts">
  import Form from '$lib/components/Form/Form.svelte';
  import {
    type FormState,
    FORMSTATE_CONTEXT,
    initializeFormContext
  } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import { setRefreshToken } from '$lib/context/TokenContext.svelte.js';

  let { data } = $props();

  initializeFormContext(data.metadata, data.fieldLabels);

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
  <h1>{metadata.isoMetadata.title}</h1>
  <Form />
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
