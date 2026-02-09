<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import RadioInput from '../Inputs/RadioInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import { MetadataService } from '$lib/services/MetadataService';
  import type { Option } from '$lib/models/form';
  import { toast } from 'svelte-french-toast';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.privacy';
  const TERMS_OF_USE_KEY = 'isoMetadata.termsOfUseId';

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });
  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(4);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue: string) => {
    const response = await MetadataService.persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;

      // delete terms of use value if privacy is changed
      await MetadataService.persistValue(TERMS_OF_USE_KEY, null);
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/privacy');

    if (!response.ok) {
      toast.error(t('general.error_fetch_options'));
      return [];
    }

    const data: Option[] = await response.json();
    return data;
  };
</script>

<div class="data-protection-field">
  {#await fetchOptions()}
    <p>{t('general.loading_options')}</p>
  {:then OPTIONS}
    <RadioInput
      key={KEY}
      label={t('04_PrivacyField.label')}
      explanation={t('04_PrivacyField.explanation')}
      {fieldConfig}
      options={OPTIONS}
      {validationResult}
      {value}
      {onChange}
    />
  {/await}
  <FieldTools key={KEY} {fieldConfig} bind:checkMarkAnmiationRunning={showCheckmark} />
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
