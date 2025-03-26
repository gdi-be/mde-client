<script lang="ts">
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';

  const KEY = 'isoMetadata.published';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    if (valueFromData) {
      value = new Date(valueFromData).toISOString().split('T')[0];
    }
  });
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async () => {
    const response = await persistValue(KEY, new Date(value!).toISOString());
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="date-time-field">
  <Paper>
    <DateInput
      bind:value
      key={KEY}
      label={fieldConfig?.label}
      onchange={onChange}
      {validationResult}
    />
  </Paper>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .date-time-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
