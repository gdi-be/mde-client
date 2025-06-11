<script lang="ts">
  import type { ColumnInfo } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import Checkmark from '../Checkmark.svelte';
  import AttributeName_64 from './Field/64_AttributeName.svelte';
  import AttributeAlias_65 from './Field/65_AttributeAlias.svelte';
  import AttributeDatatype_66 from './Field/66_AttributeDatatype.svelte';
  import AttributeFilterType_67 from './Field/67_AttributeFilterType.svelte';
  import { getSubFieldConfig } from '../../../context/FormContext.svelte';
  import FieldHint from '../FieldHint.svelte';
  import { popconfirm } from '../../../context/PopConfirmContex.svelte';

  type Tab = {
    name: string;
  };

  export type ColumnsFormProps = {
    value?: ColumnInfo[];
    onChange?: (columns: ColumnInfo[]) => void;
  };

  let { value, onChange = () => {} }: ColumnsFormProps = $props();

  let columns = $state<ColumnInfo[]>([]);
  let tabs = $derived<Tab[]>(
    columns.map((column) => {
      return {
        name: column.name || 'Unbekanntes Attribut'
      };
    })
  );

  $effect(() => {
    columns = value || [];
  });

  let activeTabIndex: number | undefined = $state(value?.length ? 0 : undefined);
  let activeColumn = $derived(activeTabIndex ? columns[activeTabIndex] : columns[0]);
  let visibleCheckmarks = $state<Record<string, boolean>>({});

  function addColumn() {
    const name = 'Neues Attribut' + columns.length;
    columns = [
      ...columns,
      {
        name,
        alias: name
      }
    ];
    activeTabIndex = columns.length - 1;
  }

  function removeColumn(index: number, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        columns = columns.filter((_, i) => i !== index);
        if (activeTabIndex === index) {
          activeTabIndex = columns.length - 1;
        }
        onChange(columns);
        activeTabIndex = columns.length > 0 ? activeTabIndex : undefined;
      },
      {
        text: 'Sind sie sicher, dass sie dieses Attribut löschen möchten?',
        confirmButtonText: 'Löschen'
      }
    );
  }

  function set(key: string, value: ColumnInfo[keyof ColumnInfo]) {
    columns = columns.map((column, i) => {
      if (i === activeTabIndex) {
        return {
          ...column,
          [key]: value
        };
      }
      return column;
    });
    onChange(columns);
  }
</script>

<fieldset class="columns-form">
  <legend>Attribute</legend>
  <FieldHint
    fieldConfig={getSubFieldConfig('isoMetadata.services', 'featuretypes', 'attributes')}
  />
  <nav>
    {#each tabs as tab, i}
      <div class="tab-container" class:active={activeTabIndex === i}>
        <button id={tab.name} class="tab" title={tab.name} onclick={() => (activeTabIndex = i)}>
          {tab.name}
        </button>
        {#if visibleCheckmarks[tab.name]}
          <Checkmark bind:running={visibleCheckmarks[tab.name]} />
        {/if}
        <IconButton
          class="material-icons"
          onclick={(evt) => removeColumn(i, evt)}
          size="button"
          title="Attribut entfernen"
        >
          delete
        </IconButton>
      </div>
    {/each}
    <IconButton
      class="material-icons"
      onclick={() => addColumn()}
      size="button"
      title="Attribut hinzufügen"
    >
      add
    </IconButton>
  </nav>
  <div class="content">
    {#if activeColumn}
      <AttributeName_64 value={activeColumn?.name} onChange={(name) => set('name', name)} />
      <AttributeAlias_65 value={activeColumn?.alias} onChange={(alias) => set('alias', alias)} />
      <AttributeDatatype_66 value={activeColumn?.type} onChange={(type) => set('type', type)} />
      <AttributeFilterType_67
        value={activeColumn?.filterType}
        onChange={(filterType) => set('filterType', filterType)}
      />
    {/if}
  </div>
</fieldset>

<style lang="scss">
  fieldset.columns-form {
    flex: 1;
    border-radius: 0.25em;

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
</style>
