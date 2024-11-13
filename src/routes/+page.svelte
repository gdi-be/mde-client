<script>
  import Welcome from "../components/Welcome.svelte";
  let { children } = $props();
</script>

{#if children}
  {@render children()}
{:else}
  <Welcome />
{/if}
