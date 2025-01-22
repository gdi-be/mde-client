<script>
  import Welcome from '$lib/components/Welcome.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let { children } = $props();

  $effect(() => {
    const reload = $page.url.searchParams.get('reload');
    if (reload === 'force') {
      goto('/', {
        replaceState: true,
        noScroll: true,
        invalidateAll: true
      })
    }
  });

</script>

{#if children}
  {@render children()}
{:else}
  <Welcome/>
{/if}
