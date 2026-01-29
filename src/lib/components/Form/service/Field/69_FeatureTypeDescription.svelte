<script lang="ts">
  import TextAreaInput from '$lib/components/Form/Inputs/TextAreaInput.svelte';
  import type { FeatureType } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: FeatureType['shortDescription'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.featureTypes.shortDescription';
  let showCheckmark = $state(false);

  const fieldConfig = getFieldConfig(69);
  const validationResult = $derived(fieldConfig?.validator(value));
</script>

<div class="featuretype-short-description-field">
  <TextAreaInput
    label={t('69_FeatureTypeDescription.label')}
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
  .featuretype-short-description-field {
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
