<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import type { ValidationResult } from '../FieldsConfig';

  const KEY = 'isoMetadata.termsOfUseSource';
  const TERMS_OF_USE_KEY = 'isoMetadata.termsOfUseId';

  const valueFromData = $derived(getValue<string>(KEY));
  const termsOfUseId = $derived(getValue<number>(TERMS_OF_USE_KEY));

  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onBlur = async () => {
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

{#if termsOfUseId && termsOfUseId !== 1}
  <div class="terms-of-use-source-field">
    <TextInput
      bind:value
      label={fieldConfig?.label || KEY}
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
