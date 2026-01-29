<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { MetadataProfile } from '$lib/models/metadata';
  import type { ValidationResult } from '../FieldsConfig';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.metadataProfile';
  const MetadataProfileOptions: {
    key: MetadataProfile;
    label: string;
  }[] = $derived([
    {
      key: 'ISO',
      label: t('05_MetadataProfileField.iso')
    },
    {
      key: 'INSPIRE_HARMONISED',
      label: t('05_MetadataProfileField.inspire_harmonised')
    },
    {
      key: 'INSPIRE_IDENTIFIED',
      label: t('05_MetadataProfileField.inspire_identified')
    }
  ]);

  const valueFromData = $derived(getValue<MetadataProfile>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(5);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue?: string) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="metadata-type-field">
  <SelectInput
    label={t('05_MetadataProfileField.label')}
    options={MetadataProfileOptions}
    {fieldConfig}
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
