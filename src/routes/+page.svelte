<script>
  import Welcome from '../components/Welcome.svelte';

  let { children, data } = $props();
</script>

{#if children}
  {@render children()}
{:else}
  <Welcome token={data.token}/>
{/if}
