<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';

  const KEY = 'isoMetadata.contentDescription';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state<string>('');
  $effect(() => {
    if (valueFromData) {
      value = valueFromData;
    }
  });
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(30);
  let validationResult = $derived(fieldConfig?.validator(value));

  const onBlur = async () => {
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="technical-description-field">
  <TextInput
    bind:value
    label={fieldConfig?.label}
    {fieldConfig}
    {validationResult}
    onblur={onBlur}
  />
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .technical-description-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
