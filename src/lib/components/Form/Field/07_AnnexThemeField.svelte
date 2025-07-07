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
  import type { Option } from '$lib/models/form';
  import type { FullFieldConfig } from '../FieldsConfig';
  import { getContext } from 'svelte';
  import type { IsoTheme, MetadataProfile } from '$lib/models/metadata';
  import MultiSelectInput from '../Inputs/MultiSelectInput.svelte';
  import { toast } from 'svelte-french-toast';

  const PROFILE_KEY = 'isoMetadata.metadataProfile';
  const KEY = 'isoMetadata.inspireTheme';
  const TOPIC_KEY = 'isoMetadata.topicCategory';

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);

  let metadataProfile = $derived(getValue<MetadataProfile>(PROFILE_KEY, metadata));

  const valueFromData = $derived(getValue<string[]>(KEY));
  let value = $state<string[]>();
  $effect(() => {
    value = valueFromData;
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string[]>(7);
  let validationResult = $derived(fieldConfig?.validator(value));

  const onChange = async (newValue?: string[]) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
    await updateTopicCategory(newValue);
  };

  const updateTopicCategory = async (inspireIDs?: string[]) => {
    if (!inspireIDs || inspireIDs.length === 0) return;
    const response = await fetch(`/data/iso_themes`);

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der ISO Themen');
      return;
    }

    try {
      const data: IsoTheme[] = await response.json();
      const matches = inspireIDs
        .map((inspireId) => data.find((entry) => entry.inspireID === inspireId)?.isoID)
        .filter(Boolean) as string[];
      const uniqueValues = Array.from(new Set(matches));
      return persistValue(TOPIC_KEY, uniqueValues);
    } catch {
      toast.error('Fehler beim Verarbeiten der ISO Themen');
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/inspire_themes');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Annex Themen');
      return [];
    }

    const data: Option[] = await response.json();
    return data;
  };
</script>

{#if metadataProfile === 'INSPIRE_HARMONISED'}
  <div class="annex-theme-field">
    {#await fetchOptions()}
      <p>Lade Annex Themen</p>
    {:then OPTIONS}
      <SelectInput
        label={fieldConfig?.label}
        fieldConfig={fieldConfig as unknown as FullFieldConfig<string>}
        options={OPTIONS}
        value={Array.isArray(value) && value.length > 0 ? value[0] : undefined}
        onChange={(newValue) => onChange([newValue])}
        {validationResult}
      />
    {/await}
    <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

{#if metadataProfile === 'INSPIRE_IDENTIFIED'}
  <div class="annex-theme-field">
    {#await fetchOptions()}
      <p>Lade Annex Themen</p>
    {:then OPTIONS}
      <MultiSelectInput
        label={fieldConfig?.label}
        {fieldConfig}
        options={OPTIONS}
        {value}
        {onChange}
        {validationResult}
      />
    {/await}
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .annex-theme-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.select-input),
    :global(.multi-select-input) {
      flex: 1;
    }
  }
</style>
