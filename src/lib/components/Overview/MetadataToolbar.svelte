<script lang="ts">
  import Button, { Label } from '@smui/button';
  import StatusFilterField from './StatusFilterField.svelte';
  import TextFilterField from './TextFilterField.svelte';
  import { goto } from '$app/navigation';
  import { getHighestRole } from '$lib/util';
  import { getContext } from 'svelte';
  import type { Token } from '$lib/models/keycloak';

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
</script>

<div class="toolbar-inner">
  {#if highestRole !== 'MdeQualityAssurance'}
    <Button variant="raised" onclick={() => goto('/metadata/create')}>
      <Label>Neuerfassung</Label>
    </Button>
  {/if}
  <div class="search-container">
    <TextFilterField />
  </div>
  <div class="tagfield-container">
    <StatusFilterField />
  </div>
</div>

<style>
  .toolbar-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #f8f9fa;
    margin: 1rem;
    border: 1px solid #e9ecef;
    border-radius: var(--mdc-shape-medium, 4px);
    gap: 2rem;

    .search-container {
      flex: 1;
    }

    .tagfield-container {
      flex: 2;
    }

    :global(.text-filter-field),
    :global(.status-filter-field) {
      width: 100%;
    }
  }
</style>
