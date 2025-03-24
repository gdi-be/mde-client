<script lang="ts">
  import { goto } from '$app/navigation';
  import MetadataCard from '$lib/components/Overview/MetadataCard.svelte';
  import type { Option } from '$lib/models/form.js';
  import MetadataToolbar from '$lib/components/Overview/MetadataToolbar.svelte';
  import type { SearchResponse } from '$lib/models/api.js';
  import type { MetadataCollection } from '$lib/models/metadata.js';
  import SearchResultPagination from '$lib/components/Overview/SearchPagination.svelte';

  let { data } = $props();

  const searchResponse = $derived<SearchResponse<MetadataCollection>>(data.searchResponse);
  const metadata = $derived<MetadataCollection[]>(searchResponse.results);
  const totalHitCount = $derived<number>(searchResponse.totalHitCount);

  let searchValue = $state<Option>();

  $effect(() => {
    if (searchValue) {
      goto(`/metadata/${searchValue.key}`);
    }
  });
</script>

<div class="metadata-overview">
  <MetadataToolbar />
  {#if metadata.length === 0}
    <div class="no-data">
      <p>
        Keine Metadaten gefunden. Bitte Filter anpassen.
      </p>
    </div>
  {:else}
    <div class="metadata-list">
      {#each metadata as metadataEntry}
        <MetadataCard metadata={metadataEntry} />
      {/each}
    </div>
    <SearchResultPagination totalHitCount={totalHitCount} />
  {/if}
</div>

<style lang="scss">
  .metadata-overview {
    height: 100%;
    width: min(100%, 1200px);
    justify-self: center;
    display: flex;
    flex-direction: column;
    overflow: hidden;

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
