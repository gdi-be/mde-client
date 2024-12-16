<script lang="ts">
  import { goto } from "$app/navigation";
  import MetadataCard from "../../lib/components/MetadataCard.svelte";
  import Pagination from "../../lib/components/Pagination.svelte";
  import { Icon } from "@smui/button";
  import Card, { PrimaryAction } from '@smui/card';

  let { data } = $props();

  const metadata = $derived(data.metadata.content);
  const pageable = $derived(data.metadata);

</script>

<div class="metadata-overview">
  <div class="metadata-toolbar">
    <h1>Metadaten</h1>
  </div>
  <div class="metadata-list">
    <Card class="create-card">
      <PrimaryAction
        class="create-card-content"
        onclick={() => goto('/metadata/create')}
      >
        <Icon class="material-icons">add</Icon>
      </PrimaryAction>
    </Card>
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

      :global(.create-card) {
        height: 288px;
        position: relative;
      }

      :global(.create-card .create-card-content) {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
      }
    }
  }
</style>
