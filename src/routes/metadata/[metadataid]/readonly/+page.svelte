<script lang="ts">
  import Fab, { Icon } from '@smui/fab';
  import { browser } from '$app/environment';
  import MetadataDisplay from '$lib/components/ReadOnly/MetadataDisplay.svelte';
  import { page } from '$app/state';
  import FormFooter from '$lib/components/Form/FormFooter.svelte';
  import {
    FORMSTATE_CONTEXT,
    initializeFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';

  const { data } = $props();
  let commentsPanelVisible = $state(false);
  let publishPanelVisible = $state(false);
  let assignmentPanelVisible = $state(false);

  const metadata = $derived(data.metadata);
  initializeFormContext(data.metadata, data.fieldLabels);

  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  $effect(() => {
    formState.metadata = data.metadata;
  });

  const print = () => {
    if (browser) {
      window.print();
    }
  };

  $effect(() => {
    const action = page.url.searchParams.get('action');

    if (action?.includes('print')) {
      print();
    }

    if (action?.includes('comments')) {
      commentsPanelVisible = true;
    }

    if (action?.includes('publish')) {
      publishPanelVisible = true;
    }

    if (action?.includes('assignment')) {
      assignmentPanelVisible = true;
    }
  });
</script>

<div class="readonly-metadata">
  <Fab title="Drucken" class="print-button" onclick={print}>
    <Icon class="material-icons">print</Icon>
  </Fab>
  <h1>{metadata?.isoMetadata?.title}</h1>
  <MetadataDisplay />
  <FormFooter {commentsPanelVisible} {publishPanelVisible} {assignmentPanelVisible} />
</div>

<style lang="scss">
  .readonly-metadata {
    display: flex;
    flex-direction: column;

    h1 {
      text-align: center;
    }

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

    :global(header.application-header),
    :global(footer.form-footer),
    :global(.print-button) {
      display: none !important;
    }

    :global(.metadata-display) {
      overflow: visible !important;
    }

    :global(.metadata-display .content) {
      width: 100% !important;
      overflow: visible !important;
    }
  }

  @page {
    size: A4;
    margin: 20mm;
  }
</style>
