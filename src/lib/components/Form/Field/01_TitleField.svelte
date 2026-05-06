<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import {
    FORMSTATE_CONTEXT,
    getFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import FieldTools from '../FieldTools.svelte';
  import { page } from '$app/state';
  import { getContext } from 'svelte';
  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.title';

  const formContext = $derived(getFormContext());
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const valueFromData = $derived(formContext.getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(1);
  let validationResult = $derived(fieldConfig?.validator(value));

  $effect(() => {
    if (!formState.metadata?.isoMetadata) {
      return;
    }

    if (formState.metadata.isoMetadata.title === value) {
      return;
    }

    formState.metadata = {
      ...formState.metadata,
      isoMetadata: {
        ...formState.metadata.isoMetadata,
        title: value
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

<div class={['title-field', value.length > 100 ? 'long-text' : '']}>
  <TextInput
    bind:value
    maxlength={250}
    label={t('01_TitleField.label')}
    explanation={t('01_TitleField.explanation')}
    {fieldConfig}
    {validationResult}
    onblur={onBlur}
  />
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }

    &.long-text {
      :global(.text-input .field-footer .character-counter) {
        font-weight: bold;
        color: var(--mdc-theme-error);
      }
    }
  }
</style>
