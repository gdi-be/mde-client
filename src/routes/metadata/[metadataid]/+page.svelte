<script lang="ts">
  import { page } from '$app/state';
  import Form from '$lib/components/Form/Form.svelte';
  import { setFormData } from '$lib/context/FormContext.svelte';

  const activeSection = page.url.hash.slice(1) || 'basedata';

  let { data } = $props();
  const metadata = $derived(data.metadata);

  $effect(() => {
    setFormData(metadata);
  });
</script>

<div class="metadata">
  <h1>{metadata.isoMetadata.title}</h1>
  <Form {metadata} {activeSection} />
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
