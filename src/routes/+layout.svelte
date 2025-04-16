<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { onMount, setContext } from 'svelte';
  import PopConfirm from '$lib/components/Popconfirm.svelte';
  import { initializePopconfimContext } from '$lib/context/PopConfirmContex.svelte.js';
  import { sseContext } from '$lib/context/ServerEventContext.svelte.js';
  import ValidationPopup from '$lib/components/ValidationPopup.svelte';
  let { children, data } = $props();

  setContext('user_token', data.token);
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
  <title>GDI Berlin - Metadateneditor</title>
</svelte:head>

<PopConfirm />
<ValidationPopup />

<div class="main-container">
  <Header />
  <main>
    {#if children}
      {@render children()}
    {:else}
      <p>fallback content</p>
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
