<script lang="ts">
  import { allFieldsValid } from '$lib/context/FormContext.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';
  import ApprovalPanel from './ApprovalPanel.svelte';
  import CommentsPanel from './CommentsPanel.svelte';
  import Button, { Icon, Label } from '@smui/button';
  import type { Snippet } from 'svelte';

  type FormFooterProps = {
    metadata?: MetadataCollection;
    text?: string;
    children?: Snippet;
    commentsPanelVisible?: boolean;
    approvalPanelVisible?: boolean;
  };

  let {
    metadata,
    children,
    commentsPanelVisible: commentsPanelVisibleProp,
    approvalPanelVisible: approvalPanelVisibleProp,
  }: FormFooterProps = $props();

  let commentsPanelVisible = $state(false);
  let approvalPanelVisible = $state(false);
  let submitEnabled = $derived(allFieldsValid(metadata));

  $effect(() => {
    commentsPanelVisible = commentsPanelVisibleProp ?? false;
  });

  $effect(() => {
    approvalPanelVisible = approvalPanelVisibleProp ?? false;
  });

  const closePanels = (event: MouseEvent | KeyboardEvent) => {
    if (event.target instanceof Element && !event.target.closest('.comments-panel')) {
      commentsPanelVisible = false;
    }
    if (event.target instanceof Element && !event.target.closest('.approval-panel')) {
      approvalPanelVisible = false;
    }
  };
</script>

<footer class="form-footer">
  <div class="container left-container">
    {#if metadata}
      <Button
        variant="raised"
        class="comments-panel-toggle-button"
        onclick={() => (commentsPanelVisible = true)}
      >
        <Icon class="material-icons">chat</Icon>
        <Label>Kommentare</Label>
      </Button>
    {/if}
  </div>
  <div class="container center-container">
    {@render children?.()}
  </div>
  <div class="container right-container">
    <Button
      class="submit-button"
      title={submitEnabled ? 'Speichern' : 'Es sind noch nicht alle Felder korrekt ausgefüllt'}
      disabled={true}
    >
      <Icon class="material-icons">verified</Icon>
      <Label>Freigabe</Label>
    </Button>
  </div>
</footer>

{#if commentsPanelVisible || approvalPanelVisible}
  <div
    class="mask"
    onclick={closePanels}
    onkeydown={closePanels}
    role="button"
    tabindex="0"
  ></div>
{/if}

{#if commentsPanelVisible}
  <CommentsPanel {metadata} />
{/if}

{#if approvalPanelVisible}
  <ApprovalPanel {metadata} />
{/if}

<style lang="scss">
  footer.form-footer {
    background-color: #f8f9fa;
    height: 4em;
    text-align: center;
    border-bottom: 1px solid #dee2e6;

    display: flex;
    align-items: center;
    justify-content: space-between;

    :global(.submit-button) {
      background-color: #0f913b;

      &:disabled {
        cursor: not-allowed;
        background-color: lightgrey;
      }
    }

    .container {
      display: flex;
      padding: 0 1em;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
    z-index: 1;
  }
</style>
