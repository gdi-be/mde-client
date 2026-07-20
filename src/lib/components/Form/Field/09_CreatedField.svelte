<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import { page } from '$app/state';
  import { MetadataService } from '$lib/services/MetadataService';
  import type { ValidationResult } from '../FieldsConfig';

  const t = $derived(page.data.t);
  const KEY = 'isoMetadata.created';

  const { getValue, formState } = getFormContext();
  const valueFromData = $derived(getValue<string>(KEY));
  let value = $derived(valueFromData ? new Date(valueFromData).toISOString().split('T')[0] : '');

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<string>(9);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = (evt: Event) => {
    const inputValue = (evt.currentTarget as HTMLInputElement | null)?.value ?? '';
    value = inputValue;
    if (formState.metadata?.isoMetadata) {
      formState.metadata = {
        ...formState.metadata,
        isoMetadata: {
          ...formState.metadata.isoMetadata,
          created: inputValue ? new Date(inputValue).toISOString() : null
        }
      };
    }
  };

  const onBlur = async (evt: FocusEvent) => {
    const inputValue = (evt.currentTarget as HTMLInputElement | null)?.value ?? '';
    value = inputValue;
    if (formState.metadata?.isoMetadata) {
      formState.metadata = {
        ...formState.metadata,
        isoMetadata: {
          ...formState.metadata.isoMetadata,
          created: inputValue ? new Date(inputValue).toISOString() : null
        }
      };
    }
    if (fieldConfig?.validator(inputValue).valid === false) return;
    const response = await MetadataService.persistValue(
      KEY,
      inputValue ? new Date(inputValue).toISOString() : null
    );
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="date-time-field">
  <DateInput
    bind:value
    key={KEY}
    label={t('09_CreatedField.label')}
    explanation={t('09_CreatedField.explanation')}
    {fieldConfig}
    onchange={onChange}
    onblur={onBlur}
    {validationResult}
  />
  <FieldTools {fieldConfig} key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .date-time-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.date-input) {
      flex: 1;
    }
  }
</style>
