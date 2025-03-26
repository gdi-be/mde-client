<script lang="ts">
  import type { DownloadInfo } from '$lib/models/metadata';
  import NumberInput from '../../Inputs/NumberInput.svelte';

  export type ServiceTypeProps = {
    value?: DownloadInfo['fileSize'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();
</script>

<NumberInput
  label="Download-Dateiegröße"
  {value}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
