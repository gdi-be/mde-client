<script lang="ts">
  import type { Layer, Service } from '$lib/models/metadata';
  import { setNestedValue } from '$lib/util';
  import ServiceId_45 from './Field/45_ServiceId.svelte';
  import ServicePreview_46 from './Field/46_ServicePreview.svelte';
  import ServiceType_57 from './Field/57_ServiceType.svelte';
  import ServiceTitle_58 from './Field/58_ServiceTitle.svelte';
  import ServiceShortDescription_59 from './Field/59_ServiceShortDescription.svelte';
  import ServiceLegendImage_53 from './Field/53_ServiceLegendImage.svelte';
  import DownloadForm from './DownloadForm.svelte';
  import FeatureTypeForm from './FeatureTypeForm.svelte';
  import { getContext } from 'svelte';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import LayersForm from './LayersForm.svelte';
  import { page } from '$app/state';

  export type ServiceFormProps = {
    service: Service;
    onChange?: (service: Service) => Promise<Response>;
  };

  let { service, onChange }: ServiceFormProps = $props();

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);
  let layerCheckmarkVisible = $state<boolean>(false);
  let featureTypeCheckmarkVisible = $state<boolean>(false);
  let downloadCheckmarkVisible = $state<boolean>(false);

  const layers = $derived.by((): Layer[] => {
    const layersMap = metadata?.clientMetadata?.layers;
    const serviceIdentification = service?.serviceIdentification;
    if (!layersMap || !serviceIdentification) {
      return [];
    }
    return layersMap[serviceIdentification] || [];
  });

  let isWFSService = $derived(service.serviceType === 'WFS');
  let isAtomService = $derived(service.serviceType === 'ATOM');
  let isMappingService = $derived(service.serviceType === 'WMS' || service.serviceType === 'WMTS');

  async function set(key: string, value: Service[keyof Service]) {
    service = setNestedValue(service, key, value);

    if (onChange) {
      const response = await onChange(service);
      if (response.ok) {
        if (key === 'featureTypes') {
          featureTypeCheckmarkVisible = true;
        } else if (key === 'downloads') {
          downloadCheckmarkVisible = true;
        } else if (key === 'legendImage') {
          // legend sizes are determined and returned in the backend
          const json = await response.json();
          value = json.isoMetadata.services?.find(
            (s: Service) => s.serviceIdentification === service.serviceIdentification
          )?.legendImage;
          if (value) {
            service = setNestedValue(service, 'legendImage', value);
          }
        }
      }
    }
  }

  async function onLayersChange(layers: Layer[]) {
    const serviceIdentification = service?.serviceIdentification;
    if (!serviceIdentification) return;

    const response = await fetch(
      `${page.url.origin}${page.url.pathname}/updateLayers/${serviceIdentification}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          layers
        })
      }
    );

    if (!response.ok) {
      console.error('Error persisting layers:', response);
    }

    layerCheckmarkVisible = response.ok;
  }
</script>

<div class="service-form">
  <ServiceType_57
    value={service.serviceType}
    onChange={(serviceType) => set('serviceType', serviceType)}
  />
  <ServiceTitle_58 value={service.title} onChange={(title) => set('title', title)} />
  <ServiceShortDescription_59
    value={service.shortDescription}
    onChange={(shortDescription) => set('shortDescription', shortDescription)}
  />
  {#if isMappingService}
    <ServiceId_45
      value={service.serviceIdentification}
      onChange={(serviceIdentification) => set('serviceIdentification', serviceIdentification)}
    />
    <ServicePreview_46 value={service.preview} onChange={(preview) => set('preview', preview)} />
    <ServiceLegendImage_53
      value={service.legendImage}
      onChange={(legendImage) => set('legendImage', legendImage)}
    />
    <LayersForm
      value={layers}
      onChange={onLayersChange}
      bind:checkmarkVisible={layerCheckmarkVisible}
    />
  {/if}
  {#if isWFSService}
    <FeatureTypeForm
      value={service.featureTypes}
      onChange={(featureTypes) => set('featureTypes', featureTypes)}
      bind:checkmarkVisible={featureTypeCheckmarkVisible}
    />
  {/if}
  {#if isAtomService}
    <DownloadForm
      value={service.downloads}
      onChange={(downloads) => set('downloads', downloads)}
      bind:checkmarkVisible={downloadCheckmarkVisible}
    />
  {/if}
</div>

<style lang="scss">
  .service-form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>
