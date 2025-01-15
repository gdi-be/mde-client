<script lang="ts">
  import { page } from "$app/stores";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import { invalidateAll } from "$app/navigation";

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

  let initialCheckedValue = getValue<boolean>(CHECKED_KEY) || false;
  let checkedValue = $state(initialCheckedValue);
  let initialSelectionValue = getValue<string>(CATEGORY_KEY);
  let selectionValue = $state(initialSelectionValue);

  let showCheckmark = $state(false);

  const onCheckChange = async (event: CustomEvent<{ selected: boolean}>) => {
    const response = await fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: CHECKED_KEY,
        value: event.detail.selected
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

  const onSelectionChange = async (newSelection?: string) => {
    const response = await fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: CATEGORY_KEY,
        value: newSelection
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
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
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .high-value-dataset-check-field {
    display: flex;
    position: relative;
    gap: 1em;

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
