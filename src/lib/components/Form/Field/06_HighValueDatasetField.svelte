<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import Switch from '@smui/switch';
  import type { Option } from '$lib/models/form';
  import FieldHint from '../FieldHint.svelte';
  import MultiSelectInput from '$lib/components/Form/Inputs/MultiSelectInput.svelte';
  import { toast } from 'svelte-french-toast';
  import type { ValidationResult } from '../FieldsConfig';

  const CHECKED_KEY = 'isoMetadata.highValueDataset';
  const CATEGORY_KEY = 'isoMetadata.highValueDataCategory';
  const LABEL = 'HVD Kategorie';

  const checkedValueFromData = $derived(getValue<boolean>(CHECKED_KEY));
  let checkedValue = $state(false);
  $effect(() => {
    checkedValue = checkedValueFromData || false;
  });
  const selectionValueFromData = $derived(getValue<string[]>(CATEGORY_KEY));
  let selectionValue = $state<string[]>();
  $effect(() => {
    selectionValue = selectionValueFromData;
  });

  const checkedFieldConfig = getFieldConfig<boolean>(6);
  const categoryFieldConfig = getFieldConfig<string[]>(8);
  let categoryValidationResult = $derived(
    categoryFieldConfig?.validator(selectionValue)
  ) as ValidationResult;

  let showCheckmark = $state(false);

  const onCheckChange = async (event: CustomEvent<{ selected: boolean }>) => {
    const value = event.detail.selected;
    const response = await persistValue(CHECKED_KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const onSelectionChange = async (newSelection?: string[]) => {
    const response = await persistValue(CATEGORY_KEY, newSelection);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/hvd_categories');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der HVD Kategorien');
      return [];
    }

    const data: Option[] = await response.json();
    return data;
  };
</script>

<div class="high-value-dataset-check-field">
  <fieldset>
    <legend>
      {checkedFieldConfig?.label}
      <Switch bind:checked={checkedValue} onSMUISwitchChange={onCheckChange} />
    </legend>
    <FieldHint fieldConfig={checkedFieldConfig} />
    {#if checkedValue}
      {#await fetchOptions()}
        <p>Lade HVD Kategorien</p>
      {:then OPTIONS}
        <MultiSelectInput
          label={LABEL}
          options={OPTIONS}
          value={selectionValue}
          onChange={onSelectionChange}
          fieldConfig={categoryFieldConfig}
          validationResult={categoryValidationResult}
        />
      {/await}
    {/if}
  </fieldset>
  <FieldTools key={CATEGORY_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .high-value-dataset-check-field {
    display: flex;
    position: relative;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 0.25rem;

      legend {
        font-size: 1.5em;
      }

      :global(.select-input) {
        margin-top: 1em;
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.select-input legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
    }
  }
</style>
