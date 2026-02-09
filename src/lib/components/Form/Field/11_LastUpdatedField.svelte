<script lang="ts">
  import {
    FORMSTATE_CONTEXT,
    getFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import type { ValidationResult } from '$lib/components/Form/FieldsConfig';
  import { MetadataService } from '$lib/services/MetadataService';
  import { getContext } from 'svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.modified';

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY, metadata));
  let value = $state('');

  $effect(() => {
    if (valueFromData) {
      value = new Date(valueFromData).toISOString().split('T')[0];
    }
  });
  const fieldConfig = MetadataService.getFieldConfig<string>(11);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  let showCheckmark = $state(false);

  const onChange = async () => {
    const response = await MetadataService.persistValue(KEY, new Date(value!).toISOString());
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="date-time-field">
  <DateInput
    bind:value
    key={KEY}
    label={t('11_LastUpdatedField.label')}
    explanation={t('11_LastUpdatedField.explanation')}
    onchange={onChange}
    {fieldConfig}
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
