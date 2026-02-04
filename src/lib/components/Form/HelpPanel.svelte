<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */

  import { getFormContext } from '$lib/context/FormContext.svelte';
  import { toast } from 'svelte-french-toast';
  import { page } from '$app/state';

  const t = $derived(page.data.t);
  const activeHelpKey = $derived(getFormContext().formState?.activeHelpKey);

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
      <p>{t('general.loading')}</p>
    {:then parsed}
      {@html parsed}
    {:catch}
      <h2>{t('helppanel.noHelp')}</h2>
    {/await}
  {/if}
</div>

<style lang="scss">
  .help-section {
    flex: 1;
    padding-right: 2rem;
    max-height: 100%;
    overflow-y: auto;
    word-break: normal;
    overflow-wrap: break-word;

    :global(img) {
      max-width: calc(100% - 2rem);
      height: auto;
      padding: 0.5rem;
    }

    :global(img.thumbnail) {
      &:hover {
        outline: 1px solid var(--primary-color);
      }
    }
  }
</style>
