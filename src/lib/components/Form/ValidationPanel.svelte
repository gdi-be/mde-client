<script lang="ts">
  import type { MetadataCollection } from '$lib/models/metadata';
  import Paper from '@smui/paper';

  type ValidationPanelProps = {
    metadata?: MetadataCollection;
  };

  let { metadata }: ValidationPanelProps = $props();

</script>

<div class="validation-panel-container">
  <Paper elevation={6} class="validation-panel">
    <div class="validation-panel-content">
      <h2>Validierung {metadata?.isoMetadata?.title}</h2>
      <div>TODO</div>
  </Paper>
</div>

<style lang="scss">
  .validation-panel-container {
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :global(div.smui-paper.validation-panel) {
    background-color: white;
    padding: 0.5em 1em;
  }

  .validation-panel-content {
    display: flex;
    flex-direction: column;
    min-width: 60vw;
    min-height: 60vh;
  }
</style>
