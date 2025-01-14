<script lang='ts'>
  import { page } from '$app/stores';
  import Paper from '@smui/paper';
  import { getValue } from '../FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import { invalidateAll } from '$app/navigation';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { MaintenanceFrequency } from '$lib/models/metadata';

  const KEY = 'isoMetadata.maintenanceFrequency';
  const LABEL = 'Pflegeintervall*';
  const OPTIONS: {
    key: MaintenanceFrequency;
    label: string;
  }[] = [
    { key: 'continual', label: 'kontinuierlich' },
    { key: 'daily', label: 'täglich' },
    { key: 'weekly', label: 'wöchentlich' },
    { key: 'fortnightly', label: 'vierzehntägig' },
    { key: 'monthly', label: 'monatlich' },
    { key: 'quarterly', label: 'vierteljährlich' },
    { key: 'biannually', label: 'halbjährlich' },
    { key: 'annually', label: 'jährlich' },
    { key: 'asNeeded', label: 'bei Bedarf' },
    { key: 'irregular', label: 'unregelmäßig' },
    { key: 'notPlanned', label: 'nicht geplant' },
    { key: 'unknown', label: 'unbekannt' }
  ];

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onChange = async (newValue?: string) => {
    // TODO check if value has changed
    const response = await fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: newValue
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class='metadata-type-field'>
  <Paper>
    <SelectInput
      key={KEY}
      label={LABEL}
      options={OPTIONS}
      {value}
      {onChange}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang='scss'>
  .metadata-type-field {
    position: relative;
    display: flex;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
