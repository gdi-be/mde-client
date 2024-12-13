<script>
  import MetadataCard from "../../lib/components/MetadataCard.svelte";
  import Pagination from "../../lib/components/Pagination.svelte";

  let { data } = $props();

  const metadata = $derived(data.metadata.content);
  const pageable = $derived(data.metadata);

</script>

<div class="metadata-overview">
  <div class="metadata-toolbar">
    <h1>Metadaten</h1>
  </div>
  <div class="metadata-list">
    {#each metadata as metadataEntry}
      <MetadataCard metadata={metadataEntry} />
    {/each}
  </div>
  <div class="pagination">
    <Pagination pagingInfo={pageable} />
  </div>
</div>

<style lang="scss">
  .metadata-overview {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .metadata-toolbar,
    .pagination {
      flex: 0 0 auto;
    }

    .metadata-list {
      flex: 1;
      padding: 1em;
      display: inline-grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1em;
      overflow-y: auto;
    }
  }

</style>
