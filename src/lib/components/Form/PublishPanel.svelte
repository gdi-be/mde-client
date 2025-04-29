<script lang="ts">
  import type { MetadataCollection } from '$lib/models/metadata';
  import { env } from '$env/dynamic/public';
  import Button, { Icon, Label } from '@smui/button';
  import Paper from '@smui/paper';
  import Spinner from '../Spinner.svelte';

  type MetadataPublishResponse = {
    publishedCatalogRecords: string[];
  };

  type PublishPanelProps = {
    metadata?: MetadataCollection;
  };

  let { metadata }: PublishPanelProps = $props();

  let isLoading = $state(false);
  let responseStatus = $state<number | null>(null);
  let responseUuids = $state<MetadataPublishResponse | null>(null);

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
        throw new Error(`Failed to publish the metadata: ${response.statusText}`);
      }

      const uuids = (await response.json()) as MetadataPublishResponse;

      responseUuids = uuids;
    } catch (error) {
      console.error('Error during publishing: ', error);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="publish-panel-container">
  <Paper elevation={6} class="publish-panel">
    <div class="publish-panel-content">
      <h2>Freigabe {metadata?.isoMetadata?.title}</h2>
      <div>
        <p>
          In diesem Schritt wird die Freigabe der Metadaten durchgeführt. Hierdurch wird der
          aktuelle Stand der Metadaten im Geonetwork veröffentlicht und somit für alle Nutzenden
          einsehbar. Bitte beachten Sie, dass die Metadaten nur veröffentlicht werden können, wenn:
        </p>
        <ul>
          <li class={[metadata?.approved === true ? 'check' : 'missing']}>
            die Metadaten genehmigt wurden:
          </li>
          <li class={[metadata?.responsibleRole === 'MdeEditor' ? 'check' : 'missing']}>
            die Metadaten einem Redakteur zugewiesen sind:
          </li>
        </ul>
        {#if metadata?.status === 'PUBLISHED'}
          <p>Die Metadaten wurden bereits freigegeben. Wollen Sie diese aktualisieren?</p>
        {:else}
          <p>Wollen Sie die Metadaten freigeben?</p>
        {/if}
        <div class="publish-panel-actions">
          <Button
            variant="raised"
            onclick={onPublishClick}
            disabled={isLoading || !isAllowedToPublish()}
          >
            <Label>Freigabe durchführen</Label>
            <Icon class="material-icons">rocket_launch</Icon>
            {#if isLoading}
              <Spinner />
            {/if}
          </Button>
        </div>
      </div>
      <div class="publish-panel-results">
        {#if isLoading}
          <p class="loading">Die Veröffentlichung läuft. Bitte warten Sie…</p>
        {:else if responseStatus === 200}
          <p class="success">Die Metadaten wurden erfolgreich veröffentlicht.</p>
          <p>Die veröffentlichten Metadaten sind unter den folgenden UUIDs verfügbar:</p>
          <ul>
            {#each responseUuids?.publishedCatalogRecords ?? [] as uuid}
              <li>
                <a href={`${env.PUBLIC_GNOS_URL}/srv/eng/catalog.search#/metadata/${uuid}`}
                  >{uuid}</a
                >
              </li>
            {/each}
          </ul>
        {:else if responseStatus === 409}
          <p class="warn">
            Die Metadaten konnten aufgrund fehlender Vorbedingungen nicht veröffentlicht werden.
          </p>
        {:else if responseStatus !== null}
          <p class="error">
            Ein interner Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.
          </p>
        {/if}
      </div>
    </div>
  </Paper>
</div>

<style lang="scss">
  .publish-panel-container {
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :global(div.smui-paper.publish-panel) {
    background-color: white;
    padding: 0.5em 1em;
  }

  .publish-panel-content {
    display: flex;
    flex-direction: column;
    min-width: 60vw;
    max-height: 90vh;
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

  .publish-panel-actions {
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  :global(.spinner) {
    margin-left: 1em;
  }

  .publish-panel-results {
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
