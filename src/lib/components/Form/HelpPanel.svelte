<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import { toast } from 'svelte-french-toast';

  const activeHelpKey = $derived(getFormContext().activeHelpKey);

  const getHelpMarkdown = async (key: string) => {
    const response = await fetch(`/help/${key}`);
    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Hilfe');
      return Promise.reject('Failed to fetch help markdown');
    }
    return response.text();
  };
</script>

<div class="help-section">
  {#if activeHelpKey}
    {#await getHelpMarkdown(activeHelpKey)}
      <p>Loading...</p>
    {:then parsed}
      {@html parsed}
    {:catch}
      <h2>Für dieses Eingabefeld ist keine Hilfe verfügbar.</h2>
    {/await}
  {/if}
</div>

<style lang="scss">
  .help-section {
    flex: 1;
    padding: 0 1rem;
    max-height: 100%;
    overflow-y: auto;

    :global(img.thumbnail) {
      max-width: 100%;
      height: auto;
      padding: 0.5rem;

      &:hover {
        outline: 1px solid var(--primary-color);
      }
    }
  }
</style>
