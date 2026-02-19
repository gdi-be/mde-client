<script>
  import Welcome from '$lib/components/Welcome.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  let { children } = $props();

  $effect(() => {
    const reload = page.url.searchParams.get('reload');
    if (reload === 'force') {
      goto(resolve('/'), {
        replaceState: true,
        noScroll: true,
        invalidateAll: true
      });
    }
  });
</script>

{#if children}
  {@render children()}
{:else}
  <Welcome />
{/if}
