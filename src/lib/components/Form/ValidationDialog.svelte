<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import Button, { Icon, Label } from '@smui/button';
  import Spinner from '../Spinner.svelte';
  import { sseContext } from '$lib/context/ServerEventContext.svelte';
  import Dialog, { Content, Header, Title } from '@smui/dialog';
  import { getContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';

  type MessageGroup = {
    'gdi-inspire': string[][][];
    'gdi-de': string[][][];
    'inspire-validator': string[][][];
    'internal-etf-errors': string[];
  };

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);

  let isLoading = $state(false);
  let validationStartError = $state(false);
  let validationResult = $state<MessageGroup | null>(null);
  let validationError = $state<string | null>(null);

  let { open = $bindable(false) } = $props();

  const metadata = $derived(formContext.metadata);
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
      'inspire-validator': [],
      'internal-etf-errors': []
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
      } else if (line.startsWith('Fehler beim Validieren:')) {
        errorsByTestEngine['internal-etf-errors'].push(line);
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

      if (engine === 'internal-etf-errors') {
        continue;
      }

      const testErrors = errorsByTestEngine[engine].filter((group) => group.length > 0);
      errorsByTestEngine[engine] = testErrors;
    }

    return errorsByTestEngine;
  };
</script>

<Dialog bind:open aria-labelledby="Validierung" aria-describedby="Validierung">
  <Header>
    <Title>Validierung {metadata?.isoMetadata?.title}</Title>
  </Header>
  <Content>
    <div class="validation-content">
      <p>
        In diesem Schritt wird die Validierung der Metadaten durchgeführt. Bitte beachten Sie, dass
        dies einige Zeit in Anspruch nehmen kann, abhängig von der Größe und Komplexität der
        Metadaten. Sie können die Validierung über den Button <code>Validierung starten</code>
        beginnen. Die Validierung wird im Hintergrund durchgeführt und Sie werden benachrichtigt, sobald
        sie abgeschlossen ist.
        <br />
        <br />
        Möchten Sie die Validierung jetzt starten?
      </p>
      <div class="validation-actions">
        <Button variant="raised" onclick={runValidation} disabled={isLoading}>
          <Label>Validierung starten</Label>
          <Icon class="material-icons">assignment_turned_in</Icon>
          {#if isLoading}
            <Spinner />
          {/if}
        </Button>
      </div>
      <div class="validation-results">
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
            {#if validationResult?.['internal-etf-errors'].length}
              <h3>Interne ETF-Fehler:</h3>
              <ul>
                {#each validationResult?.['internal-etf-errors'] as message}
                  <li class="error">
                    {@html message}
                  </li>
                {/each}
              </ul>
            {/if}
            {#if validationResult?.['gdi-inspire'].length === 0 && validationResult?.['gdi-de'].length === 0 && validationResult?.['inspire-validator'].length === 0 && validationResult?.['internal-etf-errors'].length === 0}
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
  </Content>
</Dialog>

<style lang="scss">
  .validation-content {
    color: black;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
  }

  .validation-actions {
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  :global(.spinner) {
    margin-left: 1em;
  }

  .validation-results {
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
