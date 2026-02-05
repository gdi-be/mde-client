<script lang="ts">
  import type { ColumnInfo, FeatureType } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import AttributeName_64 from './Field/64_AttributeName.svelte';
  import AttributeAlias_65 from './Field/65_AttributeAlias.svelte';
  import AttributeDatatype_66 from './Field/66_AttributeDatatype.svelte';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import { getPopconfirm } from '$lib/context/PopConfirmContext.svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import { page } from '$app/state';
  import { validateColumns } from './validation';
  const t = $derived(page.data.t);

  type Tab = {
    id: string;
    name: string;
  };

  export type ColumnsFormProps = {
    featureType: FeatureType;
    value?: ColumnInfo[];
    onChange: (columns: ColumnInfo[]) => Promise<Response>;
  };

  let { value: initialColumns, onChange, featureType }: ColumnsFormProps = $props();
  const featureTypeName = $derived(featureType?.name);

  const popconfirm = $derived(getPopconfirm());

  let columns = $state<ColumnInfo[]>([]);
  let tabs = $derived<Tab[]>(
    columns.map((column) => {
      return {
        id: column.id,
        name: column.name || 'Unbekanntes Attribut'
      };
    })
  );
  let activeTabId: string | undefined = $state(undefined);
  let activeColumn = $derived(columns.find((column) => column.id === activeTabId));

  const fieldConfig = getFieldConfig(63);
  const validationResult = $derived(fieldConfig?.validator(columns));

  const invalidTabIds = $derived(validateColumns(columns));

  $effect(() => {
    // if the featureType changes set activeTabIndex to undefined
    if (featureTypeName) {
      activeTabId = undefined;
    }
  });

  $effect(() => {
    columns = initialColumns || [];
  });

  function addColumn() {
    const id = crypto.randomUUID();
    columns = [
      ...columns,
      {
        id,
        name: '',
        alias: ''
      }
    ];
    activeTabId = id;
    onChange(columns);
  }

  function removeColumn(id: string, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm.open(
      targetEl,
      async () => {
        columns = columns.filter((column) => column.id !== id);
        if (activeTabId === id) {
          activeTabId = columns.length > 0 ? columns[0].id : undefined;
        }
        onChange(columns);
        activeTabId = columns.length > 0 ? activeTabId : undefined;
        if (activeTabId && !columns.find((column) => column.id === activeTabId)) {
          activeTabId = columns[0]?.id;
        }
      },
      {
        text: 'Sind sie sicher, dass sie dieses Attribut löschen möchten?',
        confirmButtonText: 'Löschen'
      }
    );
  }

  function set(key: string, value: ColumnInfo[keyof ColumnInfo]) {
    columns = columns.map((column) => {
      if (column.id === activeTabId) {
        return {
          ...column,
          [key]: value
        };
      }
      return column;
    });
    return onChange(columns);
  }
</script>

<div class="columns-form">
  <fieldset class={[invalidTabIds.size > 0 && 'invalid']}>
    <legend>{t('63_ColumnsForm.label')}</legend>
    <FieldHint {fieldConfig} {validationResult} explanation={t('63_ColumnsForm.explanation')} />
    <nav>
      {#each tabs as tab}
        <div
          class={[
            'tab-container',
            activeTabId === tab.id && 'active',
            invalidTabIds.has(tab.id) && 'invalid'
          ]}
        >
          <button
            type="button"
            id={tab.id}
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
            onclick={(evt) => removeColumn(tab.id, evt)}
            size="button"
            title="Attribut entfernen"
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
          addColumn();
        }}
        size="button"
        title="Attribut hinzufügen"
        type="button"
      >
        add
      </IconButton>
    </nav>
    <div class="content">
      {#if activeTabId && activeColumn}
        <AttributeName_64 value={activeColumn?.name} onChange={(name) => set('name', name)} />
        <AttributeAlias_65 value={activeColumn?.alias} onChange={(alias) => set('alias', alias)} />
        <AttributeDatatype_66 value={activeColumn?.type} onChange={(type) => set('type', type)} />
      {/if}
    </div>
  </fieldset>
  {#if fieldConfig?.key}
    <FieldTools noCopyButton key={fieldConfig.key} />
  {/if}
</div>

<style lang="scss">
  div.columns-form {
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
