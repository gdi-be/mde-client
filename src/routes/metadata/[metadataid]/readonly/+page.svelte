<script lang="ts">
  import Fab, { Icon } from '@smui/fab';
  import { browser } from '$app/environment';
  import MetadataDisplay from '$lib/components/ReadOnly/MetadataDisplay.svelte';

  const { data } = $props();

  const metadata = $derived(data.metadata);

  const onPrintClick = () => {
    if (browser) {
      window.print();
    }
  };

</script>

<div class="readonly-metadata">
  <Fab
    title="Drucken"
    class="print-button"
    onclick={onPrintClick}
  >
    <Icon class="material-icons">
      print
    </Icon>
  </Fab>
  <h1>{metadata?.isoMetadata?.title}</h1>
  <MetadataDisplay {metadata} />
</div>

<style lang="scss">
  .readonly-metadata {
    display: flex;
    flex-direction: column;
    align-items: center;

    :global(.print-button) {
      position: fixed;
      top: 5em;
      left: 1.5em;
      background-color: var(--primary-color);
    }
  }

  @media print {
    :global(html, body, main) {
      overflow: visible !important;
    }

    :global(header.application-header) {
      display: none !important;
    }
    :global(.print-button) {
      display: none;
    }
  }

  @page {
    size: A4;
    margin: 20mm;
  }
</style>
