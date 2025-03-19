<script lang="ts">
  import type { MetadataCollection } from '$lib/models/metadata';
  import Paper from '@smui/paper';

  type ApprovalPanelProps = {
    metadata?: MetadataCollection;
  };

  let { metadata }: ApprovalPanelProps = $props();

</script>

<div class="approval-panel-container">
  <Paper elevation={6} class="approval-panel">
    <div class="approval-panel-content">
      <h2>Freigabe {metadata?.isoMetadata?.title}</h2>
      <div>TODO</div>
  </Paper>
</div>

<style lang="scss">
  .approval-panel-container {
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :global(div.smui-paper.approval-panel) {
    background-color: white;
    padding: 0.5em 1em;
  }

  .approval-panel-content {
    display: flex;
    flex-direction: column;
    min-width: 60vw;
    min-height: 60vh;
  }
</style>
