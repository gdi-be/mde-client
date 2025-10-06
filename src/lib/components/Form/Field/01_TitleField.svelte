<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';

  const KEY = 'isoMetadata.title';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(1);
  let validationResult = $derived(fieldConfig?.validator(value));

  const onBlur = async () => {
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class={['title-field', value.length > 100 ? 'long-text' : '']}>
  <TextInput
    bind:value
    maxlength={250}
    label={fieldConfig?.label || KEY}
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
