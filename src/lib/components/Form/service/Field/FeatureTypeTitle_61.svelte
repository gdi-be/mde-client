<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { FeatureType } from '$lib/models/metadata';

  export type ServiceTypeProps = {
    value?: FeatureType['title'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();
</script>

<TextInput
  label="FeaturType-Title"
  {value}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
