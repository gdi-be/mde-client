<script lang="ts">
  import MetadataCard from '$lib/components/Overview/MetadataCard.svelte';
  import MetadataToolbar from '$lib/components/Overview/MetadataToolbar.svelte';
  import Pagination from '$lib/components/Overview/Pagination.svelte';
  import { setRefreshToken } from '$lib/context/TokenContext.svelte.js';

  let { data } = $props();

  const metadata = $derived(data.queryResponse.content);
  const pageable = $derived(data.queryResponse);

  const refreshToken = $derived(data.refreshToken);
  $effect(() => {
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
  });
</script>

<div class="metadata-overview">
  <MetadataToolbar />
  {#if metadata.length === 0}
    <div class="no-data">
      <p>Keine Metadaten gefunden. Bitte Filter anpassen.</p>
    </div>
  {:else}
    <div class="metadata-list">
      {#each metadata as metadataEntry (metadataEntry.id)}
        <MetadataCard metadata={metadataEntry} />
      {/each}
    </div>
    <Pagination pagingInfo={pageable} />
  {/if}
</div>

<style lang="scss">
  .metadata-overview {
    width: min(100%, 1200px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: auto;

    .no-data {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .metadata-list {
      flex: 1;
      padding: 1em;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1em;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
