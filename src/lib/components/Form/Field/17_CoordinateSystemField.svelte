<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import type { Option } from '$lib/models/form';
  import { getHighestRole } from '$lib/util';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  const KEY = 'isoMetadata.crs';

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(17);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onSelectionChange = async (newValue?: string) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/crs');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der CRS Optionen');
      return [];
    }

    const data: Option[] = await response.json();
    return data;
  };
</script>

{#if highestRole !== 'MdeDataOwner'}
  <div class="title-field">
    {#await fetchOptions()}
      <p>Lade CRS Optionen</p>
    {:then OPTIONS}
      <SelectInput
        {value}
        label={fieldConfig?.label}
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
