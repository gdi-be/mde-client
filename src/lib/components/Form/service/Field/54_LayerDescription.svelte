<script lang="ts">
  import TextAreaInput from '$lib/components/Form/Inputs/TextAreaInput.svelte';
  import type { Layer } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: Layer['shortDescription'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'clientMetadata.layers.shortDescription';
  let showCheckmark = $state(false);

  const fieldConfig = getFieldConfig(54);
  const validationResult = $derived(fieldConfig?.validator(value));
</script>

<div class="layer-short-description-field">
  <TextAreaInput
    label={t('54_LayerDescription.label')}
    explanation={t('54_LayerDescription.explanation')}
    {value}
    maxlength={500}
    {fieldConfig}
    {validationResult}
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
