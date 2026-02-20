<script lang="ts">
  import { setContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';
  import type { FullFieldConfig } from '$lib/components/Form/FieldsConfig';
  import MetadataDisplay from '$lib/components/ReadOnly/MetadataDisplay.svelte';

  const { metadata, fieldConfigs } = $props<{
    metadata: MetadataCollection;
    fieldConfigs?: FullFieldConfig[];
  }>();

  const formState: FormState = $state({
    // eslint-disable-next-line
    metadata: metadata,
    // eslint-disable-next-line
    fieldConfigs: fieldConfigs,
    activeHelpKey: undefined
  });

  $effect(() => {
    formState.metadata = metadata;
  });

  setContext(FORMSTATE_CONTEXT, formState);
</script>

<MetadataDisplay />
