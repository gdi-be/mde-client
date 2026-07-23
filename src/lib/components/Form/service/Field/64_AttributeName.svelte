<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { ColumnInfo } from '$lib/models/metadata';
  import { MetadataService } from '$lib/services/MetadataService';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: ColumnInfo['name'];
    onChange: (newValue: string, persist?: boolean) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();
  let localValue = $derived(value || '');

  const HELP_KEY = 'isoMetadata.services.featureTypes.columns.name';
  const fieldConfig = MetadataService.getFieldConfig(64);
  const validationResult = $derived(fieldConfig?.validator(localValue));
  let showCheckmark = $state(false);
</script>

<div class="attribute-name-field">
  <TextInput
    label={t('64_AttributeName.label')}
    explanation={t('64_AttributeName.explanation')}
    value={localValue}
    maxlength={100}
    {fieldConfig}
    {validationResult}
    onchange={(e: Event) => {
      const newValue = (e.target as HTMLInputElement).value;
      localValue = newValue;
      void onChange(newValue, false);
    }}
    onblur={async (e: Event) => {
      const newValue = (e.target as HTMLInputElement).value;
      const response = await onChange(newValue);
      if (response.ok) {
        showCheckmark = true;
      }
    }}
  />
  <FieldTools {value} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .attribute-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
