<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import FieldTools from '../FieldTools.svelte';
  import { page } from '$app/state';
  import { ValidationService } from '$lib/services/ValidationService';
  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.termsOfUseSource';
  const TERMS_OF_USE_KEY = 'isoMetadata.termsOfUseId';

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY));
  const termsOfUseId = $derived(getValue<number>(TERMS_OF_USE_KEY));

  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(26);
  let validationResult = $derived(ValidationService.validateField(fieldConfig, value));

  const onBlur = async () => {
    const response = await MetadataService.persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

{#if termsOfUseId && termsOfUseId !== 1}
  <div class="terms-of-use-source-field">
    <TextInput
      bind:value
      label={t('26_TermsOfUseSourceField.label')}
      explanation={t('26_TermsOfUseSourceField.explanation')}
      {fieldConfig}
      {validationResult}
      onblur={onBlur}
    />
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .terms-of-use-source-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
