<script lang="ts">
  import type { ValidationResult } from "../FieldsConfig";
  import FieldTools from "../FieldTools.svelte";
  import { getFieldConfig, getValue, persistValue } from "$lib/context/FormContext.svelte";;
  import TextAreaInput from "../Inputs/TextAreaInput.svelte";

  const KEY = 'isoMetadata.description';

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

<div class="description-field">
  <TextAreaInput
    bind:value
    key={KEY}
    label={fieldConfig?.label}
    maxlength={500}
    onblur={onBlur}
    {validationResult}
  />
  <FieldTools
    key={KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
  />
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
