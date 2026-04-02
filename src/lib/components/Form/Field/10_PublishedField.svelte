<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';
  import { MetadataService } from '$lib/services/MetadataService';
  import { page } from '$app/state';

  const t = $derived(page.data.t);
  const KEY = 'isoMetadata.published';

  const { getValue, formState } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $derived(valueFromData ? new Date(valueFromData).toISOString().split('T')[0] : '');

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(10);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;
  const toIsoDate = (inputValue: string) =>
    inputValue ? new Date(inputValue).toISOString() : null;
  let hasUnsavedLocalChange = $state(false);

  $effect(() => {
    if (!hasUnsavedLocalChange) {
      return;
    }
    if (!formState.metadata?.isoMetadata) {
      return;
    }
    const localValue = toIsoDate(value);
    if (formState.metadata.isoMetadata.published === localValue) {
      return;
    }
    formState.metadata = {
      ...formState.metadata,
      isoMetadata: {
        ...formState.metadata.isoMetadata,
        published: localValue
      }
    };
  });

  const onChange = (evt: Event) => {
    const inputValue = (evt.currentTarget as HTMLInputElement | null)?.value ?? '';
    value = inputValue;
    hasUnsavedLocalChange = true;
  };

  const onBlur = async (evt: FocusEvent) => {
    const inputValue = (evt.currentTarget as HTMLInputElement | null)?.value ?? '';
    value = inputValue;
    if (fieldConfig?.required && !inputValue) return;
    if (fieldConfig?.validator(inputValue).valid === false) return;
    const response = await MetadataService.persistValue(KEY, toIsoDate(inputValue));

    if (response.ok) {
      hasUnsavedLocalChange = false;
      showCheckmark = true;
    }
  };
</script>

<div class="published-field">
  <DateInput
    bind:value
    key={KEY}
    label={t('10_PublishedField.label')}
    explanation={t('10_PublishedField.explanation')}
    {fieldConfig}
    onchange={onChange}
    onblur={onBlur}
    {validationResult}
  />
  <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .published-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.date-input) {
      flex: 1;
    }
  }
</style>
