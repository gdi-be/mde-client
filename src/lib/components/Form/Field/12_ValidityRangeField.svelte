<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import DateInput from "../Inputs/DateInput.svelte";
  import type { ValidationResult } from "../FieldsConfig";

  const FROM_KEY = 'isoMetadata.validFrom';
  const TO_KEY = 'isoMetadata.validTo';
  const LABEL = 'Gültigkeitszeitraum';

  const startValueFromData = $derived(getValue<string>(FROM_KEY));
  let startValue = $state('');
  $effect(() => {
    if (startValueFromData) {
      startValue = new Date(startValueFromData).toISOString().split('T')[0];
    }
  });

  const endValueFromData = $derived(getValue<string>(TO_KEY));
  let endValue = $state('');
  $effect(() => {
    if (endValueFromData) {
      endValue = new Date(endValueFromData).toISOString().split('T')[0];
    }
  });

  let showCheckmark = $state(false);
  const fromFieldConfig = getFieldConfig<string>(FROM_KEY);
  let fromValidationResult = $derived(fromFieldConfig?.validator(startValue, {endValue})) as ValidationResult;
  const toFieldConfig = getFieldConfig<string>(TO_KEY);
  let toValidationResult = $derived(toFieldConfig?.validator(endValue, {startValue})) as ValidationResult;

  const onBlur = async (key: string) => {
    const value = key === FROM_KEY ? startValue : endValue!;
    const response = await persistValue(key, (new Date(value!)).toISOString());
    if (response.ok) {
      showCheckmark = true;
    }
  };

</script>

<div class="validity-range-field">
  <fieldset>
    <legend>{LABEL}</legend>
    <DateInput
      bind:value={startValue}
      label={fromFieldConfig?.label}
      onblur={() => onBlur(FROM_KEY)}
      validationResult={fromValidationResult}
    />
    <DateInput
      bind:value={endValue}
      label={toFieldConfig?.label}
      onblur={() => onBlur(TO_KEY)}
      validationResult={toValidationResult}
    />
  </fieldset>
  <FieldTools
    key={FROM_KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
  />
</div>

<style lang="scss">
  .validity-range-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }

    fieldset {
      flex: 1;
      border-radius: 4px;

      >legend {
        display: flex;
        align-items: center;
        font-size: 0.75em;
      }
    }
  }
</style>
