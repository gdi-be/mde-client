<script lang="ts">
  import { allFieldsValid } from '$lib/context/FormContext.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';
  import type { Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';
  import ApprovalPanel from './ApprovalPanel.svelte';
  import CommentsPanel from './CommentsPanel.svelte';
  import Button, { Icon, Label } from '@smui/button';
  import { getContext, type Snippet } from 'svelte';
  import ValidationPanel from './ValidationPanel.svelte';
  import AssignmentDialog from './AssignmentDialog.svelte';

  type FormFooterProps = {
    metadata?: MetadataCollection;
    text?: string;
    children?: Snippet;
    commentsPanelVisible?: boolean;
    approvalPanelVisible?: boolean;
    assignmentPanelVisible?: boolean;
  };

  let {
    metadata,
    children,
    commentsPanelVisible: commentsPanelVisibleProp,
    approvalPanelVisible: approvalPanelVisibleProp,
    assignmentPanelVisible: assignmentPanelVisibleProp
  }: FormFooterProps = $props();

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const userId = $derived(token?.sub);
  const assignedToMe = $derived(metadata?.assignedUserId === userId);
  let commentsPanelVisible = $state(false);
  let approvalPanelVisible = $state(false);
  let assignmentPanelVisible = $state(false);
  let validationPanelVisible = $state(false);
  let showMask = $derived(
    commentsPanelVisible || approvalPanelVisible || validationPanelVisible || assignmentPanelVisible
  );

  let showPublishButton = $derived(
    highestRole === 'Administrator' ||
    (
      assignedToMe &&
      allFieldsValid(metadata) && highestRole === 'Editor' &&
      metadata?.isoMetadata.valid === true
    )
  );
  let showValidateButton = $derived(
    highestRole === 'Administrator' ||
    (
      allFieldsValid(metadata) && highestRole === 'Editor' &&
      metadata?.isoMetadata.valid === true
    )
  );
  let showAssignmentButton = $derived(
    highestRole === 'Administrator' ||
    assignedToMe ||
    highestRole === metadata?.responsibleRole
  );

  $effect(() => {
    commentsPanelVisible = commentsPanelVisibleProp ?? false;
  });

  $effect(() => {
    approvalPanelVisible = approvalPanelVisibleProp ?? false;
  });

  $effect(() => {
    assignmentPanelVisible = assignmentPanelVisibleProp ?? false;
  });

  const closePanels = () => {
    commentsPanelVisible = false;
    approvalPanelVisible = false;
    validationPanelVisible = false;
    assignmentPanelVisible = false;
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
    {#if showValidateButton}
      <Button
        class="submit-button"
        title="Valdidieren"
        variant="raised"
        onclick={() => (validationPanelVisible = !validationPanelVisible)}
      >
        <Label>Valdidieren</Label>
        <Icon class="material-icons">assignment_turned_in</Icon>
      </Button>
    {/if}
    {#if showAssignmentButton}
      <Button
        class="submit-button"
        title="Zuweisen"
        variant="raised"
        onclick={() => (assignmentPanelVisible = !assignmentPanelVisible)}
      >
        <Label>Zuweisen</Label>
        <Icon class="material-icons">partner_exchange</Icon>
      </Button>
    {/if}
    {#if showPublishButton}
      <Button
        class="submit-button"
        title="Freigabe"
        variant="raised"
        onclick={() => (approvalPanelVisible = !approvalPanelVisible)}
      >
        <Label>Freigabe</Label>
        <Icon class="material-icons">rocket_launch</Icon>
      </Button>
    {/if}
  </div>
</footer>

{#if showMask}
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

{#if validationPanelVisible}
  <ValidationPanel {metadata} />
{/if}

<AssignmentDialog {metadata} bind:open={assignmentPanelVisible}/>

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
      &:disabled {
        cursor: not-allowed;
        background-color: lightgrey;
      }
    }

    .container {
      flex: 1;
      display: flex;
      padding: 0 1em;
      gap: 1em;

      &.left-container {
        justify-content: flex-start;
      }

      &.center-container {
        justify-content: center;
      }

      &.right-container {
        justify-content: flex-end;
      }
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
