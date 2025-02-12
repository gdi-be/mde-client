<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue, persistValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  import SelectInput from "../Inputs/SelectInput.svelte";

  const CHECKED_KEY = 'clientMetadata.highValueDataset';
  const CATEGORY_KEY = 'isoMetadata.highValueDataCategory';
  const CHECK_LABEL = 'High Value Data Set';
  const LABEL = 'High Value Data Kategorie';

  const OPTIONS = [{
    key: 'geospatial',
    label: 'Geodaten (Geospatial)'
  }, {
    key: 'earth_observation_and_environment',
    label: 'Erdbeobachtung und Umwelt (Earth Observation and Environment)'
  }, {
    key: 'meteorological',
    label: 'Meteorologische Daten (Meteorological)'
  }, {
    key: 'statistics',
    label: 'Statistische Daten (Statistics)'
  }, {
    key: 'companies_and_company_ownership',
    label: 'Unternehmens- und Eigentümerdaten (Companies and Company Ownership)'
  }, {
    key: 'mobility',
    label: 'Mobilitätsdaten (Mobility)'
  }];

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

  let showCheckmark = $state(false);

  const onCheckChange = async (event: CustomEvent<{ selected: boolean}>) => {
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

</script>

<div class="high-value-dataset-check-field">
  <Paper>
    <FormField align="end">
      {#snippet label()}
        {CHECK_LABEL}
      {/snippet}
      <Switch
        bind:checked={checkedValue}
        onSMUISwitchChange={onCheckChange}
      />
    </FormField>
    {#if checkedValue}
      <SelectInput
        key={CATEGORY_KEY}
        label={LABEL}
        options={OPTIONS}
        value={selectionValue}
        onChange={onSelectionChange}
      />
    {/if}
  </Paper>
  <FieldTools
    key={CATEGORY_KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
  />
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
