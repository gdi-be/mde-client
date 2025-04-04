<script lang="ts">
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import Switch from '@smui/switch';
  import FormField from '@smui/form-field';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { Option } from '$lib/models/form';

  const CHECKED_KEY = 'clientMetadata.highValueDataset';
  const CATEGORY_KEY = 'isoMetadata.highValueDataCategory';
  const LABEL = 'HVD Kategorie';

  const checkedValueFromData = $derived(getValue<boolean>(CHECKED_KEY));
  let checkedValue = $state(false);
  $effect(() => {
    checkedValue = checkedValueFromData || false;
  });
  const selectionValueFromData = $derived(getValue<string>(CATEGORY_KEY));
  let selectionValue = $state('');
  $effect(() => {
    selectionValue = selectionValueFromData || '';
  });

  const fieldConfig = getFieldConfig<string>(CHECKED_KEY);

  let showCheckmark = $state(false);

  const onCheckChange = async (event: CustomEvent<{ selected: boolean }>) => {
    const value = event.detail.selected;
    const response = await persistValue(CHECKED_KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const onSelectionChange = async (newSelection?: string) => {
    const response = await persistValue(CATEGORY_KEY, newSelection);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/hvd_categories');
    const data: Option[] = await response.json();
    return data;
  };
</script>

<div class="high-value-dataset-check-field">
  <Paper>
    <FormField align="end">
      {#snippet label()}
        {fieldConfig?.label}
      {/snippet}
      <Switch bind:checked={checkedValue} onSMUISwitchChange={onCheckChange} />
    </FormField>
    {#if checkedValue}
      {#await fetchOptions()}
        <p>Lade HVD Kategorien</p>
      {:then OPTIONS}
        <SelectInput
          key={CATEGORY_KEY}
          label={LABEL}
          options={OPTIONS}
          value={selectionValue}
          onChange={onSelectionChange}
        />
      {/await}
    {/if}
  </Paper>
  <FieldTools key={CATEGORY_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .high-value-dataset-check-field {
    display: flex;
    position: relative;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    :global(.smui-paper .mdc-select) {
      width: 100%;
    }
  }
</style>
