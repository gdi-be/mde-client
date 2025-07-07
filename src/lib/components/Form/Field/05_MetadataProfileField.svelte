<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { MetadataProfile } from '$lib/models/metadata';
  import type { ValidationResult } from '../FieldsConfig';

  const KEY = 'isoMetadata.metadataProfile';
  export const MetadataProfileOptions: {
    key: MetadataProfile;
    label: string;
  }[] = [
    {
      key: 'ISO',
      label: 'ISO'
    },
    {
      key: 'INSPIRE_HARMONISED',
      label: 'INSPIRE harmonisiert'
    },
    {
      key: 'INSPIRE_IDENTIFIED',
      label: 'INSPIRE identifiziert'
    }
  ];

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
    label={fieldConfig?.label}
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
