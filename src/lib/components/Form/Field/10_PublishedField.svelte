<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import { MetadataService } from '$lib/services/MetadataService';
  import { page } from '$app/state';

  const t = $derived(page.data.t);
  const KEY = 'isoMetadata.published';

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  let initialized = false;

  // TODO: this should be replaced by deriving "value". This
  // should be possible after svelte is updated to the latest version
  // https://github.com/gdi-be/mde-client/pull/261
  $effect(() => {
    if (!initialized) {
      if (valueFromData) {
        value = new Date(valueFromData).toISOString().split('T')[0];
      }
      initialized = true;
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(10);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onBlur = async (evt: FocusEvent) => {
    const inputValue = (evt.currentTarget as HTMLInputElement | null)?.value ?? '';
    value = inputValue;
    const response = await MetadataService.persistValue(
      KEY,
      inputValue ? new Date(inputValue).toISOString() : null
    );

    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="date-time-field">
  <DateInput
    bind:value
    key={KEY}
    label={t('10_PublishedField.label')}
    explanation={t('10_PublishedField.explanation')}
    {fieldConfig}
    onblur={onBlur}
    {validationResult}
  />
  <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .date-time-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.date-input) {
      flex: 1;
    }
  }
</style>
