<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import FormField from "@smui/form-field";
  import Switch from "@smui/switch";

  const {
    metadata
  } = $props();

  const KEY = 'isoMetadata.valid';
  const LABEL = 'Überprüft durch INSPIRE Qualitätssicherung';

  const metadataProfile = $derived(getValue<string>('isoMetadata.metadataProfile', metadata));

  let initialValue = getValue<boolean>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onCheckChange = async (event: CustomEvent<{ selected: boolean}>) => {
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: event.detail.selected
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

{#if metadataProfile === 'INSPIRE_HARMONISED'}
  <div class="quality-report-check-field">
    <Paper>
      <FormField align="end">
        {#snippet label()}
          {LABEL}
        {/snippet}
        <Switch
          bind:checked={value}
          onSMUISwitchChange={onCheckChange}
        />
      </FormField>
    </Paper>
    <FieldTools
      key={KEY}
      bind:running={showCheckmark}
    />
  </div>
{/if}

<style lang="scss">
  .quality-report-check-field {
    display: flex;
    position: relative;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }
  }
</style>
