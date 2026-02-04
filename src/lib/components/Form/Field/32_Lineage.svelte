<script lang="ts">
  import type { Lineage, MetadataCollection } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getFormContext, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '../Inputs/TextInput.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import FieldHint from '../FieldHint.svelte';
  import { toast } from 'svelte-french-toast';
  import { page } from '$app/state';
  import { getPopconfirm } from '$lib/context/PopConfirmContext.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';

  const t = $derived(page.data.t);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  type LineageListEntry = Lineage & { listId: string };

  const KEY = 'isoMetadata.lineage';

  const { getValue } = getFormContext();
  const valueFromData = $derived(getValue<Lineage[]>(KEY));
  let lineages = $state<LineageListEntry[]>([]);

  let searchResultsElement = $state<HTMLElement>();

  let metadataCollections = $state<MetadataCollection[]>([]);
  let titleSearchListId = $state<string>();

  let showCheckmark = $state(false);
  let isEditing = $state<boolean>(false);

  const fieldConfig = getFieldConfig<Lineage[]>(32);
  const titleFieldConfig = getFieldConfig<string>(33);
  const dateFieldConfig = getFieldConfig<string>(34);
  const identifierFieldConfig = getFieldConfig<string>(35);

  const popconfirm = $derived(getPopconfirm());

  // important that this is not a state
  let previousValueAsString: string;

  $effect(() => {
    // this check prevents rerendering if nothing has actually changed
    const newValueAsString = JSON.stringify(valueFromData);
    if (
      previousValueAsString === newValueAsString ||
      !valueFromData ||
      valueFromData.length === 0
    ) {
      return;
    }
    lineages = valueFromData?.map((lineage: Lineage) => {
      const listId = crypto.randomUUID();
      return {
        listId,
        title: lineage.title || '',
        identifier: lineage.identifier || '',
        date: lineage.date ? new Date(lineage.date).toISOString().split('T')[0] : ''
      };
    });
    previousValueAsString = JSON.stringify(valueFromData);
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
      toast.error(t('general.error_fetch_options'));
      return [];
    }

    const data = await response.json();

    return data?.content || [];
  };

  const onBlur = async () => {
    await persistLineages();
    isEditing = false;
  };

  const onFocus = () => {
    isEditing = true;
  };

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
    persistLineages();
  };

  const removeItem = (listId: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm.open(
      targetEl,
      async () => {
        lineages = lineages.filter((lineage) => lineage.listId !== listId);
        persistLineages();
      },
      {
        text: t('32_Lineage.delete_confirm'),
        confirmButtonText: t('32_Lineage.delete_button')
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
    isEditing = false;
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
    await persistLineages();
    isEditing = false;
  };

  let hasInvalidFields = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    const hasInvalidFields = lineages.some((lineage) => {
      const titleValid = titleFieldConfig?.validator(lineage.title).valid ?? true;
      console.log('title valid', titleValid);
      const dateValid = dateFieldConfig?.validator(lineage.date).valid ?? true;
      const identifierValid = identifierFieldConfig?.validator(lineage.identifier).valid ?? true;
      return !titleValid || !dateValid || !identifierValid;
    });
    return isEditingRole && hasInvalidFields;
  });
</script>

<div class="lineages-field">
  <fieldset class={[hasInvalidFields ? 'invalid' : '']}>
    <legend>
      {t('32_Lineage.label')}
      <IconButton
        class="material-icons"
        disabled={isEditing}
        onclick={(evt) => addItem(evt)}
        size="button"
        type="button"
        title={t('32_Lineage.add')}
      >
        add
      </IconButton>
    </legend>
    <FieldHint {fieldConfig} explanation={t('32_Lineage.explanation')} />
    {#each lineages as lineage, index (lineage.listId)}
      <fieldset class="lineage">
        <legend>
          <IconButton
            class="material-icons"
            disabled={isEditing}
            onclick={(evt) => removeItem(lineage.listId, evt)}
            size="button"
            type="button"
            title={t('32_Lineage.remove')}
          >
            delete
          </IconButton>
        </legend>
        <div class="search-input-wrapper">
          <div class="wrap">
            <TextInput
              bind:value={lineage.title}
              label={t('32_Lineage.title')}
              onblur={onTitleBlur}
              onfocus={onFocus}
              onkeyup={(evt) => onTitleKeyUp(evt, lineage)}
              fieldConfig={titleFieldConfig}
              validationResult={titleFieldConfig?.validator(lineage.title)}
            />
            <FieldTools key={`${KEY}[${index}].title`} fieldConfig={titleFieldConfig} />
          </div>
          {#if metadataCollections.length > 0 && titleSearchListId === lineage.listId}
            <ul class="search-results" bind:this={searchResultsElement}>
              {#each metadataCollections as metadataCollection}
                <li class="search-result">
                  <button
                    type="button"
                    onclick={() => onSelectMetadataCollection(metadataCollection, lineage)}
                  >
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
              label={t('32_Lineage.publish_date')}
              onblur={onBlur}
              onfocus={onFocus}
              fieldConfig={dateFieldConfig}
              validationResult={dateFieldConfig?.validator(lineage.date)}
            />
            <FieldTools key={`${KEY}[${index}].date`} fieldConfig={dateFieldConfig} />
          </div>
          <div class="lineage-source-field">
            <TextInput
              bind:value={lineage.identifier}
              label={t('32_Lineage.identifier')}
              onblur={onBlur}
              onfocus={onFocus}
              fieldConfig={identifierFieldConfig}
              validationResult={identifierFieldConfig?.validator(lineage.identifier)}
            />
            <FieldTools key={`${KEY}[${index}].identifier`} fieldConfig={identifierFieldConfig} />
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

      &.invalid {
        border: 2px solid var(--mdc-theme-error) !important;
      }

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
      flex-wrap: wrap;
      gap: 1em;

      :global(.publish-date-field) {
        display: flex;
        flex: 1;

        :global(fieldset) {
          flex: 1;
        }
      }

      :global(.lineage-source-field) {
        display: flex;
        flex: 3;

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
