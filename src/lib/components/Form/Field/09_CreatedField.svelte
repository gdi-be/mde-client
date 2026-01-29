<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import { page } from '$app/state';
  import type { ValidationResult } from '../FieldsConfig';

  const t = $derived(page.data.t);
  const KEY = 'isoMetadata.created';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    if (valueFromData) {
      value = new Date(valueFromData).toISOString().split('T')[0];
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(9);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async () => {
    const response = await persistValue(KEY, value ? new Date(value!).toISOString() : '');
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="date-time-field">
  <DateInput
    bind:value
    key={KEY}
    label={t('09_CreatedField.label')}
    {fieldConfig}
    onchange={onChange}
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
