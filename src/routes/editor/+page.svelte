<script>
  import MetadataCard from "../../lib/components/MetadataCard.svelte";
  import Pagination from "../../lib/components/Pagination.svelte";

  let { data } = $props();

  const metadata = $derived(data.metadata.content);
  const pageable = $derived(data.metadata);

</script>

<div>
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
  .metadata-list {
    padding: 1em 0;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  }
</style>
