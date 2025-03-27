<script lang="ts">
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { Option } from '$lib/models/form';
  import type { ValidationResult } from '../FieldsConfig';

  const PROFILE_KEY = 'isoMetadata.metadataProfile';
  const KEY = 'isoMetadata.inspireTheme';

  const { metadata } = $props();

  let metadataProfile = $derived(getValue<string>(PROFILE_KEY, metadata));

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
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
    const response = await fetch('/data/inspire_themes');
    const data: Option[] = await response.json();

    console.log(data);

    return data;

  };
</script>

{#if metadataProfile !== 'ISO'}
  <div class="annex-theme-field">
    <Paper>
      {#await fetchOptions()}
        <p>Lade Annex Themen</p>
      {:then OPTIONS}
        <SelectInput
          key={KEY}
          label={fieldConfig?.label}
          options={OPTIONS}
          {value}
          {onChange}
          {validationResult}
        />
      {/await}
    </Paper>
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .annex-theme-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
