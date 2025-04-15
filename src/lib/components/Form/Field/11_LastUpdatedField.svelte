<script lang="ts">
  import {
    FORMSTATE_CONTEXT,
    getFieldConfig,
    getValue,
    persistValue,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import type { MaintenanceFrequency } from '$lib/models/metadata';
  import type { ValidationResult } from '$lib/components/Form/FieldsConfig';
  import { isAutomatedValue } from '$lib/util';
  import { getContext } from 'svelte';

  const KEY = 'isoMetadata.modified';

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);

  let publishedValue = $derived(getValue<string>('isoMetadata.published', metadata));
  let maintenanceFrequencyValue = $derived(
    getValue<MaintenanceFrequency>('isoMetadata.maintenanceFrequency', metadata)
  );
  const valueFromData = $derived(getValue<string>(KEY, metadata));
  let value = $state('');

  $effect(() => {
    if (valueFromData) {
      value = new Date(valueFromData).toISOString().split('T')[0];
    }
  });
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  let showCheckmark = $state(false);
  let automated = $derived(isAutomatedValue(publishedValue, maintenanceFrequencyValue));

  const onChange = async () => {
    const response = await persistValue(KEY, new Date(value!).toISOString());
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="date-time-field">
  <DateInput
    bind:value
    key={KEY}
    label={fieldConfig?.label}
    onchange={onChange}
    disabled={automated}
    {validationResult}
  />
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
