<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import MultiSelectInput from '../Inputs/MultiSelectInput.svelte';

  const KEY = 'isoMetadata.spatialRepresentationTypes';

  const OPTIONS = [
    { key: 'vector', label: 'Vektor' },
    { key: 'grid', label: 'Raster' },
    { key: 'textTable', label: 'Text/Tabelle' },
    { key: 'tin', label: 'TIN' },
    { key: 'stereoModel', label: 'Stereomodell' },
    { key: 'video', label: 'Video' }
  ];

  const valueFromData = $derived(getValue<string[]>(KEY));
  let value = $state<string[]>();
  $effect(() => {
    value = valueFromData;
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string[]>(39);
  let validationResult = $derived(fieldConfig?.validator(value));

  const onChange = async (newValue?: string[]) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="spatial-representation-field">
  <MultiSelectInput
    label={fieldConfig?.label}
    {fieldConfig}
    options={OPTIONS}
    {value}
    {onChange}
    {validationResult}
  />
  <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .spatial-representation-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.multi-select-input) {
      flex: 1;
    }
  }
</style>
