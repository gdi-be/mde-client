<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { ColumnInfo } from '$lib/models/metadata';
  import { MetadataService } from '$lib/services/MetadataService';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: ColumnInfo['alias'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();
  let localValue = $state(value || '');
  $effect(() => {
    localValue = value || '';
  });

  const HELP_KEY = 'isoMetadata.services.featureTypes.columns.alias';
  const fieldConfig = MetadataService.getFieldConfig(65);
  const validationResult = $derived(fieldConfig?.validator(localValue));
  let showCheckmark = $state(false);
</script>

<div class="attribute-alias-field">
  <TextInput
    label={t('65_AttributeAlias.label')}
    explanation={t('65_AttributeAlias.explanation')}
    value={localValue}
    {fieldConfig}
    {validationResult}
    onchange={async (e: Event) => {
      const newValue = (e.target as HTMLInputElement).value;
      localValue = newValue;
      if (fieldConfig?.validator(newValue).valid === false) return;
      const response = await onChange(newValue);
      if (response.ok) {
        showCheckmark = true;
      }
    }}
  />
  <FieldTools {value} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .attribute-alias-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
