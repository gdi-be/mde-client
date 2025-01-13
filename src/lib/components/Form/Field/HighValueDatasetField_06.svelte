<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  import SelectInput from "../Inputs/SelectInput.svelte";

  const CHECKED_KEY = 'clientMetadata.highValueDataset';
  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'High Value Dataset';
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
  let initialSelectionValue = getValue<string>(KEY);
  let selectionValue = $state(initialSelectionValue);

  let showCheckmark = $state(false);

  const onCheckChange = async (newCheckedValue: boolean) => {
    // TODO: Implement
    console.log(newCheckedValue);
  };

  const onSelectionChange = async (newSelection?: string) => {
    // TODO: Implement
    console.log(newSelection);
  };

</script>

<div class="high-value-dataset-check-field">
  <Paper>
    <FormField align="end">
      {#snippet label()}
        {LABEL}
      {/snippet}
      <Switch
        bind:checked={checkedValue}
        onSMUISwitchChange={() => onCheckChange(!checkedValue)}
      />
    </FormField>
    {#if checkedValue}
      <SelectInput
        key={KEY}
        label={LABEL}
        options={OPTIONS}
        value={selectionValue}
        onChange={onSelectionChange}
      />
    {/if}
  </Paper>
  <FieldTools
    key={KEY}
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
