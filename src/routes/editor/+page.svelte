<script>
  let { data } = $props();
</script>

<div class="metadata-list">
  {#each data.metadata as metadata}
      <a href="/editor/{metadata.id}">
        {metadata.title}
      </a>
  {/each}
</div>

<style lang="less">
  .metadata-list {
    padding: 1em 0;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>
