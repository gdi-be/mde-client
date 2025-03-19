<script lang="ts">
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
  <button
    class="print-button"
    onclick={onPrintClick}
  >
    Drucken
  </button>
  <h1>{metadata?.isoMetadata?.title}</h1>
  <MetadataDisplay {metadata} />
</div>

<style lang="scss">
  @media print {
    :global(html, body, main) {
      overflow: visible !important;
    }

    :global(header.application-header) {
      display: none !important;
    }
    button.print-button {
      display: none;
    }
  }

  @page {
    size: A4;
    margin: 20mm;
  }

  .readonly-metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
