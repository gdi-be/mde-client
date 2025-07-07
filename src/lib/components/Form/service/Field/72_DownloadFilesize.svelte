<script lang="ts">
  import NumberInput from '$lib/components/Form/Inputs/NumberInput.svelte';
  import type { DownloadInfo } from '$lib/models/metadata';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  export type ComponentProps = {
    value?: DownloadInfo['fileSize'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ComponentProps = $props();

  const HELP_KEY = 'isoMetadata.services.downloads.fileSize';
  const fieldConfig = getFieldConfig(72);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));
</script>

{#if fieldVisible}
  <div class="download-file-size-field">
    <NumberInput
      label={fieldConfig?.label || 'Download-Titel'}
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
    <FieldTools noCopyButton key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .download-file-size-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.number-input) {
      flex: 1;
    }
  }
</style>
