<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';

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
  let fromValidationResult = $derived(
    fromFieldConfig?.validator(startValue, { endValue })
  ) as ValidationResult;
  const toFieldConfig = getFieldConfig<string>(TO_KEY);
  let toValidationResult = $derived(
    toFieldConfig?.validator(endValue, { startValue })
  ) as ValidationResult;

  const onChange = async (key: string) => {
    const value = key === FROM_KEY ? startValue : endValue!;
    const response = await persistValue(key, new Date(value!).toISOString());
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
      onchange={() => onChange(FROM_KEY)}
      fieldConfig={fromFieldConfig}
      validationResult={fromValidationResult}
    />
    <DateInput
      bind:value={endValue}
      label={toFieldConfig?.label}
      onchange={() => onChange(TO_KEY)}
      fieldConfig={toFieldConfig}
      validationResult={toValidationResult}
    />
  </fieldset>
  <FieldTools key={FROM_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .validity-range-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 0.25em;
      display: flex;

      > legend {
        font-size: 1.5em;
      }

      :global(.date-input) {
        flex: 1;
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.date-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
    }
  }
</style>
