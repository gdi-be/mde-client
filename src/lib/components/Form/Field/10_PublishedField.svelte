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

  $effect(() => {
    if (valueFromData) {
      value = new Date(valueFromData).toISOString().split('T')[0];
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(10);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async () => {
    const response = await MetadataService.persistValue(
      KEY,
      value ? new Date(value!).toISOString() : ''
    );

    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="published-field">
  <DateInput
    bind:value
    key={KEY}
    label={t('10_PublishedField.label')}
    explanation={t('10_PublishedField.explanation')}
    {fieldConfig}
    onchange={onChange}
    {validationResult}
  />
  <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .published-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.date-input) {
      flex: 1;
    }
  }
</style>
