<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { DownloadInfo } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';

  export type ComponentProps = {
    value?: DownloadInfo['title'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ComponentProps = $props();

  const fieldConfig = getFieldConfig(69);
  const validationResult = $derived(fieldConfig?.validator(value));
</script>

<div class="download-title-field">
  <TextInput
    label={fieldConfig?.label || 'Download-Titel'}
    {value}
    {fieldConfig}
    {validationResult}
    onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
  />
</div>

<style lang="scss">
  .download-title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-input) {
      flex: 1;
    }
  }
</style>
