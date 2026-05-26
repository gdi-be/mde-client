<script lang="ts">
  import { getContext } from 'svelte';
  import type { Layer, Service, ServiceType } from '$lib/models/metadata';
  import { setNestedValue } from '$lib/util';
  import ServiceWorkspace_45 from './Field/45_ServiceWorkspace.svelte';
  import ServicePreview_46 from './Field/46_ServicePreview.svelte';
  import ServiceLegendImage_47 from './Field/47_ServiceLegendImage.svelte';
  import ServiceType_58 from './Field/58_ServiceType.svelte';
  import ServiceTitle_59 from './Field/59_ServiceTitle.svelte';
  import ServiceShortDescription_60 from './Field/60_ServiceShortDescription.svelte';
  import FeatureTypeForm_56 from './56_FeatureTypeForm.svelte';
  import LayersForm_48 from './48_LayersForm.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import {
    FORMSTATE_CONTEXT,
    getFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import { page } from '$app/state';
  import { toast } from 'svelte-french-toast';
  import { invalidateAll } from '$app/navigation';
  import { logger } from 'loggisch';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';

  const t = $derived(page.data.t);

  export type ServiceFormProps = {
    service: Service;
    onChange: (service: Service, persist?: boolean) => Promise<Response>;
  };

  let { service, onChange }: ServiceFormProps = $props();

  const { getValue } = getFormContext();
  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);
  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

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
      if (layers && layers[service.serviceIdentification]) {
        delete layers[service.serviceIdentification];
        await MetadataService.persistValue('clientMetadata.layers', layers);
      }
    } else if (layers?.[service.serviceIdentification] === undefined) {
      // Initialize layers array for the service to allow correct validation / progress calculation
      if (!layers) {
        layers = {};
      }
      layers[service.serviceIdentification] = [];
      await MetadataService.persistValue('clientMetadata.layers', layers);
    }
    if (serviceType !== 'WFS') {
      // Remove feature types associated with the service
      delete service.featureTypes;
    }
    return onChange(service, true);
  }

  async function set<K extends keyof Service>(key: K, value: Service[K]) {
    service = setNestedValue(service, key, value);
    const response = await onChange(service, shouldPersistFieldValue(key, value));
    if (response.ok) {
      if (key === 'serviceType') {
        onServiceTypeChange(value as ServiceType);
      } else if (key === 'legendImage') {
        // legend sizes are determined and returned in the backend
        const json = await response.json();
        const oldLegendImage = service.legendImage;
        const newLegendImage = json.isoMetadata.services?.find(
          (s: Service) => s.serviceIdentification === service.serviceIdentification
        )?.legendImage;
        if (newLegendImage && JSON.stringify(oldLegendImage) !== JSON.stringify(newLegendImage)) {
          logger.info(t('serviceform.legend_autoupdate_info'));
          service = setNestedValue(service, 'legendImage', newLegendImage);
        }
      }
      await invalidateAll();
    }
    return response;
  }

  const shouldPersistFieldValue = <K extends keyof Service>(key: K, value: Service[K]) => {
    if (key === 'workspace') {
      const fieldConfig = MetadataService.getFieldConfig<string>(45);
      return fieldConfig?.validator(value as Service['workspace'], {
        ['PARENT_VALUE']: service,
        ['HIGHEST_ROLE']: highestRole
      }).valid;
    }
    if (key === 'preview') {
      const fieldConfig = MetadataService.getFieldConfig<string>(46);
      return fieldConfig?.validator(value as Service['preview'], {
        ['PARENT_VALUE']: service
      }).valid;
    }
    if (key === 'title') {
      const fieldConfig = MetadataService.getFieldConfig<string>(59);
      return fieldConfig?.validator(value as Service['title']).valid;
    }
    if (key === 'shortDescription') {
      const fieldConfig = MetadataService.getFieldConfig<string>(60);
      return fieldConfig?.validator(value as Service['shortDescription']).valid;
    }
    if (key === 'featureTypes') {
      const fieldConfig = MetadataService.getFieldConfig<Service['featureTypes']>(56);
      return fieldConfig?.validator(value as Service['featureTypes'], {
        ['PARENT_VALUE']: service
      }).valid;
    }
    if (key === 'serviceType') {
      const fieldConfig = MetadataService.getFieldConfig<ServiceType>(58);
      return fieldConfig?.validator(value as Service['serviceType']).valid;
    }

    return true;
  };

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
      toast.error(t('serviceform.layer_update_error', { statusText: response.statusText }));
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
    <LayersForm_48 {service} value={layers} onChange={onLayersChange} />
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
