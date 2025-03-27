<script lang="ts">
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import RadioInput from '../Inputs/RadioInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import type { Option } from '$lib/models/form';

  const KEY = 'clientMetadata.privacy';

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

  const fetchOptions = async () => {
    const response = await fetch('/data/privacy');
    const data: Option[] = await response.json();
    return data;
  };
</script>

<div class="data-protection-field">
  <Paper>
    {#await fetchOptions()}
      <p>Lade Datenschutz Optionen</p>
    {:then OPTIONS}
      <RadioInput
        key={KEY}
        label={fieldConfig?.label}
        options={OPTIONS}
        {validationResult}
        {value}
        {onChange}
      />
    {/await}
  </Paper>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
