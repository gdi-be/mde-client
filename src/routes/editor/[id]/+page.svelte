<script>
  let { data } = $props();
</script>

<div class="metadata">
  <h1>{ data.metadata.title }</h1>
  <h2>{ data.metadata.metadataId}</h2>
</div>

<style lang="less">
  .metadata {
    text-align: center;
  }
</style>
