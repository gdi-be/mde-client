<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import type { MetadataCollection } from '$lib/models/metadata';
  import Button, { Icon, Label } from '@smui/button';
  import Paper from '@smui/paper';
  import Spinner from '../Spinner.svelte';
  import { sseContext } from '$lib/context/ServerEventContext.svelte';

  type ValidationPanelProps = {
    metadata?: MetadataCollection;
  };

  type MessageGroup = {
    'gdi-inspire': string[][][];
    'gdi-de': string[][][];
    'inspire-validator': string[][][];
  };

  let isLoading = $state(false);
  let validationStartError = $state(false);
  let validationResult = $state<MessageGroup | null>(null);
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
      ?.filter((validation) => validation.metadataId === metadataId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .at(-1);

    isLoading = lastItem?.status === 'RUNNING' || false;
    validationResult =
      lastItem?.status === 'FINISHED' ? getGroupedMessages(lastItem.message) : null;
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
  const getGroupedMessages = (message: string) => {
    const errorsByTestEngine: MessageGroup = {
      'gdi-inspire': [],
      'gdi-de': [],
      'inspire-validator': []
    };

    let currentEngine: keyof MessageGroup | null = null;

    const splitMessage = message.split('|').map((res) => res.trim());

    for (const line of splitMessage) {
      if (line.startsWith('Ergebnisse GDI-DE für INSPIRE:')) {
        currentEngine = 'gdi-inspire';
        errorsByTestEngine[currentEngine].push([]);
      } else if (line.startsWith('Ergebnisse GDI-DE:')) {
        currentEngine = 'gdi-de';
        errorsByTestEngine[currentEngine].push([]);
      } else if (line.startsWith('Ergebnisse INSPIRE-Validator:')) {
        currentEngine = 'inspire-validator';
        errorsByTestEngine[currentEngine].push([]);
      } else if (currentEngine) {
        if (
          line.startsWith('Prüfung auf') ||
          line.startsWith('Execute tests') ||
          line.startsWith('Test that')
        ) {
          errorsByTestEngine[currentEngine].push([[line]]);
        } else {
          errorsByTestEngine[currentEngine].at(-1)?.at(-1)?.push(line);
        }
      }
    }

    for (const errorByTestEngine in errorsByTestEngine) {
      const engine = errorByTestEngine as keyof MessageGroup;
      const testErrors = errorsByTestEngine[engine].filter((group) => group.length > 0);
      errorsByTestEngine[engine] = testErrors;
    }

    return errorsByTestEngine;
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
          Metadaten. Sie können die Validierung über den Button <code>Validierung starten</code>
          beginnen. Die Validierung wird im Hintergrund durchgeführt und Sie werden benachrichtigt, sobald
          sie abgeschlossen ist.
          <br />
          <br />
          Möchten Sie die Validierung jetzt starten?
        </p>
        <div class="validation-panel-actions">
          <Button variant="raised" onclick={runValidation} disabled={isLoading}>
            <Label>Validierung starten</Label>
            <Icon class="material-icons">assignment_turned_in</Icon>
            {#if isLoading}
              <Spinner />
            {/if}
          </Button>
        </div>
        <div class="validation-panel-results">
          {#if isLoading}
            <p>Die Validierung läuft. Bitte warten Sie…</p>
          {:else if validationResult}
            <p>Ergebnisse der Validierung:</p>
            <div class="validation-results">
              {#if validationResult?.['gdi-inspire'].length}
                <h3>Ergebnisse GDI-DE für INSPIRE:</h3>
                <ol>
                  {#each validationResult?.['gdi-inspire'] as message}
                    {#each message as entry}
                      <li>Fehler</li>
                      <ul>
                        {#each entry as e}
                          <li
                            class={[
                              e.toLowerCase().startsWith('fehler') && 'error',
                              e.toLowerCase().startsWith('warnung') && 'warn'
                            ]}
                          >
                            {@html e}
                          </li>
                        {/each}
                      </ul>
                    {/each}
                  {/each}
                </ol>
              {/if}
              {#if validationResult?.['gdi-de'].length}
                <h3>Ergebnisse GDI-DE:</h3>
                <ol>
                  {#each validationResult?.['gdi-de'] as message}
                    {#each message as entry}
                      <li>Fehler</li>
                      <ul>
                        {#each entry as e}
                          <li
                            class={[
                              e.toLowerCase().startsWith('fehler') && 'error',
                              e.toLowerCase().startsWith('warnung') && 'warn'
                            ]}
                          >
                            {@html e}
                          </li>
                        {/each}
                      </ul>
                    {/each}
                  {/each}
                </ol>
              {/if}
              {#if validationResult?.['inspire-validator'].length}
                <h3>Ergebnisse INSPIRE-Validator:</h3>
                <ol>
                  {#each validationResult?.['inspire-validator'] as message}
                    {#each message as entry}
                      <li>Fehler</li>
                      <ul>
                        {#each entry as e}
                          <li
                            class={[
                              e.toLowerCase().includes('with errors') && 'error',
                              e.toLowerCase().includes('system error') && 'error',
                              e.toLowerCase().includes('cannot be retrieved') && 'error',
                              e.toLowerCase().includes('not provided') && 'error',
                              e.toLowerCase().includes('must have') && 'error',
                              e.toLowerCase().includes('shall be given') && 'warn',
                              e.toLowerCase().includes('shall exist') && 'warn'
                            ]}
                          >
                            {@html e}
                          </li>
                        {/each}
                      </ul>
                    {/each}
                  {/each}
                </ol>
              {/if}
              {#if validationResult?.['gdi-inspire'].length === 0 && validationResult?.['gdi-de'].length === 0 && validationResult?.['inspire-validator'].length === 0}
                <p class="success">Keine Fehler oder Warnungen gefunden.</p>
              {/if}
            </div>
          {:else if validationError}
            <p>Die Validierung konnte nicht erfolgreich durchgeführt werden.</p>
          {:else if validationStartError}
            <p>Die Validierung konnte nicht gestartet werden.</p>
          {/if}
        </div>
      </div>
    </div></Paper
  >
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

      @media (max-height: 768px) {
        max-height: 40vh;
      }

      @media (max-height: 610px) {
        max-height: 30vh;
      }

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
