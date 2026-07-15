<script lang="ts">
  import IconButton from '@smui/icon-button';
  import ColumnsForm_63 from './63_ColumnsForm.svelte';
  import type { ColumnInfo, FeatureType, Service } from '$lib/models/metadata';
  import FeatureTypeTitle_61 from './Field/61_FeatureTypeTitle.svelte';
  import FeatureTypeName_62 from './Field/62_FeatureTypeName.svelte';
  import FeatureTypeDescription_69 from './Field/69_FeatureTypeDescription.svelte';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import { getPopconfirm } from '$lib/context/PopConfirmContext.svelte';
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '../FieldTools.svelte';
  import { page } from '$app/state';
  import { validateFeatureTypes } from './validation';
  import { MetadataService } from '$lib/services/MetadataService';
  import { getPersistableItems, persistItems } from '../persistableItems';
  import type { FullFieldConfig } from '../FieldsConfig';
  const t = $derived(page.data.t);

  type Tab = {
    name: string;
    id: string;
  };

  export type FeatureTypeFormProps = {
    value?: FeatureType[];
    service: Service;
    onChange: (featureTypes: FeatureType[], persist?: boolean) => Promise<Response>;
  };

  let { value: initialFeatureTypes, onChange, service }: FeatureTypeFormProps = $props();
  const serviceId = $derived(service?.serviceIdentification);

  const popconfirm = $derived(getPopconfirm());
  const { formState } = getFormContext();
  const metadata = $derived(formState.metadata!);
  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  let featureTypes = $derived<FeatureType[]>(initialFeatureTypes || []);
  let tabs = $derived<Tab[]>(
    featureTypes.map((featureType) => {
      return {
        id: featureType.id,
        name: featureType.title || 'Unbekannter Featuretype'
      };
    })
  );
  let activeTabId: string | undefined = $state();
  let activeFeatureType = $derived(featureTypes.find((ft) => ft.id === activeTabId));

  const fieldConfig = MetadataService.getFieldConfig(56);
  const titleFieldConfig = MetadataService.getFieldConfig<string>(61);
  const nameFieldConfig = MetadataService.getFieldConfig<string>(62);
  const descriptionFieldConfig = MetadataService.getFieldConfig<string>(69);
  const validationResult = $derived(
    fieldConfig?.validator(featureTypes, { PARENT_VALUE: service })
  );

  const invalidTabIds = $derived(
    validateFeatureTypes(featureTypes, { metadata, HIGHEST_ROLE: highestRole })
  );
  const isInvalid = $derived(featureTypes.length === 0 || invalidTabIds.size > 0);
  let lastPersistedFeatureTypes = $state<FeatureType[]>([]);
  let lastServiceId: string | undefined;

  $effect(() => {
    // if the serviceId changes set activeTabIndex to undefined
    if (serviceId && serviceId !== lastServiceId) {
      activeTabId = undefined;
      lastPersistedFeatureTypes = initialFeatureTypes || [];
      lastServiceId = serviceId;
    }
  });

  function addFeatureType() {
    const id = crypto.randomUUID();
    featureTypes = [
      ...featureTypes,
      {
        id,
        name: '',
        title: '',
        shortDescription: '',
        columns: []
      }
    ];
    syncLocalFeatureTypes(featureTypes);
    activeTabId = id;
  }

  function removeFeatureType(id: string, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm.open(
      targetEl,
      async () => {
        featureTypes = featureTypes.filter((featureType) => featureType.id !== id);
        syncLocalFeatureTypes(featureTypes);
        if (activeTabId === id) {
          activeTabId = featureTypes.length > 1 ? featureTypes[0].id : undefined;
        }
        persistFeatureTypes(featureTypes);
        activeTabId = featureTypes.length > 0 ? activeTabId : undefined;
        if (activeTabId && !featureTypes.find((ft) => ft.id === activeTabId)) {
          activeTabId = featureTypes[0]?.id;
        }
      },
      {
        text: 'Sind sie sicher, dass sie diesen FeatureType löschen möchten?',
        confirmButtonText: 'Löschen'
      }
    );
  }

  function set(key: string, value: FeatureType[keyof FeatureType], persist?: boolean) {
    featureTypes = featureTypes.map((featureType) => {
      if (featureType.id === activeTabId) {
        return {
          ...featureType,
          [key]: value
        };
      }
      return featureType;
    });
    syncLocalFeatureTypes(featureTypes);
    return persist === false ? onChange(featureTypes, false) : persistFeatureTypes(featureTypes);
  }

  async function persistFeatureTypes(nextFeatureTypes: FeatureType[]) {
    const { response, persistableItems } = await persistItems(
      nextFeatureTypes,
      lastPersistedFeatureTypes,
      [
        {
          key: 'title',
          isValid: (featureType) =>
            isFeatureTypeFieldValid(titleFieldConfig, featureType.title, featureType)
        },
        {
          key: 'name',
          isValid: (featureType) =>
            isFeatureTypeFieldValid(nameFieldConfig, featureType.name, featureType)
        },
        {
          key: 'shortDescription',
          isValid: (featureType) =>
            isFeatureTypeFieldValid(
              descriptionFieldConfig,
              featureType.shortDescription,
              featureType
            )
        }
      ],
      onChange,
      (featureTypes) => addPersistableColumns(featureTypes, nextFeatureTypes)
    );
    if (response.ok) {
      lastPersistedFeatureTypes = persistableItems;
    }
    return response;
  }

  function addPersistableColumns(featureTypes: FeatureType[], nextFeatureTypes: FeatureType[]) {
    return featureTypes.map((featureType) => {
      const localFeatureType = nextFeatureTypes.find((entry) => entry.id === featureType.id);
      const previous = lastPersistedFeatureTypes.find((entry) => entry.id === featureType.id);
      return {
        ...featureType,
        columns: getPersistableColumns(localFeatureType?.columns || [], previous?.columns || [])
      };
    });
  }

  function isFeatureTypeFieldValid<T>(
    fieldConfig: FullFieldConfig<T>,
    value: T | undefined,
    featureType: FeatureType
  ) {
    return (
      fieldConfig?.validator(value, {
        metadata,
        HIGHEST_ROLE: highestRole,
        PARENT_VALUE: featureType
      })?.valid === true
    );
  }

  function getPersistableColumns(columns: ColumnInfo[], previousColumns: ColumnInfo[]) {
    const nameFieldConfig = MetadataService.getFieldConfig<string>(64);
    const aliasFieldConfig = MetadataService.getFieldConfig<string>(65);
    const typeFieldConfig = MetadataService.getFieldConfig<ColumnInfo['type']>(66);

    return getPersistableItems(columns, previousColumns, [
      {
        key: 'name',
        isValid: (column) => nameFieldConfig?.validator(column.name)?.valid === true
      },
      {
        key: 'alias',
        isValid: (column) => aliasFieldConfig?.validator(column.alias)?.valid === true
      },
      {
        key: 'type',
        isValid: (column) => typeFieldConfig?.validator(column.type)?.valid === true
      }
    ]);
  }

  function syncLocalFeatureTypes(nextFeatureTypes: FeatureType[]) {
    if (!formState.metadata?.isoMetadata?.services) {
      return;
    }

    let hasMatchedService = false;
    formState.metadata = {
      ...formState.metadata,
      isoMetadata: {
        ...formState.metadata.isoMetadata,
        services: formState.metadata.isoMetadata.services.map((entry: Service) => {
          const isTargetService =
            entry.id === service.id ||
            entry.serviceIdentification === service.serviceIdentification;

          if (!isTargetService) {
            return entry;
          }

          hasMatchedService = true;
          return {
            ...entry,
            featureTypes: nextFeatureTypes
          };
        })
      }
    };

    if (hasMatchedService) {
      return;
    }

    formState.metadata = {
      ...formState.metadata,
      isoMetadata: {
        ...formState.metadata.isoMetadata,
        services: formState.metadata.isoMetadata.services.map((entry: Service) => {
          const hasFeatureTypeFromCurrentService = entry.featureTypes?.some((ft: FeatureType) =>
            nextFeatureTypes.some((nextFt) => nextFt.id === ft.id)
          );
          if (!hasFeatureTypeFromCurrentService) {
            return entry;
          }
          return {
            ...entry,
            featureTypes: nextFeatureTypes
          };
        })
      }
    };
  }
