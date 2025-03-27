<script lang="ts">
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import type { Option } from '$lib/models/form';

  const KEY = 'isoMetadata.crs';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onSelectionChange = async (newValue?: string) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/crs');
    const data: Option[] = await response.json();
    return data;
  };
</script>

<div class="title-field">
  <Paper>
    {#await fetchOptions()}
      <p>Lade CRS Optionen</p>
    {:then OPTIONS}
      <SelectInput
        {value}
        key={KEY}
        label={fieldConfig?.label}
        options={OPTIONS}
        onChange={onSelectionChange}
        {validationResult}
      />
    {/await}
  </Paper>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .title-field {
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
