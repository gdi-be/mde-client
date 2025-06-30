<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { TermsOfUse } from '$lib/models/metadata';
  import type { Option } from '$lib/models/form';
  import type { FullFieldConfig } from '../FieldsConfig';
  import { toast } from 'svelte-french-toast';

  const KEY = 'isoMetadata.termsOfUseId';

  const value = $derived(getValue<number>(KEY));

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<number>(25);
  let validationResult = $derived(fieldConfig?.validator(value));

  const fetchOptions = async () => {
    const response = await fetch('/data/terms_of_use');

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Nutzungsbedingungen');
      return [];
    }

    const data: TermsOfUse[] = await response.json();
    data.sort((a, b) => {
      if (a.active === b.active) {
        return a.shortname.localeCompare(b.shortname);
      }
      return a.active ? -1 : 1;
    });
    return data;
  };

  const onChange = async (newValue: string) => {
    const response = await persistValue(KEY, Number(newValue));
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="terms-of-use-field">
  {#await fetchOptions()}
    <p>Lade Nutzungsbedingungen</p>
  {:then OPTIONS}
    <div class="input-wrapper">
      <SelectInput
        label={fieldConfig?.label || KEY}
        fieldConfig={fieldConfig as unknown as FullFieldConfig<string>}
        options={OPTIONS.map(
          (item: TermsOfUse): Option => ({
            key: item.id.toString(),
            label: item.shortname,
            disabled: !item.active,
            description: item.description
          })
        )}
        value={value?.toString()}
        {onChange}
        {validationResult}
      />
      {#if value !== 1}
        <p class="not-standard">
          Die Nutzungsbedingungen weichen von den Standardnutzungsbedingungen ab. Dies sollte nur in
          Ausnahmefällen und in Absprache mit einem Redakteur geschehen.
        </p>
      {/if}
    </div>
  {/await}
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  :global(.terms-of-use-dialog .mdc-text-field) {
    width: 100%;
  }

  .terms-of-use-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.input-wrapper) {
      flex: 1;
    }

    .not-standard {
      font-size: 0.75rem;
      color: var(--error-color);
      margin: 1em;
    }
  }
</style>
