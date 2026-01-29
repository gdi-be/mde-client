<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { ColumnInfo } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  export type ComponentProps = {
    value?: ColumnInfo['name'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.featureTypes.columns.name';
  const fieldConfig = getFieldConfig(64);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);
</script>

<div class="attribute-name-field">
  <TextInput
    label={t('64_AttributeName.label')}
    {value}
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
  .attribute-name-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
