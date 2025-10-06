<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';

  export type ComponentProps = {
    value?: Layer['title'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'clientMetadata.layers.title';
  const fieldConfig = getFieldConfig(49);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);
</script>

<div class="layer-title-field">
  <TextInput
    label={fieldConfig?.label}
    {value}
    {fieldConfig}
    {validationResult}
    maxlength={250}
    onchange={async (e: Event) => {
      const response = await onChange((e.target as HTMLInputElement).value);
      if (response.ok) {
        showCheckmark = true;
      }
    }}
  />
  <FieldTools {value} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .layer-title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
