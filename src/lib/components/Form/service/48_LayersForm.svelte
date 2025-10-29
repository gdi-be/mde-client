<script lang="ts">
  import IconButton from '@smui/icon-button';
  import type { Layer, Service } from '$lib/models/metadata';
  import LayerName_50 from './Field/50_LayerName.svelte';
  import LayerTitle_49 from './Field/49_LayerTitle.svelte';
  import LayerStyleName_51 from './Field/51_LayerStyleName.svelte';
  import LayerStyleTitle_52 from './Field/52_LayerStyleTitle.svelte';
  import LayerLegendImage_53 from './Field/53_LayerLegendImage.svelte';
  import LayerDescription_54 from './Field/54_LayerDescription.svelte';
  import LayerDatasource_55 from './Field/55_LayerDatasource.svelte';
  import LayerSecondaryDatasource_68 from './Field/68_LayerSecondaryDatasource.svelte';
  import FieldHint from '../FieldHint.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContext.svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';

  type Tab = {
    name: string;
  };

  export type LayersFormProps = {
    value?: Layer[];
    service?: Service;
    onChange: (layers: Layer[]) => Promise<Response>;
  };

  let { value: initialLayers, service, onChange }: LayersFormProps = $props();
  const serviceId = $derived(service?.serviceIdentification);

  let layers = $state<Layer[]>([]);
  let tabs = $derived<Tab[]>(
    layers.map((layer) => {
      return {
        name: layer.title || 'Unbekannter Layer'
      };
    })
  );
  let activeTabIndex: number | undefined = $state();
  let activeLayer = $derived(activeTabIndex ? layers[activeTabIndex] : layers[0]);

  const fieldConfig = getFieldConfig(48);
  const validationResult = $derived(
    fieldConfig?.validator(layers, {
      PARENT_VALUE: service
    })
  );

  $effect(() => {
    // if the serviceId changes set activeTabIndex to undefined
    if (serviceId) {
      activeTabIndex = undefined;
    }
  });

  $effect(() => {
    layers = initialLayers || [];
  });

  function addLayer() {
    const name = String.fromCharCode(97 + layers.length);
    layers = [
      ...layers,
      {
        name,
        title: name,
        styleName: name + '_DefaultStyle'
      }
    ];
    activeTabIndex = layers.length - 1;
    onChange(layers);
  }

  function removeLayer(index: number, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        layers = layers.filter((_, i) => i !== index);
        if (activeTabIndex === index) {
          activeTabIndex = layers.length - 1;
        }
        onChange(layers);
        activeTabIndex = layers.length > 0 ? activeTabIndex : undefined;
        if (activeTabIndex && activeTabIndex > layers.length - 1) {
          activeTabIndex = 0;
        }
      },
      {
        text: 'Sind sie sicher, dass sie diesen Layer löschen möchten?',
        confirmButtonText: 'Löschen'
      }
    );
  }

  function set(key: string, value: Layer[keyof Layer]) {
    layers = layers.map((column, i) => {
      if (i === activeTabIndex) {
        return {
          ...column,
          [key]: value
        };
      }
      return column;
    });
    return onChange(layers);
  }
</script>

<fieldset class="layers-form">
  <legend>{fieldConfig?.label || 'Layers'} </legend>
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
          onclick={(evt) => removeLayer(i, evt)}
          size="button"
          title="Layer entfernen"
        >
          delete
        </IconButton>
      </div>
    {/each}
    <IconButton
      class="material-icons"
      onclick={(evt) => {
        evt.preventDefault();
        addLayer();
      }}
      size="button"
      title="Layer hinzufügen"
    >
      add
    </IconButton>
  </nav>
  <div class="content">
    {#if activeTabIndex !== undefined}
      <LayerTitle_49 value={activeLayer?.title} onChange={(title) => set('title', title)} />
      <LayerName_50 value={activeLayer?.name} onChange={(name) => set('name', name)} />
      <LayerStyleTitle_52
        value={activeLayer?.styleTitle}
        onChange={(styleTitle) => set('styleTitle', styleTitle)}
      />
      <LayerStyleName_51
        value={activeLayer?.styleName}
        onChange={(styleName) => set('styleName', styleName)}
      />
      <LayerLegendImage_53
        value={activeLayer?.legendImage}
        onChange={(legendImage) => set('legendImage', legendImage)}
      />
      <LayerDescription_54
        value={activeLayer?.shortDescription}
        onChange={(shortDescription) => set('shortDescription', shortDescription)}
      />
      <LayerDatasource_55
        value={activeLayer?.datasource}
        onChange={(datasource) => set('datasource', datasource)}
      />
      <LayerSecondaryDatasource_68
        value={activeLayer?.secondaryDatasource}
        onChange={(secondaryDatasource) => set('secondaryDatasource', secondaryDatasource)}
      />
    {/if}
  </div>
</fieldset>

<style lang="scss">
  fieldset.layers-form {
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
      :global(.select-input),
      :global(.text-area-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.select-input .mdc-select__anchor) {
        background-color: white;
      }

      :global(.text-input > legend),
      :global(.select-input > legend),
      :global(.text-area-input > legend) {
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
