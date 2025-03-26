<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { DownloadInfo } from '$lib/models/metadata';

  export type ServiceTypeProps = {
    value?: DownloadInfo['href'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();
</script>

<TextInput
  label="Download-URL"
  {value}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
