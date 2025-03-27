<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { DownloadInfo } from '$lib/models/metadata';

  export type ServiceTypeProps = {
    value?: DownloadInfo['title'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();
</script>

<TextInput
  label="Download-Titel"
  {value}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
