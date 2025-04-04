<script lang="ts">
  // TODO: this field should not be part of the form but be an extra button for Quality
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import FormField from '@smui/form-field';
  import Switch from '@smui/switch';

  const { metadata } = $props();

  const KEY = 'isoMetadata.valid';

  const metadataProfile = $derived(getValue<string>('isoMetadata.metadataProfile', metadata));

  const valueFromData = $derived(getValue<boolean>(KEY));
  let value = $state<boolean>(false);
  $effect(() => {
    value = !!valueFromData;
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<boolean>(KEY);

  const onCheckChange = async (event: CustomEvent<{ selected: boolean }>) => {
    const response = await persistValue(KEY, event.detail.selected);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

{#if metadataProfile === 'INSPIRE_HARMONISED'}
  <div class="quality-report-check-field">
    <Paper>
      <FormField align="end">
        {#snippet label()}
          {fieldConfig?.label}
        {/snippet}
        <Switch bind:checked={value} onSMUISwitchChange={onCheckChange} />
      </FormField>
    </Paper>
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .quality-report-check-field {
    display: flex;
    position: relative;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }
  }
</style>
