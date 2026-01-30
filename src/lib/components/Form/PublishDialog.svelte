<script lang="ts">
  import { env } from '$env/dynamic/public';
  import Button, { Icon, Label } from '@smui/button';
  import Spinner from '../Spinner.svelte';
  import { getContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import Dialog, { Content, Header, Title } from '@smui/dialog';
  import { toast } from 'svelte-french-toast';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/state';

  type MetadataPublishResponse = {
    publishedCatalogRecords: string[];
  };

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const t = $derived(page.data.t);

  let { open = $bindable(false) } = $props();

  let isLoading = $state(false);
  let responseStatus = $state<number | null>(null);
  let responseUuids = $state<MetadataPublishResponse | null>(null);

  const metadata = $derived(formContext.metadata);

  const isAllowedToPublish = $derived(() => {
    return metadata?.approved === true && metadata?.responsibleRole === 'MdeEditor';
  });

  const onPublishClick = async () => {
    if (!metadata?.metadataId) {
      console.error('No metadata ID available to publish');
      return;
    }

    try {
      isLoading = true;
      responseStatus = null;

      const response = await fetch(`/metadata/${metadata.metadataId}/publish`, {
        method: 'POST'
      });

      responseStatus = response.status;

      if (!response.ok) {
        toast.error(t('publishdialog.fetchError', { statusText: response.statusText }));
        return Promise.reject(`Failed to publish the metadata: ${response.statusText}`);
      }

      const uuids = (await response.json()) as MetadataPublishResponse;

      responseUuids = uuids;
    } catch (error) {
      console.error('Error during publishing: ', error);
    } finally {
      isLoading = false;
    }
  };

  const onClose = () => {
    invalidateAll();
  };
</script>

<Dialog
  bind:open
  aria-labelledby="Freigabe"
  aria-describedby="Freigabe"
  onSMUIDialogClosed={onClose}
>
  <Header>
    <Title>{t('publishdialog.title', { title: metadata?.isoMetadata?.title })}</Title>
  </Header>
  <Content>
    <div class="publish-content">
      {#if responseStatus !== 200}
        <div>
          <p>{t('publishdialog.description')}</p>
          <ul>
            <li class={[metadata?.approved === true ? 'check' : 'missing']}>
              {t('publishdialog.approved')}
            </li>
            <li class={[metadata?.responsibleRole === 'MdeEditor' ? 'check' : 'missing']}>
              {t('publishdialog.editor')}
            </li>
          </ul>
          {#if metadata?.status === 'PUBLISHED'}
            <p>{t('publishdialog.alreadyPublished')}</p>
          {:else}
            <p>{t('publishdialog.publish')}</p>
          {/if}
          <div class="publish-actions">
            <Button
              variant="raised"
              onclick={onPublishClick}
              disabled={isLoading || !isAllowedToPublish()}
              type="button"
            >
              <Label>{t('publishdialog.action')}</Label>
              <Icon class="material-icons">rocket_launch</Icon>
              {#if isLoading}
                <Spinner />
              {/if}
            </Button>
          </div>
        </div>
      {/if}
      <div class="publish-results">
        {#if isLoading}
          <p class="loading">{t('publishdialog.running')}</p>
        {:else if responseStatus === 200}
          <p class="success">{t('publishdialog.success')}</p>
          <p>{t('publishdialog.uuids')}</p>
          <ul>
            {#each responseUuids?.publishedCatalogRecords ?? [] as uuid}
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${env.PUBLIC_GNOS_URL}/srv/ger/catalog.search#/metadata/${uuid}`}>{uuid}</a
                >
              </li>
            {/each}
          </ul>
        {:else if responseStatus === 409}
          <p class="warn">{t('publishdialog.preconditionFailed')}</p>
        {:else if responseStatus !== null}
          <p class="error">{t('publishdialog.error')}</p>
        {/if}
      </div>
    </div>
  </Content>
</Dialog>

<style lang="scss">
  .publish-content {
    color: black;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
  }

  li.check {
    &::after {
      content: '✅';
      margin-left: 0.5em;
    }
  }

  li.missing {
    &::after {
      content: '❌';
      margin-left: 0.5em;
    }
  }

  .publish-actions {
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  :global(.spinner) {
    margin-left: 1em;
  }

  .publish-results {
    .success {
      border: 1px solid #b6ea97;
      padding: 0.5em;
      border-radius: 4px;
      background-color: #f6ffee;

      &::before {
        content: '✅';
        margin-right: 0.5em;
      }
    }

    .warn {
      border: 1px solid #fee698;
      padding: 0.5em;
      border-radius: 4px;
      background-color: #fffbe7;

      &::before {
        content: '⚠️';
        margin-right: 0.5em;
      }
    }

    .error {
      border: 1px solid #ffcfc9;
      padding: 0.5em;
      border-radius: 4px;
      background-color: #fff2f0;

      &::before {
        content: '❌';
        margin-right: 0.5em;
      }
    }
  }
</style>
