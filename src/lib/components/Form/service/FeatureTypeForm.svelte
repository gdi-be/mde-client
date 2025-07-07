<script lang="ts">
  import IconButton from '@smui/icon-button';
  import ColumnsForm from './ColumnsForm.svelte';
  import type { FeatureType, Service } from '$lib/models/metadata';
  import FeatureTypeTitle_61 from './Field/62_FeatureTypeTitle.svelte';
  import FeatureTypeName_62 from './Field/63_FeatureTypeName.svelte';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';

  type Tab = {
    name: string;
  };

  export type FeatureTypeFormProps = {
    value?: FeatureType[];
    service: Service;
    onChange: (featureTypes: FeatureType[]) => Promise<Response>;
  };

  let { value: initialFeatureTypes, onChange, service }: FeatureTypeFormProps = $props();

  let featureTypes = $state<FeatureType[]>([]);
  let tabs = $derived<Tab[]>(
    featureTypes.map((featureType) => {
      return {
        name: featureType.title || 'Unbekannter Featuretype'
      };
    })
  );
  let activeTabIndex: number | undefined = $state();
  let activeFeatureType = $derived(activeTabIndex ? featureTypes[activeTabIndex] : featureTypes[0]);

  const fieldConfig = getFieldConfig(61);
  const validationResult = $derived(
    fieldConfig?.validator(featureTypes, { PARENT_VALUE: service })
  );

  $effect(() => {
    featureTypes = initialFeatureTypes || [];
  });

  function addFeatureType() {
    const name = String.fromCharCode(97 + featureTypes.length);
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

  function removeFeatureType(index: number, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        featureTypes = featureTypes.filter((_, i) => i !== index);
        if (activeTabIndex === index) {
          activeTabIndex = featureTypes.length - 1;
        }
        onChange(featureTypes);
        activeTabIndex = featureTypes.length > 0 ? activeTabIndex : undefined;
        if (activeTabIndex && activeTabIndex > featureTypes.length - 1) {
          activeTabIndex = 0;
        }
      },
      {
        text: 'Sind sie sicher, dass sie diesen FeatureType löschen möchten?',
        confirmButtonText: 'Löschen'
      }
    );
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
    return onChange(featureTypes);
  }
</script>

<fieldset class="featuretypes-form">
  <legend>
    {fieldConfig?.label}
  </legend>
  <FieldHint {fieldConfig} {validationResult} />
  <nav>
    {#each tabs as tab, i}
      <div class="tab-container" class:active={activeTabIndex === i}>
        <button
          id={tab.name}
          class="tab"
          title={tab.name}
          onclick={(evt) => {
            evt.preventDefault();
            activeTabIndex = i;
          }}
        >
          {tab.name}
        </button>
        <IconButton
          class="material-icons"
          onclick={(evt) => removeFeatureType(i, evt)}
          size="button"
          title="Featuretype entfernen"
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
    >
      add
    </IconButton>
  </nav>
  <div class="content">
    {#if activeTabIndex !== undefined}
      <FeatureTypeTitle_61
        value={activeFeatureType?.title}
        onChange={(title) => set('title', title)}
      />
      <FeatureTypeName_62 value={activeFeatureType?.name} onChange={(name) => set('name', name)} />
      <ColumnsForm
        value={activeFeatureType?.columns}
        onChange={(columns) => set('columns', columns)}
      />
    {/if}
  </div>
</fieldset>

<style lang="scss">
  fieldset.featuretypes-form {
    flex: 1;
    border-radius: 0.25em;

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
