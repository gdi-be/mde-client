<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { TermsOfUse } from '$lib/models/metadata';
  import type { Option } from '$lib/models/form';
  import type { ValidationResult } from '../FieldsConfig';

  const KEY = 'isoMetadata.termsOfUseId';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  let termsOfUseList: TermsOfUse[] = $state([]);
  const selectedDescription = $derived.by(() => {
    const description = termsOfUseList.find((item) => item.id === Number(value))?.description;
    if (!description) return '';
    return description.replace(/{{(.*?)}}/g, (match, p1) => getValue(p1.trim()) || match);
  });
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const fetchOptions = async () => {
    const response = await fetch('/data/terms_of_use');
    const data: TermsOfUse[] = await response.json();
    data.sort((a, b) => {
      if (a.active === b.active) {
        return a.shortname.localeCompare(b.shortname);
      }
      return a.active ? -1 : 1;
    });
    termsOfUseList = data;
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
        label={fieldConfig?.label}
        {fieldConfig}
        options={OPTIONS.map(
          (item: TermsOfUse): Option => ({
            key: item.id.toString(),
            label: item.shortname,
            disabled: !item.active
          })
        )}
        value={value.toString()}
        {onChange}
        {validationResult}
      />
      {#if selectedDescription}
        <p class="description">{selectedDescription}</p>
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

    .description {
      font-size: 0.75em;
      color: var(--mdc-theme-secondary);
    }
  }
</style>
