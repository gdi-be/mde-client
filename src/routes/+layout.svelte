<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { onMount } from 'svelte';
  import PopConfirm from '$lib/components/Popconfirm.svelte';
  import { initializePopconfimContext } from '$lib/context/PopConfirmContext.svelte.js';
  import { sseContext } from '$lib/context/ServerEventContext.svelte.js';
  import ValidationPopup from '$lib/components/ValidationPopup.svelte';
  import { Toaster } from 'svelte-french-toast';
  import { initializeTokenContext } from '../lib/context/TokenContext.svelte.js';
  import { page } from '$app/state';

  const t = $derived(page.data.t);
  let { children, data } = $props();

  initializeTokenContext(data.token, data.refreshToken);
  initializePopconfimContext();

  sseContext.setSseContext();

  onMount(() => {
    sseContext.connect('/api/events/subscribe', data.tokenUnparsed);
    sseContext.listenTo('validation');

    return () => {
      sseContext.disconnect();
    };
  });
</script>

<svelte:head>
  <title>{t('general.htmlTitle')}</title>
</svelte:head>

<PopConfirm />
<ValidationPopup />
<Toaster />

<div class="main-container">
  <Header />
  <main>
    {#if children}
      {@render children()}
    {:else}
      <p>{t('layout.fallback')}</p>
    {/if}
  </main>
</div>

<style lang="scss">
  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }

  :global(a) {
    color: #007bff;
    text-decoration: none;
  }

  .main-container {
    height: 100dvh;
    max-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    :global(header),
    :global(footer) {
      flex: 0 0 auto;
    }

    main {
      flex: 1;
      overflow: auto;
      position: relative;

      :global(> *) {
        max-height: 100%;
        height: 100%;
      }
    }
  }
</style>
