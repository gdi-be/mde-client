<script lang="ts">
  import { setContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import MetadataDisplay from '$lib/components/ReadOnly/MetadataDisplay.svelte';

  const { metadata, fieldConfigs } = $props<{
    metadata: any;
    fieldConfigs?: any;
  }>();

  const formState: FormState = $state({
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
