<script lang="ts">
  import type { MetadataCollection } from '$lib/models/metadata';
  import Button, { Icon, Label } from '@smui/button';
  import Paper from '@smui/paper';
  import Spinner from '../Spinner.svelte';
  import { sseContext } from '$lib/context/ServerEventContext.svelte';

  type ValidationPanelProps = {
    metadata?: MetadataCollection;
  };

  let isLoading = $state(false);
  let validationStartError = $state(false);
  let validationResult = $state<string | null>(null);
  let validationError = $state<string | null>(null);

  let { metadata }: ValidationPanelProps = $props();

  const metadataId = $derived(metadata?.metadataId);
  const { validation } = $derived(sseContext.getSseContext());

  $effect(() => {
    if (validationStartError) {
      validationResult = null;
      validationError = null;
      return;
    }

    const lastItem = validation
      ?.filter(validation => validation.metadataId === metadataId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .at(-1);

    isLoading = lastItem?.status === 'RUNNING' || false;
    validationResult = lastItem?.status === 'FINISHED' ? lastItem.message : null;
    validationError = lastItem?.status === 'FAILED' ? lastItem.message : null;
  });

  const runValidation = async () => {
    if (!metadataId) {
      console.error('No metadata ID available for validation');
      return;
    }

    try {
      const response = await fetch(`/metadata/${metadataId}/validate`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to start the validation process: ${response.statusText}`);
      }

      validationStartError = false;
    } catch (error) {
      console.error('Error while starting the validation: ', error);
      validationStartError = true;
    }
  };
</script>

<div class="validation-panel-container">
  <Paper elevation={6} class="validation-panel">
    <div class="validation-panel-content">
      <h2>Validierung {metadata?.isoMetadata?.title}</h2>
      <div>
        <p>
          In diesem Schritt wird die Validierung der Metadaten durchgeführt. Bitte beachten Sie,
          dass dies einige Zeit in Anspruch nehmen kann, abhängig von der Größe und Komplexität der
          Metadaten.
          Sie können die Validierung über den Button <code>Validierung starten</code> beginnen. Die
          Validierung wird im Hintergrund durchgeführt und Sie werden benachrichtigt, sobald sie
          abgeschlossen ist.
          <br />
          <br />
          Möchten Sie die Validierung jetzt starten?
        </p>
        <div class="validation-panel-actions">
          <Button
            variant="raised"
            onclick={runValidation}
            disabled={isLoading}
          >
            <Label>Validierung starten</Label>
            <Icon class="material-icons">assignment_turned_in</Icon>
            {#if isLoading}
              <Spinner />
            {/if}
          </Button>
        </div>
        <div class="validation-panel-results">
          {#if isLoading}
            <p>
              Die Validierung läuft. Bitte warten Sie…
            </p>
          {:else if validationResult}
            <p>
              Ergebnisse der Validierung:
            </p>
            <div class="validation-results">
              {#if validationResult.split('|').length > 0}
                {@const results = validationResult.split('|')
                  .map(res => res.trim())
                  .filter(res => {
                    return !res.startsWith('Ergebnisse GDI-DE') &&
                      !res.startsWith('GDI-DE Konventionen') &&
                      !res.startsWith('Metadaten: GDI-DE')
                  })}
                {#if results.length === 0}
                  <p
                    class="success"
                  >
                    Keine Fehler oder Warnungen gefunden.
                  </p>
                {:else}
                  {#each results as result}
                    {#if result.startsWith('Fehler beim Validieren')}
                      <p
                        class="error"
                      >
                        {@html result}
                      </p>
                    {:else if result.startsWith('Prüfung auf')}
                      <h4>
                        {@html result}
                      </h4>
                    {:else}
                    <ul>
                      <li
                        class={[
                          result.toLowerCase().startsWith('fehler') && 'error',
                          result.toLowerCase().startsWith('warnung') && 'warn'
                        ]}
                      >
                        {@html result}
                      </li>
                    </ul>
                    {/if}
                  {/each}
                {/if}
              {/if}
            </div>
          {:else if validationError}
            <p>
              Die Validierung konnte nicht erfolgreich durchgeführt werden.
            </p>
          {:else if validationStartError}
            <p>
              Die Validierung konnte nicht gestartet werden.
            </p>
          {/if}
        </div>
      </div>
  </Paper>
</div>

<style lang="scss">
  .validation-panel-container {
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :global(div.smui-paper.validation-panel) {
    background-color: white;
    padding: 0.5em 1em;
  }

  .validation-panel-content {
    display: flex;
    flex-direction: column;
    min-width: 60vw;
    max-height: 90vh;
  }

  .validation-panel-actions {
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  :global(.spinner) {
    margin-left: 1em;
  }

  .validation-panel-results {
    .validation-results {
      max-height: 50vh;
      overflow-y: auto;

      .success {
        &::before {
          content: '✅';
          margin-right: 0.5em;
        }
      }

      .error {
        &::before {
          content: '❌';
          margin-right: 0.5em;
        }
      }

      .warn {
        &::before {
          content: '⚠️';
          margin-right: 0.5em;
        }
      }
    }

  }
</style>
