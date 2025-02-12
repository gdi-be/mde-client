<script lang="ts">
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue, persistValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import RadioInput from "../Inputs/RadioInput.svelte";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'clientMetadata.privacy';
  const OPTIONS: {
    key: string;
    label: string;
  }[] = [{
    key: 'NONE',
    label: 'Nicht Datenschutz relevant'
  }, {
    key: 'INTERNAL_USE_ONLY',
    label: 'Schutz von Daten juristischer Personen und deren Interessen - Nutzungsbestimmung "Nur für den Dienstgebrauch"'
  }, {
    key: 'PERSONAL_DATA',
    label: 'Schutz von persönlichen Daten bei natürlichen Personen'
  }, {
    key: 'CRITICAL_INFRASTRUCTURE',
    label: 'Schutz von Daten, die als Kritische Infrastruktur eingestuft werden'
  }];

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue: string) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

</script>

<div class="data-protection-field">
  <Paper>
    <RadioInput
      key={KEY}
      label={fieldConfig?.label}
      options={OPTIONS}
      {validationResult}
      {value}
      {onChange}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
  />
</div>

<style lang="scss">
  .data-protection-field {
    display: flex;
    position: relative;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }
  }
</style>
