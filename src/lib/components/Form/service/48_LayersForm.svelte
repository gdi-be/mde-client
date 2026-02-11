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
  import { getPopconfirm } from '$lib/context/PopConfirmContext.svelte';
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '../FieldTools.svelte';
  import { page } from '$app/state';
  import { validateLayers } from './validation';
  import { MetadataService } from '$lib/services/MetadataService';
  const t = $derived(page.data.t);

  type Tab = {
    name: string;
    id: string;
  };

  export type LayersFormProps = {
    value?: Layer[];
    service?: Service;
    onChange: (layers: Layer[]) => Promise<Response>;
  };

  let { value: initialLayers, service, onChange }: LayersFormProps = $props();
  const serviceId = $derived(service?.serviceIdentification);

  const popconfirm = $derived(getPopconfirm());
  const { formState } = getFormContext();
  const metadata = $derived(formState.metadata!);
  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  let layers = $state<Layer[]>([]);
  let tabs = $derived<Tab[]>(
    layers.map((layer) => {
      return {
        id: layer.id,
        name: layer.title || 'Unbekannter Layer'
      };
    })
  );
  let activeTabId: string | undefined = $state();
  let activeLayer = $derived(layers.find((layer) => layer.id === activeTabId));

  const fieldConfig = MetadataService.getFieldConfig(48);
  const validationResult = $derived(
    fieldConfig?.validator(layers, {
      PARENT_VALUE: service
    })
  );

  const invalidTabIds = $derived(validateLayers(layers, { metadata, HIGHEST_ROLE: highestRole }));
  const isInvalid = $derived(layers.length === 0 || invalidTabIds.size > 0);

  $effect(() => {
    // if the serviceId changes set activeTabIndex to undefined
    if (serviceId) {
      activeTabId = undefined;
    }
  });

  $effect(() => {
    layers = initialLayers || [];
  });

  function addLayer() {
    const id = crypto.randomUUID();
    layers = [
      ...layers,
      {
        id,
        name: '',
        title: '',
        styleName: ''
      }
    ];
    activeTabId = id;
    onChange(layers);
  }

  function removeLayer(layerId: string, evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm.open(
      targetEl,
      async () => {
        layers = layers.filter((layer) => layer.id !== layerId);
        if (activeTabId === layerId) {
          activeTabId = layers.length > 0 ? layers[layers.length - 1]?.id : undefined;
        }
        onChange(layers);
        activeTabId = layers.length > 0 ? activeTabId : undefined;
        if (activeTabId && !layers.find((layer) => layer.id === activeTabId)) {
          activeTabId = layers[0]?.id;
        }
      },
      {
        text: 'Sind sie sicher, dass sie diesen Layer löschen möchten?',
        confirmButtonText: 'Löschen'
      }
    );
  }

  function set(key: string, value: Layer[keyof Layer]) {
    layers = layers.map((layer) => {
      if (layer.id === activeTabId) {
        return {
          ...layer,
          [key]: value
        };
      }
      return layer;
    });
    return onChange(layers);
  }
</script>

<div class="layers-form">
  <fieldset class={[isInvalid && 'invalid']}>
    <legend>{t('48_LayersForm.label')} </legend>
    <FieldHint {fieldConfig} {validationResult} />
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
            onclick={(evt) => removeLayer(tab.id, evt)}
            size="button"
            title="Layer entfernen"
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
          addLayer();
        }}
        size="button"
        title="Layer hinzufügen"
        type="button"
      >
        add
      </IconButton>
    </nav>
    <div class="content">
      {#if activeTabId && activeLayer}
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
  {#if fieldConfig?.key}
    <FieldTools noCopyButton key={fieldConfig.key} />
  {/if}
</div>

<style lang="scss">
  div.layers-form {
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
