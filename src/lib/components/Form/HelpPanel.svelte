<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { getFormContext } from "./FormContext.svelte";
  const activeHelpKey = $derived(getFormContext().activeHelpKey);

  const getHelpMarkdown = async (key: string) => {
    const response = await fetch(`/help/${key}`);
    if (!response.ok) {
      throw new Error("Failed to fetch help text");
    }
    return response.text();
  };

</script>

<div class="help-section">
  {#if activeHelpKey}
    {#await getHelpMarkdown(activeHelpKey)}
      <p>Loading...</p>
    {:then parsed}
      {@html parsed}
    {:catch}
      <h2>Für dieses Eingabefeld ist keine Hilfe verfügbar.</h2>
    {/await}
  {/if}
</div>

<style lang="scss">
  .help-section {
    overflow: auto;
    flex: 1;
    padding: 0 3rem;
  }
</style>
