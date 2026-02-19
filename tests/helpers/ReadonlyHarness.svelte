<script lang="ts">
  import { setContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import MetadataDisplay from '$lib/components/ReadOnly/MetadataDisplay.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';

  const { metadata, fieldConfigs } = $props<{
    metadata: MetadataCollection;
    fieldConfigs?: any;
  }>();

  // svelte-ignore state_referenced_locally
  const formState: FormState = $state({
    // svelte-ignore state_referenced_locally
    metadata: metadata,
    fieldConfigs: fieldConfigs,
    activeHelpKey: undefined
  });

  $effect(() => {
    formState.metadata = metadata;
  });

  setContext(FORMSTATE_CONTEXT, formState);
</script>

<MetadataDisplay />
