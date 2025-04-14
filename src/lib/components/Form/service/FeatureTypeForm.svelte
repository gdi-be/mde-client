<script lang="ts">
  import IconButton from '@smui/icon-button';
  import Checkmark from '../Checkmark.svelte';
  import ColumnsForm from './ColumnsForm.svelte';
  import type { FeatureType } from '$lib/models/metadata';
  import FeatureTypeTitle_61 from './Field/FeatureTypeTitle_61.svelte';
  import FeatureTypeName_62 from './Field/FeatureTypeName_62.svelte';

  type Tab = {
    name: string;
  };

  export type ColumnsFormProps = {
    value?: FeatureType[];
    onChange?: (featureTypes: FeatureType[]) => void;
  };

  let { value: initialColumns, onChange = () => {} }: ColumnsFormProps = $props();

  let featureTypes = $state(initialColumns || []);
  let tabs = $derived<Tab[]>(
    featureTypes.map((column) => {
      return {
        name: column.name || 'Unbekannter Featuretype'
      };
    })
  );

  let activeTabIndex: number | undefined = $state(initialColumns?.length ? 0 : undefined);
  let activeFeatureType = $derived(activeTabIndex ? featureTypes[activeTabIndex] : featureTypes[0]);
  let visibleCheckmarks = $state<Record<string, boolean>>({});

  function addFeatureType() {
    const name = 'Neuer Featuretype' + featureTypes.length;
    featureTypes = [
      ...featureTypes,
      {
        name,
        title: name,
        columns: []
      }
    ];
    activeTabIndex = featureTypes.length - 1;
  }

  function removeColumn(index: number) {
    featureTypes = featureTypes.filter((_, i) => i !== index);
    if (activeTabIndex === index) {
      activeTabIndex = featureTypes.length - 1;
    }
    onChange(featureTypes);
    activeTabIndex = featureTypes.length > 0 ? activeTabIndex : undefined;
  }

  function set(key: string, value: FeatureType[keyof FeatureType]) {
    featureTypes = featureTypes.map((column, i) => {
      if (i === activeTabIndex) {
        return {
          ...column,
          [key]: value
        };
      }
      return column;
    });
    onChange(featureTypes);
  }
</script>

<fieldset class="columns-form">
  <legend>Featuretypes</legend>
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
          onclick={() => removeColumn(i)}
          size="button"
          title="Featuretype entfernen"
        >
          delete
        </IconButton>
      </div>
    {/each}
    <IconButton
      class="material-icons"
      onclick={() => addFeatureType()}
      size="button"
      title="Featuretype hinzufügen"
    >
      add
    </IconButton>
  </nav>
  <div class="content">
    {#if activeTabIndex !== undefined}
      <FeatureTypeName_62 value={activeFeatureType?.name} onChange={(name) => set('name', name)} />
      <FeatureTypeTitle_61 value={activeFeatureType?.title} onChange={(title) => set('title', title)} />
      <ColumnsForm
        value={activeFeatureType.columns}
        onChange={(columns) => set('columns', columns)}
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
