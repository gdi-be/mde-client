<script>
  let { data } = $props();

  const metadata = $derived(data.metadata.content);
</script>

<div class="metadata-list">
  {#each metadata as metadataEntry}
    <a href="/editor/{metadataEntry.metadataId}">
      {metadataEntry.title}
    </a>
  {/each}
</div>

<style lang="scss">
  .metadata-list {
    padding: 1em 0;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>
