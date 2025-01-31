<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import DateInput from "../Inputs/DateInput.svelte";
  import type { MaintenanceFrequency } from "$lib/models/metadata";
  import { getLastUpdateValue } from "../../../util";

  const KEY = 'isoMetadata.modified';
  const LABEL = 'letzte Aktualisierung';

  const initialValue = getValue<string>(KEY);
  let publishedValue = getValue<string>('isoMetadata.published');
  let maintenanceFrequencyValue = getValue<MaintenanceFrequency>('isoMetadata.maintenanceFrequency');
  let value = $state(initialValue || '');

  // TODO: check why this is not updated in real time
  $effect(() => {
    if (initialValue) {
      value = new Date(initialValue).toISOString().split('T')[0];
    } else if (publishedValue && maintenanceFrequencyValue) {
      const lastUpdateDate = getLastUpdateValue(publishedValue, maintenanceFrequencyValue);
      value = lastUpdateDate?.toISOString().split('T')[0] || '';
    }
  });

  let showCheckmark = $state(false);
  let isAutomatedValue = $derived([
    'continual',
    'daily',
    'weekly',
    'fortnightly',
    'monthly',
    'quarterly',
    'biannually',
    'annually'
  ].includes(maintenanceFrequencyValue!));
  let readOnly = $derived(!!publishedValue && isAutomatedValue);

  const onBlur = async () => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: (new Date(value!)).toISOString()
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };
</script>

<div class="date-time-field">
  <Paper>
    <DateInput
      bind:value
      key={KEY}
      label={LABEL}
      onblur={onBlur}
      disabled={readOnly}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .date-time-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
