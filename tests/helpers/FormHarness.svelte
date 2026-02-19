<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import Form from '../../src/lib/components/Form/Form.svelte';
  import Popconfirm from '../../src/lib/components/Popconfirm.svelte';
  import {
    FORMSTATE_CONTEXT,
    initializeFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { initializePopconfirmContext } from '$lib/context/PopConfirmContext.svelte';
  import { initializeStatusesContext } from '$lib/context/StatusesContext.svelte';

  const { metadata, fieldConfigs } = $props<{
    metadata: any;
  }>();

  initializePopconfirmContext();
  initializeStatusesContext();
  initializeFormContext(metadata);

  const formState: FormState = $state({
    // svelte-ignore state_referenced_locally
    metadata: metadata,
    activeHelpKey: undefined
  });

  $effect(() => {
    formState.metadata = metadata;
  });

  setContext(FORMSTATE_CONTEXT, formState);

  onMount(() => {
    const originalFetch = window.fetch;

    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      const isPatch = init?.method === 'PATCH';

      const response = await (init !== undefined
        ? originalFetch(input, init)
        : originalFetch(input));

      if (isPatch && response.ok) {
        const clonedResponse = response.clone ? response.clone() : response;

        if (typeof clonedResponse.json === 'function') {
          clonedResponse
            .json()
            .then((updatedMetadata: any) => {
              formState.metadata = updatedMetadata;
            })
            .catch(() => {
              // Ignore errors
            });
        }
      }

      return response;
    } as typeof fetch;

    return () => {
      window.fetch = originalFetch;
    };
  });
</script>

<Form />
<Popconfirm />
