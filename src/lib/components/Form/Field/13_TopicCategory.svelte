<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import type { IsoTheme, MetadataProfile } from '$lib/models/metadata';
  import type { ValidationResult } from '../FieldsConfig';
  import { getHighestRole } from '$lib/util';
  import MultiSelectInput from '../Inputs/MultiSelectInput.svelte';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const KEY = 'isoMetadata.topicCategory';
  const TYPE_KEY = 'isoMetadata.metadataProfile';
  const ANNEX_THEME_KEY = 'isoMetadata.inspireTheme';

  const value = $derived(getValue<string[]>(KEY));
  const annexValue = $derived(getValue<string[]>(ANNEX_THEME_KEY));
  const profileValue = $derived(getValue<MetadataProfile>(TYPE_KEY));

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string[]>(13);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  let disabled = $derived(!!annexValue?.length && profileValue !== 'ISO');

  const onChange = async (newValue?: string[]) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/iso_themes');

    if (!response.ok) {
      toast.error(t('general.error_fetch_options'));
      return [];
    }

    const data = await response.json();
    return data.map((entry: IsoTheme) => ({
      key: entry.isoID,
      label: entry.isoName
    }));
  };
</script>

{#if highestRole !== 'MdeDataOwner'}
  <div class="topic-category-field">
    {#await fetchOptions()}
      <p>{t('general.loading_options')}</p>
    {:then OPTIONS}
      <MultiSelectInput
        label={fieldConfig?.label}
        {fieldConfig}
        options={OPTIONS}
        {value}
        {disabled}
        {onChange}
        {validationResult}
      />
    {/await}
    <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .topic-category-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.multi-select-input) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