</script>

<div class="featuretypes-form">
  <fieldset class={[isInvalid && 'invalid']}>
    <legend>
      {t('56_FeatureTypeForm.label')}
    </legend>
    <FieldHint {fieldConfig} {validationResult} />
    <nav>
      {#each tabs as tab (tab.id)}
        <div
          class={[
            'tab-container',
            activeTabId === tab.id && 'active',
            invalidTabIds.has(tab.id) && 'invalid'
          ]}
        >
          <button
            type="button"
            id={tab.name}
            class="tab"
            title={tab.name}
            onclick={(evt) => {
              evt.preventDefault();
              activeTabId = tab.id;
            }}
          >
            {tab.name}
          </button>
          <IconButton
            class="material-icons"
            onclick={(evt) => removeFeatureType(tab.id, evt)}
            size="button"
            title="Featuretype entfernen"
            type="button"
          >
            delete
          </IconButton>
        </div>
      {/each}
      <IconButton
        class="material-icons"
        onclick={(evt) => {
          evt.preventDefault();
          addFeatureType();
        }}
        size="button"
        title="Featuretype hinzufügen"
        type="button"
      >
        add
      </IconButton>
    </nav>
    <div class="content">
      {#if activeTabId && activeFeatureType}
        <FeatureTypeTitle_61
          value={activeFeatureType?.title}
          onChange={(title, persist) => set('title', title, persist)}
        />
        <FeatureTypeName_62
          featureType={activeFeatureType}
          value={activeFeatureType?.name}
          onChange={(name, persist) => set('name', name, persist)}
        />
        <FeatureTypeDescription_69
          value={activeFeatureType?.shortDescription}
          onChange={(shortDescription, persist) =>
            set('shortDescription', shortDescription, persist)}
        />
        <ColumnsForm_63
          featureType={activeFeatureType}
          value={activeFeatureType?.columns}
          onChange={(columns, persist) => set('columns', columns, persist)}
        />
      {/if}
    </div>
  </fieldset>
  {#if fieldConfig?.key}
    <FieldTools noCopyButton key={fieldConfig.key} />
  {/if}
</div>

<style lang="scss">
  div.featuretypes-form {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 0.25em;

      &.invalid {
        border: 2px solid var(--mdc-theme-error);
      }

      > legend {
        display: flex;
        align-items: center;
        gap: 0.5em;
        font-size: 1.5em;
      }

      nav {
        margin-top: 1em;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.25em;
      }

      .content {
        display: flex;
        flex-direction: column;
        padding-top: 1em;
        gap: 1em;

        :global(.text-input),
        :global(.select-input) {
          border: none;
          background-color: rgba(244, 244, 244, 0.7);
        }

        :global(.select-input .mdc-select__anchor) {
          background-color: white;
        }

        :global(.text-input > legend),
        :global(.text-area-input > legend),
        :global(.select-input > legend) {
          font-size: 1.2em;
          background-color: white;
          border-radius: 0.25em;
          padding: 0 0.25em;
        }
      }

      .tab-container {
        display: flex;
        align-items: center;
        position: relative;
        background-color: #f0f0f0;
        border-radius: var(--mdc-shape-medium, 4px) var(--mdc-shape-medium, 4px) 0 0;

        :global(svg) {
          margin: 10px;
        }

        &:hover {
          background-color: #f0f0f0;
          border-color: var(--mdc-theme-primary);
        }

        &.active {
          font-weight: bold;
          background-color: var(--primary-90);
        }

        &.invalid {
          box-shadow: inset 0 -2px 0 0 var(--mdc-theme-error);
        }
      }

      .tab {
        padding: 0.5rem 1rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        border-radius: 5px;
        transition: background-color 0.3s;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 200px;
        overflow: hidden;
      }
    }
  }
</style>
