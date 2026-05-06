<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import {
    FORMSTATE_CONTEXT,
    getFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import FieldTools from '../FieldTools.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import { page } from '$app/state';
  import { getContext } from 'svelte';

  const t = $derived(page.data.t);
  const KEY = 'isoMetadata.preview';

  const { getValue } = getFormContext();
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(29);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  $effect(() => {
    if (!formState.metadata?.isoMetadata) {
      return;
    }

    if (formState.metadata.isoMetadata.preview === value) {
      return;
    }

    formState.metadata = {
      ...formState.metadata,
      isoMetadata: {
        ...formState.metadata.isoMetadata,
        preview: value
      }
    };
  });

  const onBlur = async () => {
    if (validationResult?.valid === false) return;
    const response = await MetadataService.persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="preview-field">
  <TextInput
    bind:value
    label={t('29_PreviewField.label')}
    explanation={t('29_PreviewField.explanation')}
    {fieldConfig}
    onblur={onBlur}
    {validationResult}
  />
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .preview-field {
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
