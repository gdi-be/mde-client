<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import type { Privacy, TermsOfUse } from '$lib/models/metadata';
  import type { Option } from '$lib/models/form';
  import type { FullFieldConfig } from '../FieldsConfig';
  import { toast } from 'svelte-french-toast';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.termsOfUseId';
  const PRIVACY_KEY = 'isoMetadata.privacy';

  const { getValue } = getFormContext();
  const value = $derived(getValue<number>(KEY));
  const privacy = $derived(getValue<Privacy>(PRIVACY_KEY));

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<number>(25);
  let validationResult = $derived(fieldConfig?.validator(value));

  const fetchOptions = async () => {
    const url = privacy !== 'NONE' ? '/data/terms_of_use_privacy' : '/data/terms_of_use';
    const response = await fetch(url);

    if (!response.ok) {
      toast.error(t('general.error_fetch_options'));
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
    const response = await MetadataService.persistValue(KEY, Number(newValue));
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="terms-of-use-field">
  {#await fetchOptions()}
    <p>{t('general.loading_options')}</p>
  {:then OPTIONS}
    <div class="input-wrapper">
      <SelectInput
        label={t('25_TermsOfUseField.label')}
        explanation={t('25_TermsOfUseField.explanation')}
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
    </div>
  {/await}
  <FieldTools key={KEY} {fieldConfig} bind:checkMarkAnmiationRunning={showCheckmark} />
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
  }
</style>
