<script module lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import type { TermsOfUse } from '$lib/models/metadata';

  const optionsPromises = new SvelteMap<string, Promise<TermsOfUse[]>>();
</script>

<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import type { Privacy } from '$lib/models/metadata';
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
  let options = $state<Option[]>([]);
  let isLoading = $state(false);

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<number>(25);
  let validationResult = $derived(fieldConfig?.validator(value));
  const selectedValue = $derived.by(() => {
    const stringValue = value?.toString();
    if (!stringValue || isLoading) {
      return undefined;
    }

    return options.some((option) => option.key === stringValue) ? stringValue : undefined;
  });

  const fetchOptions = async (selectedPrivacy: Privacy | undefined) => {
    const url = selectedPrivacy !== 'NONE' ? '/data/terms_of_use_privacy' : '/data/terms_of_use';

    let optionsPromise = optionsPromises.get(url);
    if (!optionsPromise) {
      optionsPromise = (async () => {
        const response = await fetch(url);

        if (!response.ok) {
          optionsPromises.delete(url);
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
      })();

      optionsPromises.set(url, optionsPromise);
    }

    return optionsPromise;
  };

  $effect(() => {
    const selectedPrivacy = privacy;

    let isActive = true;
    isLoading = true;

    fetchOptions(selectedPrivacy)
      .then((data) => {
        if (!isActive) return;

        options = data.map(
          (item: TermsOfUse): Option => ({
            key: item.id.toString(),
            label: item.shortname,
            description: item.description,
            disabled: !item.active
          })
        );
      })
      .finally(() => {
        if (!isActive) return;
        isLoading = false;
      });

    return () => {
      isActive = false;
    };
  });

  const onChange = async (newValue: string) => {
    const response = await MetadataService.persistValue(KEY, Number(newValue));
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="terms-of-use-field">
  <div class="input-wrapper">
    {#if options.length > 0}
      <SelectInput
        label={t('25_TermsOfUseField.label')}
        explanation={t('25_TermsOfUseField.explanation')}
        fieldConfig={fieldConfig as unknown as FullFieldConfig<string>}
        {options}
        value={selectedValue}
        {onChange}
        {validationResult}
      />
    {/if}
    {#if isLoading}
      <p class="loading-options">{t('general.loading_options')}</p>
    {/if}
  </div>
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

    .input-wrapper {
      flex: 1;
    }

    .loading-options {
      margin: 0.5em 0 0;
    }
  }
</style>
