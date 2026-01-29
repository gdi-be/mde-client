<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import toast from 'svelte-french-toast';
  import FieldTools from '../FieldTools.svelte';
  import MultiSelectInput from '../Inputs/MultiSelectInput.svelte';
  import type { Option } from '$lib/models/form';
  import { page } from '$app/state';

  const t = $derived(page.data.t);
  const KEY = 'isoMetadata.spatialRepresentationTypes';

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

  const fetchOptions = async () => {
    const response = await fetch('/data/spatial_representation_types');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der räumlichen Darstellungsarten');
      return [];
    }

    const data: Option[] = await response.json();
    return data;
  };
</script>

<div class="spatial-representation-field">
  {#await fetchOptions()}
    <p>Lade räumliche Darstellungsarten</p>
  {:then OPTIONS}
    <MultiSelectInput
      label={t('39_SpatialRepresentationField.label')}
      {fieldConfig}
      options={OPTIONS}
      {value}
      {onChange}
      {validationResult}
    />
    <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  {/await}
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
