<script lang="ts">
  import {
    FORMSTATE_CONTEXT,
    getFieldConfig,
    getValue,
    persistValue,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import FormField from '@smui/form-field';
  import Switch from '@smui/switch';
  import type { Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));

  const KEY = 'isoMetadata.valid';

  const metadataProfile = $derived(getValue<string>('isoMetadata.metadataProfile', metadata));

  const valueFromData = $derived(getValue<boolean>(KEY));
  let value = $state<boolean>(false);
  $effect(() => {
    value = !!valueFromData;
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<boolean>(37);

  const onCheckChange = async (event: CustomEvent<{ selected: boolean }>) => {
    const response = await persistValue(KEY, event.detail.selected);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fieldVisible = $derived(
    metadataProfile === 'INSPIRE_HARMONISED' &&
      ['MdeQualityAssurance', 'MdeAdministrator'].includes(highestRole)
  );
</script>

{#if fieldVisible}
  <div class="quality-report-check-field">
    <fieldset>
      <legend>{fieldConfig?.label}</legend>
      <FormField align="end">
        {#snippet label()}Überprüft{/snippet}
        <Switch bind:checked={value} onSMUISwitchChange={onCheckChange} />
      </FormField>
    </fieldset>
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .quality-report-check-field {
    display: flex;
    position: relative;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 0.25em;

      legend {
        font-size: 1.5em;
      }
    }
  }
</style>
