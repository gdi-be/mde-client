<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { MaintenanceFrequency } from '$lib/models/metadata';
  import { MetadataService } from '$lib/services/MetadataService';
  import type { ValidationResult } from '../FieldsConfig';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

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

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(14);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue?: string) => {
    const response = await MetadataService.persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="metadata-type-field">
  <SelectInput
    label={t('14_MaintenanceFrequencyField.label')}
    explanation={t('14_MaintenanceFrequencyField.explanation')}
    {fieldConfig}
    options={OPTIONS}
    {value}
    {onChange}
    {validationResult}
  />
  <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .metadata-type-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.select-input) {
      flex: 1;
    }
  }
</style>
