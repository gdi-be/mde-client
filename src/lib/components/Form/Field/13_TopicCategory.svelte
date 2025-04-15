<script lang="ts">
  import {
    FORMSTATE_CONTEXT,
    getFieldConfig,
    getValue,
    persistValue,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { IsoTheme } from '$lib/models/metadata';
  import type { ValidationResult } from '../FieldsConfig';
  import { getContext } from 'svelte';

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);

  const KEY = 'isoMetadata.topicCategory';
  const ANNEX_THEME_KEY = 'isoMetadata.inspireTheme';

  const inspireTheme = $derived(getValue<string>(ANNEX_THEME_KEY, metadata));
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    if (valueFromData) {
      value = valueFromData;
    }
  });

  $effect(() => {
    getAutoFillValues(inspireTheme);
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue?: string) => {
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

  const getAutoFillValues = async (inspireID?: string) => {
    if (!inspireID) return;
    const response = await fetch(`/data/iso_themes`);
    const data = await response.json();
    const match = data.find((entry: IsoTheme) => entry.inspireID === inspireID);
    if (!match) return;
    value = match.isoID;
    onChange(value);
  };
</script>

<div class="topic-category-field">
  {#await fetchOptions()}
    <p>Lade Themen Kategorien</p>
  {:then OPTIONS}
    <SelectInput
      key={KEY}
      label={fieldConfig?.label}
      options={OPTIONS}
      disabled={!!inspireTheme}
      {value}
      {onChange}
      {validationResult}
    />
  {/await}
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .topic-category-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.select-input) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
