<script lang="ts">
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
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

<style lang="less">
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
    width: 100dvw;
    display: flex;
    flex-direction: column;
    align-items: center;

    main {
      flex: 1;
    }
  }
</style>
