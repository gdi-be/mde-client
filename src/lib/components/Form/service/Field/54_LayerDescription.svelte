<script lang="ts">
  import TextAreaInput from '$lib/components/Form/Inputs/TextAreaInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import type { ValidationResult } from '$lib/components/Form/FieldsConfig';

  export type ComponentProps = {
    value?: Layer['shortDescription'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getFieldConfig(54);
  let validationResult = $derived(fieldConfig?.validator([], { value })) as ValidationResult;
</script>

<div class="layer-short-description-field">
  <TextAreaInput
    label={fieldConfig?.label || 'Kurzbeschreibung'}
    {value}
    maxlength={500}
    {fieldConfig}
    {validationResult}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
</div>

<style lang="scss">
  .layer-short-description-field {
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
