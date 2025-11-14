<script lang="ts">
  import { env } from '$env/dynamic/public';
  import Button, { Icon, Label } from '@smui/button';
  import Spinner from '../Spinner.svelte';
  import { getContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import Dialog, { Content, Header, Title } from '@smui/dialog';
  import { toast } from 'svelte-french-toast';

  type MetadataPublishResponse = {
    publishedCatalogRecords: string[];
  };

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);

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
        toast.error(`Fehler beim Veröffentlichen der Metadaten: ${response.statusText}`);
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
</script>

<Dialog bind:open aria-labelledby="Freigabe" aria-describedby="Freigabe">
  <Header>
    <Title>Freigabe {metadata?.isoMetadata?.title}</Title>
  </Header>
  <Content>
    <div class="publish-content">
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
        <div class="publish-actions">
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
      <div class="publish-results">
        {#if isLoading}
          <p class="loading">Die Veröffentlichung läuft. Bitte warten Sie…</p>
        {:else if responseStatus === 200}
          <p class="success">Die Metadaten wurden erfolgreich veröffentlicht.</p>
          <p>Die veröffentlichten Metadaten sind unter den folgenden UUIDs verfügbar:</p>
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
