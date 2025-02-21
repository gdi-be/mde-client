<script lang="ts">
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { MaintenanceFrequency } from '$lib/models/metadata';
  import type { ValidationResult } from '../FieldsConfig';

  const KEY = 'isoMetadata.maintenanceFrequency';
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

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue?: string) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="metadata-type-field">
  <Paper>
    <SelectInput
      key={KEY}
      label={fieldConfig?.label}
      options={OPTIONS}
      {value}
      {onChange}
      {validationResult}
    />
  </Paper>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .metadata-type-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
