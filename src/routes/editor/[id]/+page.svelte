<script>
  import Form from "../../../components/Form/Form.svelte";

  let { data } = $props();
</script>

<div class="metadata">
  <h1>{ data.metadata.title }</h1>
  <h2>{ data.metadata.metadataId}</h2>
  <Form metadata={data.metadata} />
</div>

<style lang="less">
  .metadata {
    text-align: center;
  }
</style>
