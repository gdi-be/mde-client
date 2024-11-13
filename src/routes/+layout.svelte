<script lang="ts">
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  let { children, data } = $props();

  console.log({data});

</script>

<ParaglideJS {i18n}>
  <div class="container">
    <Header />
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
