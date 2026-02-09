<script lang="ts">
  import { sseContext } from '$lib/context/ServerEventContext.svelte';
  import {
    allFieldsValid,
    FORMSTATE_CONTEXT,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { getHighestRole } from '$lib/util';
  import CommentsPanel from './CommentsPanel.svelte';
  import Button, { Icon, Label } from '@smui/button';
  import { getContext, type Snippet } from 'svelte';
  import ValidationDialog from './ValidationDialog.svelte';
  import AssignmentDialog from '$lib/components/AssignmentDialog.svelte';
  import { page } from '$app/state';
  import Spinner from '$lib/components/Spinner.svelte';
  import PublishDialog from '$lib/components/Form/PublishDialog.svelte';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  type FormFooterProps = {
    text?: string;
    children?: Snippet;
    commentsPanelVisible?: boolean;
    publishPanelVisible?: boolean;
    assignmentPanelVisible?: boolean;
  };

  const t = $derived(page.data.t);
  let {
    children,
    commentsPanelVisible: commentsPanelVisibleProp,
    publishPanelVisible: publishPanelVisibleProp,
    assignmentPanelVisible: assignmentPanelVisibleProp
  }: FormFooterProps = $props();

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const userId = $derived(token?.sub);
  const assignedToMe = $derived(userId && metadata?.assignedUserId === userId);
  let commentsPanelVisible = $state(false);
  let publishPanelVisible = $state(false);
  let assignmentPanelVisible = $state(false);
  let validationPanelVisible = $state(false);
  let isValidationLoading = $state(false);
  let showMask = $derived(
    commentsPanelVisible || publishPanelVisible || validationPanelVisible || assignmentPanelVisible
  );
  const metadataId = $derived(metadata?.metadataId);
  const { validation } = $derived(sseContext.getSseContext());

  let showPublishButton = $derived(
    highestRole === 'MdeAdministrator' ||
      (assignedToMe &&
        metadata &&
        allFieldsValid(highestRole, metadata) &&
        highestRole === 'MdeEditor' &&
        metadata?.approved === true)
  );
  let showAssignmentButton = $derived(
    highestRole === 'MdeAdministrator' || assignedToMe || highestRole === metadata?.responsibleRole
  );
  let hideDownloadButton = $derived(highestRole === 'MdeDataOwner');

  $effect(() => {
    commentsPanelVisible = commentsPanelVisibleProp ?? false;
  });

  $effect(() => {
    publishPanelVisible = publishPanelVisibleProp ?? false;
  });

  $effect(() => {
    assignmentPanelVisible = assignmentPanelVisibleProp ?? false;
  });

  $effect(() => {
    const lastItem = validation
      ?.filter((validation) => validation.metadataId === metadataId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .at(-1);

    isValidationLoading = lastItem?.status === 'RUNNING' || false;
  });

  const closePanels = () => {
    commentsPanelVisible = false;
    publishPanelVisible = false;
    validationPanelVisible = false;
    assignmentPanelVisible = false;
  };

  const onDownloadClick = async () => {
    const metadataId = metadata?.metadataId;
    const url = `${page.url.origin}/metadata/${metadataId}/download`;

    // timeout for 3 seconds to conflicts with blur-event-saving
    // and to ensure that the latest changes are included in the download
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      toast.error('Fehler beim Herunterladen der Metadaten. Bitte versuchen Sie es später erneut.');
      return Promise.reject('Failed to download metadata');
    }

    let label = `${metadata?.isoMetadata.title || metadata}`;
    label = label
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/\s+/g, '_');
    const date = new Date().toISOString().split('T')[0];
    const fileName = `${label}_${date}`;

    // response is a zip file blob that will be downloaded
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${fileName}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };
</script>

<footer class="form-footer">
  <div class="container left-container">
    {#if metadata}
      <Button
        variant="raised"
        class="comments-panel-toggle-button"
        onclick={() => (commentsPanelVisible = true)}
        type="button"
      >
        <Icon class="material-icons">chat</Icon>
        <Label>{t('formfooter.comments')}</Label>
      </Button>
    {/if}
  </div>
  <div class="container center-container">
    {@render children?.()}
  </div>
  <div class="container right-container">
    {#if !hideDownloadButton}
      <Button
        class="submit-button"
        title={t('formfooter.download')}
        variant="raised"
        onclick={onDownloadClick}
        type="button"
      >
        <Label>{t('formfooter.download')}</Label>
        <Icon class="material-icons">download</Icon>
      </Button>
    {/if}
    <Button
      class="submit-button"
      title={t('formfooter.validate')}
      variant="raised"
      type="button"
      onclick={() => (validationPanelVisible = !validationPanelVisible)}
    >
      <Label>{t('formfooter.validate')}</Label>
      <Icon class="material-icons">assignment_turned_in</Icon>
      {#if isValidationLoading}
        <Spinner />
      {/if}
    </Button>
    {#if showAssignmentButton}
      <Button
        class="submit-button"
        title={t('formfooter.assign')}
        variant="raised"
        onclick={() => (assignmentPanelVisible = !assignmentPanelVisible)}
        type="button"
      >
        <Label>{t('formfooter.assign')}</Label>
        <Icon class="material-icons">partner_exchange</Icon>
      </Button>
    {/if}
    {#if showPublishButton}
      <Button
        class="submit-button"
        title={t('formfooter.publish')}
        variant="raised"
        onclick={() => (publishPanelVisible = !publishPanelVisible)}
        type="button"
      >
        <Label>{t('formfooter.publish')}</Label>
        <Icon class="material-icons">rocket_launch</Icon>
      </Button>
    {/if}
  </div>
</footer>

{#if showMask}
  <div class="mask" onclick={closePanels} onkeydown={closePanels} role="button" tabindex="0"></div>
{/if}

{#if commentsPanelVisible}
  <CommentsPanel />
{/if}

<AssignmentDialog bind:open={assignmentPanelVisible} />
<ValidationDialog bind:open={validationPanelVisible} />
<PublishDialog bind:open={publishPanelVisible} />

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
      display: flex;
      padding: 0 1em;
      gap: 1em;
      overflow-y: auto;

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

    @media (max-width: 1024px) {
      .left-container,
      .right-container {
        :global(.mdc-button__label) {
          display: none;
        }
        :global(.mdc-button__icon) {
          margin-left: 0;
          margin-right: 0;
        }
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
