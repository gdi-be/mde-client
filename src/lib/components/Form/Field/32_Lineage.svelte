<script lang="ts">
  import type { Lineage, MetadataCollection } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '../Inputs/TextInput.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import FieldHint from '../FieldHint.svelte';
  import { toast } from 'svelte-french-toast';

  type LineageListEntry = Lineage & { listId: string };

  const KEY = 'isoMetadata.lineage';

  const valueFromData = $derived(getValue<Lineage[]>(KEY));
  let lineages = $state<LineageListEntry[]>([]);

  let searchResultsElement = $state<HTMLElement>();

  let metadataCollections = $state<MetadataCollection[]>([]);
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
          date: ''
        }
      ];
    }
  });

  // add global click listener if titleSearchResults are open
  // to close the search results when clicking outside
  $effect(() => {
    if (metadataCollections.length > 0) {
      const closeSearchResults = () => {
        metadataCollections = [];
      };
      document.addEventListener('click', closeSearchResults);
      return () => {
        document.removeEventListener('click', closeSearchResults);
      };
    }
  });

  const searchMetadataCollections = async (searchTerm: string) => {
    if (searchTerm === '') {
      return [];
    }

    const url = new URL('/metadata/search', window.location.origin);
    url.searchParams.append('query', searchTerm);

    const response = await fetch(url);

    if (!response.ok) {
      toast.error('Fehler beim Abrufen der Metadaten');
      return [];
    }

    const data = await response.json();

    return data?.content || [];
  };

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<Lineage[]>(32);

  const persistLineages = async () => {
    const value = lineages.map((lineage) => ({
      title: lineage.title,
      identifier: lineage.identifier,
      date: lineage.date ? new Date(lineage.date).toISOString() : ''
    }));
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = (evt: MouseEvent) => {
    evt.preventDefault();
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

  const onSelectMetadataCollection = (
    metadataCollection: MetadataCollection,
    targetLineage: LineageListEntry
  ) => {
    lineages = lineages.map((lineage) => {
      if (lineage.listId === targetLineage.listId) {
        return {
          ...lineage,
          title: metadataCollection.title!,
          identifier: metadataCollection.metadataId!,
          date: metadataCollection.isoMetadata?.published
        };
      }
      return lineage;
    });

    persistLineages();
    metadataCollections = [];
  };

  const onTitleKeyUp = async (evt: KeyboardEvent, lineage: LineageListEntry) => {
    const value = (evt.target as HTMLInputElement)?.value;
    metadataCollections = await searchMetadataCollections(value);
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
      <IconButton
        class="material-icons"
        onclick={(evt) => addItem(evt)}
        size="button"
        title="Daten hinzufügen"
      >
        add
      </IconButton>
    </legend>
    <FieldHint {fieldConfig} />
    {#each lineages as lineage, index (lineage.listId)}
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
          <div class="wrap">
            <TextInput
              bind:value={lineage.title}
              label="Titel"
              onblur={onTitleBlur}
              onkeyup={(evt) => onTitleKeyUp(evt, lineage)}
              fieldConfig={getFieldConfig(33)}
              validationResult={getFieldConfig(33)?.validator(lineage.title)}
            />
            <FieldTools key={`${KEY}[${index}].title`} fieldConfig={getFieldConfig(33)} />
          </div>
          {#if metadataCollections.length > 0 && titleSearchListId === lineage.listId}
            <ul class="search-results" bind:this={searchResultsElement}>
              {#each metadataCollections as metadataCollection}
                <li class="search-result">
                  <button onclick={() => onSelectMetadataCollection(metadataCollection, lineage)}>
                    {metadataCollection.title}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
        <div class="inline-fields">
          <div class="publish-date-field">
            <DateInput
              bind:value={lineage.date}
              key={KEY}
              label="Veröffentlichungsdatum"
              onblur={persistLineages}
              fieldConfig={getFieldConfig(34)}
              validationResult={getFieldConfig(34)?.validator(lineage.date)}
            />
            <FieldTools key={`${KEY}[${index}].date`} fieldConfig={getFieldConfig(34)} />
          </div>
          <div class="lineage-source-field">
            <TextInput
              bind:value={lineage.identifier}
              label="Identifier"
              onblur={persistLineages}
              fieldConfig={getFieldConfig(35)}
              validationResult={getFieldConfig(35)?.validator(lineage.identifier)}
            />
            <FieldTools key={`${KEY}[${index}].identifier`} fieldConfig={getFieldConfig(35)} />
          </div>
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools noCopyButton key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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

      .wrap {
        display: flex;

        :global(.text-input) {
          flex: 1;
        }
      }

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
        max-height: 200px;
        overflow-y: auto;

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
        display: flex;
        flex: 1;
      }

      :global(.lineage-source-field) {
        flex: 3;
        display: flex;

        :global(.text-input) {
          flex: 1;
        }
      }
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
