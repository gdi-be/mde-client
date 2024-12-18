<script>
  import { page } from "$app/stores";
  import Form from "$lib/components/Form/Form.svelte";

  const activeSection = $page.url.hash.slice(1);

  let { data } = $props();
  const {
    config,
    metadata
  } = data;
</script>

<div class="metadata">
  <h1>{ metadata.isoMetadata.title }</h1>
  <Form {metadata} {config} {activeSection} />
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
