<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import {
    FORMSTATE_CONTEXT,
    getFieldConfig,
    getValue,
    persistValue,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import FieldTools from '../FieldTools.svelte';
  import { getHighestRole } from '$lib/util';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  const KEY = 'isoMetadata.inspireAnnexVersion';
  const PROFILE_KEY = 'isoMetadata.metadataProfile';

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let metadataProfile = $derived(getValue<string>(PROFILE_KEY, metadata));

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(38);
  let validationResult = $derived(
    fieldConfig?.validator(value, {
      'isoMetadata.metadataProfile': metadataProfile
    })
  );

  const onBlur = async () => {
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fieldVisible = $derived(
    metadataProfile === 'INSPIRE_HARMONISED' &&
      ['MdeEditor', 'MdeAdministrator'].includes(highestRole)
  );
</script>

{#if fieldVisible}
  <div class="inspire-annex-version-field">
    <TextInput
      bind:value
      label={fieldConfig?.label}
      {fieldConfig}
      onblur={onBlur}
      {validationResult}
    />
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .inspire-annex-version-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
