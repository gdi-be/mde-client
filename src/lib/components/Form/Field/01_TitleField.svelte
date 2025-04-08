<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import type { ValidationResult } from '../FieldsConfig';

  const KEY = 'isoMetadata.title';

  const valueFromData = $derived(getValue<string>(KEY));
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

<div class="title-field">
  <TextInput
    bind:value
    key={KEY}
    label={fieldConfig?.label}
    onblur={onBlur}
    {validationResult}
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
  }
</style>
