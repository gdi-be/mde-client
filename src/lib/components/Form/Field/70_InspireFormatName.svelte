<script lang="ts">
  import {
    FORMSTATE_CONTEXT,
    getFieldConfig,
    getFormContext,
    persistValue,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { Option } from '$lib/models/form';
  import type { FullFieldConfig } from '../FieldsConfig';
  import { getContext } from 'svelte';
  import type { MetadataProfile } from '$lib/models/metadata';
  import type { InspireThemeConfig } from '$lib/models/inspire';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';
  import { page } from '$app/state';

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const t = $derived(page.data.t);

  const PROFILE_KEY = 'isoMetadata.metadataProfile';
  const KEY = 'isoMetadata.inspireFormatName';
  const ANNEX_THEME_KEY = 'isoMetadata.inspireTheme';

  const { getValue } = getFormContext();
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const annexValue = $derived(getValue<string[]>(ANNEX_THEME_KEY));
  const metadata = $derived(formState.metadata);

  let metadataProfile = $derived(getValue<MetadataProfile>(PROFILE_KEY, metadata));

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state<string>();
  $effect(() => {
    value = valueFromData;
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(70);
  let validationResult = $derived(fieldConfig?.validator(value));
  let options: Option[] = $state([]);

  const onChange = async (newValue?: string) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  $effect(() => {
    fetchOptions(annexValue);
  });

  const fetchOptions = async (annexValue?: string[]) => {
    if (!annexValue || annexValue.length === 0) {
      options = [];
      return;
    }

    const response = await fetch('/data/inspire_themes');

    if (!response.ok) {
      toast.error(t('general.error_fetch_options'));
      return [];
    }

    const data = await response.json();
    const theme = data.find((theme: InspireThemeConfig) => theme.key === annexValue[0]);
    const formatNames = theme?.schemaNames || [];
    options = formatNames.map((name: string) => ({ label: name, key: name }));
  };
</script>

{#if highestRole !== 'MdeDataOwner' && metadataProfile === 'INSPIRE_HARMONISED' && options.length > 0}
  <div class="inspire-format-name-field">
    <SelectInput
      label={t('70_InspireFormatName.label')}
      fieldConfig={fieldConfig as unknown as FullFieldConfig<string>}
      {options}
      {value}
      {onChange}
      {validationResult}
    />
    <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .inspire-format-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.select-input),
    :global(.multi-select-input) {
      flex: 1;
    }
  }
</style>
