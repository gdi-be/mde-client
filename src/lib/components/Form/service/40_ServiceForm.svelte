<script lang="ts">
  import type { Layer, Service, ServiceType } from '$lib/models/metadata';
  import { setNestedValue } from '$lib/util';
  import ServiceWorkspace_45 from './Field/45_ServiceWorkspace.svelte';
  import ServicePreview_46 from './Field/46_ServicePreview.svelte';
  import ServiceLegendImage_47 from './Field/47_ServiceLegendImage.svelte';
  import ServiceType_58 from './Field/58_ServiceType.svelte';
  import ServiceTitle_59 from './Field/59_ServiceTitle.svelte';
  import ServiceShortDescription_60 from './Field/60_ServiceShortDescription.svelte';
  import FeatureTypeForm_56 from './56_FeatureTypeForm.svelte';
  import { getContext } from 'svelte';
  import {
    FORMSTATE_CONTEXT,
    getValue,
    persistValue,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import LayersForm from './48_LayersForm.svelte';
  import { page } from '$app/state';
  import { toast } from 'svelte-french-toast';
  import { invalidateAll } from '$app/navigation';

  export type ServiceFormProps = {
    service: Service;
    onChange: (service: Service) => Promise<Response>;
  };

  let { service, onChange }: ServiceFormProps = $props();

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);

  const layers = $derived.by((): Layer[] => {
    const layersMap: Record<string, Layer[]> = metadata?.clientMetadata?.layers;
    const serviceIdentification = service?.serviceIdentification;
    if (!layersMap || !serviceIdentification) {
      return [];
    }
    return layersMap[serviceIdentification] || [];
  });

  let isWFSService = $derived(service.serviceType === 'WFS');
  let isMappingService = $derived(service.serviceType === 'WMS' || service.serviceType === 'WMTS');

  async function onServiceTypeChange(serviceType: ServiceType): Promise<Response> {
    service = setNestedValue(service, 'serviceType', serviceType);
    let layers = getValue<Record<string, Service[]>>('clientMetadata.layers');
    if (serviceType !== 'WMS' && serviceType !== 'WMTS') {
      // Remove layers associated with the service
      const id = service.serviceIdentification;
      if (layers && layers[id]) {
        delete layers[id];
        await persistValue('clientMetadata.layers', layers);
      }
    } else if (layers?.[service.serviceIdentification] === undefined) {
      // Initialize layers array for the service to allow correct validation / progress calculation
      if (!layers) {
        layers = {};
      }
      layers[service.serviceIdentification] = [];
      await persistValue('clientMetadata.layers', layers);
    }
    if (serviceType !== 'WFS') {
      // Remove feature types associated with the service
      delete service.featureTypes;
    }
    return onChange(service);
  }

  async function set(key: string, value: Service[keyof Service]) {
    service = setNestedValue(service, key, value);

    const response = await onChange(service);
    if (response.ok) {
      if (key === 'serviceType') {
        onServiceTypeChange(value as ServiceType);
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
      await invalidateAll();
    }
    return response;
  }

  async function onLayersChange(layers: Layer[]) {
    const serviceIdentification = service?.serviceIdentification;
    if (!serviceIdentification) return Promise.reject('Service identification is missing');

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
      toast.error(`Fehler beim aktualisieren der Layer: ${response.statusText}`);
    }
    invalidateAll();
    return response;
  }
</script>

<div class="service-form">
  <ServiceType_58 value={service.serviceType} onChange={onServiceTypeChange} />
  <ServiceTitle_59 value={service.title} onChange={(title) => set('title', title)} />
  <ServiceShortDescription_60
    value={service.shortDescription}
    onChange={(shortDescription) => set('shortDescription', shortDescription)}
  />
  <ServiceWorkspace_45
    value={service.workspace}
    {service}
    onChange={(workspace) => set('workspace', workspace)}
  />
  <ServicePreview_46
    value={service.preview}
    {service}
    onChange={(preview) => set('preview', preview)}
  />
  {#if isMappingService}
    <ServiceLegendImage_47
      value={service.legendImage}
      onChange={(legendImage) => set('legendImage', legendImage)}
    />
    <LayersForm {service} value={layers} onChange={onLayersChange} />
  {/if}
  {#if isWFSService}
    <FeatureTypeForm_56
      {service}
      value={service.featureTypes}
      onChange={(featureTypes) => set('featureTypes', featureTypes)}
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
