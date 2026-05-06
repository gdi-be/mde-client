<script lang="ts">
  import type { ValidationResult } from '../FieldsConfig';
  import FieldTools from '../FieldTools.svelte';
  import {
    FORMSTATE_CONTEXT,
    getFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import TextAreaInput from '../Inputs/TextAreaInput.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import { page } from '$app/state';
  import { getContext } from 'svelte';
  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.description';

  const { getValue } = getFormContext();
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(2);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  $effect(() => {
    if (!formState.metadata?.isoMetadata) {
      return;
    }

    if (formState.metadata.isoMetadata.description === value) {
      return;
    }

    formState.metadata = {
      ...formState.metadata,
      isoMetadata: {
        ...formState.metadata.isoMetadata,
        description: value
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

<div class="description-field">
  <TextAreaInput
    bind:value
    maxlength={500}
    onblur={onBlur}
    label={t('02_DescriptionField.label')}
    explanation={t('02_DescriptionField.explanation')}
    rows={5}
    {fieldConfig}
    {validationResult}
  />
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .description-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-area-input) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
