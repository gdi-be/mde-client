<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import { invalidateAll } from '$app/navigation';
  import { MetadataService } from '$lib/services/MetadataService';
  import { page } from '$app/state';
  import FieldHint from '../FieldHint.svelte';

  const t = $derived(page.data.t);
  const FROM_KEY = 'isoMetadata.validFrom';
  const TO_KEY = 'isoMetadata.validTo';

  const { getValue, updateFormState } = getFormContext();
  const startValueFromData = $derived(getValue<string>(FROM_KEY));
  let startValue = $derived(
    startValueFromData ? new Date(startValueFromData).toISOString().split('T')[0] : ''
  );

  const endValueFromData = $derived(getValue<string>(TO_KEY));
  let endValue = $derived(
    endValueFromData ? new Date(endValueFromData).toISOString().split('T')[0] : ''
  );

  let showCheckmark = $state(false);
  const fromFieldConfig = MetadataService.getFieldConfig<string>(12);
  let fromValidationResult = $derived(fromFieldConfig?.validator(startValue, [endValue]));

  const toFieldConfig = MetadataService.getFieldConfig<string>(24);
  let toValidationResult = $derived(toFieldConfig?.validator(endValue, [startValue]));

  const syncLocalValue = () => {
    updateFormState(FROM_KEY, startValue ? new Date(startValue).toISOString() : null);
    updateFormState(TO_KEY, endValue ? new Date(endValue).toISOString() : null);
  };

  const onBlur = async (key: string) => {
    syncLocalValue();
    const validationResult = key === FROM_KEY ? fromValidationResult : toValidationResult;
    if (validationResult?.valid === false) {
      return;
    }
    const value = key === FROM_KEY ? startValue : endValue!;
    const valueToPersist = value ? new Date(value).toISOString() : null;
    const response = await MetadataService.persistValue(key, valueToPersist);
    if (response.ok) {
      showCheckmark = true;
    }
    invalidateAll();
  };

  const onChange = (key: string, evt: Event) => {
    const inputValue = (evt.currentTarget as HTMLInputElement | null)?.value ?? '';
    if (key === FROM_KEY) {
      startValue = inputValue;
    } else {
      endValue = inputValue;
    }
    syncLocalValue();
  };

  let hasInvalidFields = $derived.by(() => {
    const fromConfig = fromFieldConfig;
    const toConfig = toFieldConfig;
    if (!fromConfig || !toConfig) return false;

    const fromRequired = fromConfig.required;
    const toRequired = toConfig.required;

    const fromValid = fromValidationResult?.valid;
    const toValid = toValidationResult?.valid;

    return (fromRequired && !fromValid) || (toRequired && !toValid);
  });
</script>

<div class={['validity-range-field', hasInvalidFields ? 'invalid' : '']}>
  <fieldset>
    <legend>{t('12_ValidityRangeField.label')}</legend>
    <FieldHint explanation={t('12_ValidityRangeField.explanation')} />
    <div class="input-container">
      <DateInput
        bind:value={startValue}
        label={t('12_ValidityRangeField.label_from')}
        onchange={(evt) => onChange(FROM_KEY, evt)}
        onblur={() => onBlur(FROM_KEY)}
        fieldConfig={fromFieldConfig}
        validationResult={fromValidationResult}
      />
      <DateInput
        bind:value={endValue}
        label={t('12_ValidityRangeField.label_to')}
        onchange={(evt) => onChange(TO_KEY, evt)}
        onblur={() => onBlur(TO_KEY)}
        fieldConfig={toFieldConfig}
        validationResult={toValidationResult}
      />
    </div>
  </fieldset>
  <FieldTools
    fieldConfig={fromFieldConfig}
    key={FROM_KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
  />
</div>

<style lang="scss">
  .validity-range-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    &.invalid {
      border: 2px solid var(--mdc-theme-error) !important;
    }

    :global(.field-hint) {
      margin: 0.5em 0;
    }

    fieldset {
      flex: 1;
      border-radius: 0.25em;
      display: flex;
      flex-direction: column;

      > legend {
        font-size: 1.5em;
      }

      .input-container {
        flex: 1;
        flex-wrap: wrap;
        border-radius: 0.25em;
        display: flex;

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
  }
</style>
