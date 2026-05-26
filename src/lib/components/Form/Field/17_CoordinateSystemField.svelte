<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import { MetadataService } from '$lib/services/MetadataService';
  import type { Option } from '$lib/models/form';
  import { getHighestRole } from '$lib/util';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.crs';

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(17);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onSelectionChange = async (newValue?: string) => {
    const response = await MetadataService.persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/crs');

    if (!response.ok) {
      toast.error(t('general.error_fetch_options'));
      return [];
    }

    const data: Option[] = await response.json();
    return data;
  };
</script>

{#if highestRole !== 'MdeDataOwner'}
  <div class="title-field">
    {#await fetchOptions()}
      <p>{t('general.loading_options')}</p>
    {:then OPTIONS}
      <SelectInput
        {value}
        label={t('17_CoordinateSystemField.label')}
        explanation={t('17_CoordinateSystemField.explanation')}
        options={OPTIONS}
        onChange={onSelectionChange}
        {validationResult}
      />
    {/await}
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.select-input) {
      flex: 1;
    }
  }
</style>
