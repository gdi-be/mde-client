<script lang="ts">
  import { goto } from "$app/navigation";
  import MetadataCard from "$lib/components/MetadataCard.svelte";
  import MetadataSearchField from "$lib/components/MetadataSearchField.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { Icon } from "@smui/button";
  import Card, { PrimaryAction } from '@smui/card';
  import type { Option } from "$lib/models/form.js";

  let { data } = $props();

  const metadata = $derived(data.metadata.content);
  const pageable = $derived(data.metadata);

  let searchValue = $state<Option>()

  $effect(() => {
    if (searchValue) {
      goto(`/metadata/${searchValue.key}`);
    }
  });

</script>

<div class="metadata-overview">
  <div class="metadata-toolbar">
    <MetadataSearchField bind:value={searchValue}/>
  </div>
  <div class="metadata-list">
    <Card class="create-card">
      <PrimaryAction
        title="Neuerfassung"
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

    .metadata-toolbar {
      :global(.metadata-search-field .mdc-text-field) {
        width: 600px;
      }
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
        min-width: 240px;
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
