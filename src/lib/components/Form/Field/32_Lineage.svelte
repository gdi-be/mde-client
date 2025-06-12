<script lang="ts">
  import type { Lineage } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import {
    getFieldConfig,
    getSubFieldConfig,
    getValue,
    persistValue
  } from '$lib/context/FormContext.svelte';
  import TextInput from '../Inputs/TextInput.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import FieldHint from '../FieldHint.svelte';
  import { page } from '$app/state';
  import { toast } from 'svelte-french-toast';

  type LineageListEntry = Lineage & { listId: string };

  const KEY = 'isoMetadata.lineage';

  const valueFromData = $derived(getValue<Lineage[]>(KEY));
  let lineages = $state<LineageListEntry[]>([]);

  let searchResultsElement = $state<HTMLElement>();

  let titleSearchResults = $state<Lineage[]>([]);
  let titleSearchListId = $state<string>();

  $effect(() => {
    if (valueFromData && valueFromData.length > 0) {
      lineages = valueFromData?.map((lineage) => {
        const listId = crypto.randomUUID();
        return {
          listId,
          title: lineage.title || '',
          identifier: lineage.identifier || '',
          date: lineage.date ? new Date(lineage.date).toISOString().split('T')[0] : ''
        };
      });
    } else {
      lineages = [
        {
          listId: crypto.randomUUID(),
          title: '',
          identifier: '',
          date: new Date().toISOString().split('T')[0]
        }
      ];
    }
  });

  // add global click listener if titleSearchResults are open
  // to close the search results when clicking outside
  $effect(() => {
    if (titleSearchResults.length > 0) {
      const closeSearchResults = () => {
        titleSearchResults = [];
      };
      document.addEventListener('click', closeSearchResults);
      return () => {
        document.removeEventListener('click', closeSearchResults);
      };
    }
  });

  const searchLineages = async (searchTerm: string, property = 'title') => {
    if (searchTerm === '') {
      return [];
    }

    const url = new URL(page.url.origin + '/searchLineage');
    url.searchParams.append('searchTerm', searchTerm);
    url.searchParams.append('property', property);
    url.searchParams.append('unique', '1');

    const response = await fetch(url);

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Datengrundlagen');
      return [];
    }

    const lineages = await response.json();

    return lineages;
  };

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<Lineage[]>(KEY);

  const persistLineages = async () => {
    const value = lineages.map((lineage) => ({
      title: lineage.title,
      identifier: lineage.identifier,
      date: lineage.date ? new Date(lineage.date).toISOString() : ''
    }));
    const response = await persistValue(KEY, value, false);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = () => {
    const listId = crypto.randomUUID();
    lineages = [
      {
        listId,
        title: '',
        identifier: '',
        date: ''
      },
      ...lineages
    ];
  };

  const removeItem = (listId: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        lineages = lineages.filter((lineage) => lineage.listId !== listId);
        persistLineages();
      },
      {
        text: 'Möchten Sie diese Datengrundlage wirklich löschen?',
        confirmButtonText: 'Löschen'
      }
    );
  };

  const onSelectLineage = (selectedLineage: Lineage, targetLineage: LineageListEntry) => {
    lineages = lineages.map((lineage) => {
      if (lineage.listId === targetLineage.listId) {
        return {
          ...lineage,
          title: selectedLineage.title,
          identifier: selectedLineage.identifier,
          date: selectedLineage.date
        };
      }
      return lineage;
    });

    persistLineages();
    titleSearchResults = [];
  };

  const onTitleKeyUp = async (evt: KeyboardEvent, lineage: LineageListEntry) => {
    const value = (evt.target as HTMLInputElement)?.value;
    titleSearchResults = await searchLineages(value, 'title');
    titleSearchListId = lineage.listId;
  };

  const onTitleBlur = async (evt: FocusEvent) => {
    const relatedTarget = evt.relatedTarget as HTMLElement;
    if (searchResultsElement && relatedTarget && searchResultsElement.contains(relatedTarget)) {
      return;
    }
    persistLineages();
  };
</script>

<div class="lineages-field">
  <fieldset>
    <legend>
      {fieldConfig?.label}
      <IconButton class="material-icons" onclick={addItem} size="button" title="Daten hinzufügen">
        add
      </IconButton>
    </legend>
    <FieldHint {fieldConfig} />
    {#each lineages as lineage (lineage.listId)}
      <fieldset class="lineage">
        <legend>
          <IconButton
            class="material-icons"
            onclick={(evt) => removeItem(lineage.listId, evt)}
            size="button"
            title="Daten entfernen"
          >
            delete
          </IconButton>
        </legend>
        <div class="search-input-wrapper">
          <TextInput
            bind:value={lineage.title}
            label="Titel"
            onblur={onTitleBlur}
            onkeyup={(evt) => onTitleKeyUp(evt, lineage)}
            fieldConfig={getSubFieldConfig(KEY, 'title')}
          />
          {#if titleSearchResults.length > 0 && titleSearchListId === lineage.listId}
            <ul class="search-results" bind:this={searchResultsElement}>
              {#each titleSearchResults as result}
                <li class="search-result">
                  <button onclick={() => onSelectLineage(result, lineage)}>
                    {result.title}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
        <div class="inline-fields">
          <DateInput
            class="publish-date-field"
            bind:value={lineage.date}
            key={KEY}
            label="Veröffentlichungsdatum"
            onblur={persistLineages}
            fieldConfig={getSubFieldConfig(KEY, 'date')}
          />
          <TextInput
            class="lineage-source-field"
            bind:value={lineage.identifier}
            label="Identifier"
            onblur={persistLineages}
            fieldConfig={getSubFieldConfig(KEY, 'identifier')}
          />
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .lineages-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    .search-input-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;

      .search-results {
        position: absolute;
        padding: 0;
        margin: 0;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1;
        overflow: hidden;

        .search-result {
          list-style-type: none;
          margin: 0.25em 0;

          button {
            cursor: pointer;
            padding: 1em;
            width: 100%;
            text-align: start;
            border: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: white;
            font-size: 1em;

            &:hover {
              background-color: rgba(244, 244, 244, 0.7);
            }
          }
        }
      }
    }

    fieldset {
      flex: 1;
      border-radius: 0.25em;

      > legend {
        display: flex;
        align-items: center;
        font-size: 1.5em;
      }
    }

    .lineage {
      display: flex;
      flex-direction: column;
      gap: 1em;

      legend {
        text-align: right;
      }

      :global(.text-input),
      :global(.date-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.text-input > legend),
      :global(.date-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
    }

    .inline-fields {
      display: flex;
      gap: 1em;

      :global(.publish-date-field) {
        flex: 1;
      }

      :global(.lineage-source-field) {
        flex: 3;
      }
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
