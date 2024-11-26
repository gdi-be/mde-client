<script>
  import Form from "../../../components/Form/Form.svelte";

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
    <Form {config} />
  {:else if data.mode === 'edit' && data.metadata}
    <h1>{ data.metadata.title }</h1>
    <h2>{ data.metadata.metadataId}</h2>
    <Form {metadata} {config} />
  {/if}
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
