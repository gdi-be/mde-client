<script lang="ts">
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  let { children, data } = $props();

</script>

<svelte:head>
  <title>GDI Berlin - Metadateneditor</title>
</svelte:head>

<ParaglideJS {i18n}>
  <div class="container">
    <Header token={data.token}/>
    <main>
      {#if children}
        {@render children()}
      {:else}
        <p>fallback content</p>
      {/if}
    </main>
    <Footer />
  </div>
</ParaglideJS>

<style lang="scss">
  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }

  :global(a) {
    color: #007bff;
    text-decoration: none;
  }

  .container {
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
    }
  }
</style>
