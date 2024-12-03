<script>
  import { page } from "$app/stores";
  import Form from "$lib/components/Form/Form.svelte";

  const activeSection = $page.url.hash.slice(1);

  let { data } = $props();
  const {
    mode,
    config,
    metadata
  } = data;

</script>

<div class="metadata">
  {#if mode === 'create' && config}
    <h1>Create Metadata</h1>
    <Form {config} {activeSection} />
  {:else if data.mode === 'edit' && data.metadata}
    <h1>{ data.metadata.title }</h1>
    <h2>{ data.metadata.metadataId}</h2>
    <Form {metadata} {config} {activeSection} />
  {/if}
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
