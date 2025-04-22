<script lang="ts">
  import {
    getFieldConfig,
    getValue,
    persistValue,
  } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import type { IsoTheme } from '$lib/models/metadata';
  import type { ValidationResult } from '../FieldsConfig';
  import { getContext } from 'svelte';
  import type { Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';
  import MultiSelectInput from '../Inputs/MultiSelectInput.svelte';

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));

  const KEY = 'isoMetadata.topicCategory';
  const ANNEX_THEME_KEY = 'isoMetadata.inspireTheme';

  const value = $derived(getValue<string[]>(KEY));
  const annexValue = $derived(getValue<string[]>(ANNEX_THEME_KEY));

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string[]>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  let disabled = $derived(!!annexValue?.length);

  const onChange = async (newValue?: string[]) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/iso_themes');
    const data = await response.json();
    return data.map((entry: IsoTheme) => ({
      key: entry.isoID,
      label: entry.isoName
    }));
  };

  $inspect(disabled);
</script>

{#if highestRole !== 'MdeDataOwner'}
  <div class="topic-category-field">
    {#await fetchOptions()}
      <p>Lade Themen Kategorien</p>
    {:then OPTIONS}
      <MultiSelectInput
        label={fieldConfig?.label}
        {fieldConfig}
        options={OPTIONS}
        value={value}
        {disabled}
        {onChange}
        {validationResult}
      />
    {/await}
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
