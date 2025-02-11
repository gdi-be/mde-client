<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import RadioInput from "../Inputs/RadioInput.svelte";
  import { invalidateAll } from "$app/navigation";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'clientMetadata.privacy';
  const LABEL = 'Datenschutz';
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

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue: string) => {
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: newValue
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="data-protection-field">
  <Paper>
    <RadioInput
      key={KEY}
      label={LABEL}
      options={OPTIONS}
      {validationResult}
      {value}
      {onChange}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
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
