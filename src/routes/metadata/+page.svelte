<script lang="ts">
  import { goto } from '$app/navigation';
  import MetadataCard from '$lib/components/Overview/MetadataCard.svelte';
  import Pagination from '$lib/components/Overview/Pagination.svelte';
  import type { Option } from '$lib/models/form.js';
  import MetadataToolbar from '$lib/components/Overview/MetadataToolbar.svelte';
  import type { PageableResponse } from '$lib/models/api.js';
  import type { MetadataCollection } from '$lib/models/metadata.js';

  let { data } = $props();

  // TODO: fix the handling of searching/filtering data in the backend maybe we can merge this into one smart and fast
  // function
  const isPageable = $derived(!Array.isArray(data.metadata));
  const metadata = $derived(Array.isArray(data.metadata) ? data.metadata : data.metadata.content);
  const pageable = $derived(data.metadata);

  let searchValue = $state<Option>();

  $effect(() => {
    if (searchValue) {
      goto(`/metadata/${searchValue.key}`);
    }
  });
</script>

<div class="metadata-overview">
  <MetadataToolbar />
  <div class="metadata-list">
    {#each metadata as metadataEntry}
      <MetadataCard metadata={metadataEntry} />
    {/each}
  </div>
  {#if isPageable}
    <Pagination pagingInfo={pageable as PageableResponse<MetadataCollection>} />
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

    .metadata-list {
      flex: 1;
      padding: 1em;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      justify-content: space-evenly;
      gap: 1em;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
