<script lang="ts">
  import type { Service } from '$lib/models/metadata';
  import { setNestedValue } from '../../../util';
  import ServiceType_57 from './Field/ServiceType_57.svelte';
  import ServiceTitle_58 from './Field/ServiceTitle_58.svelte';
  import ServiceShortDescription_59 from './Field/ServiceShortDescription_59.svelte';
  import ServiceLegendImage_53 from './Field/ServiceLegendImage_53.svelte';
  import ColumnsForm from './ColumnsForm.svelte';
  import DownloadForm from './DownloadForm.svelte';

  export type ServiceFormProps = {
    service: Service;
    onChange?: (service: Service) => void;
  };

  let { service, onChange = () => {} }: ServiceFormProps = $props();

  let isWFSService = $derived(service.serviceType === 'WFS');
  let isAtomService = $derived(service.serviceType === 'ATOM');
  let isDisplayService = $derived(service.serviceType === 'WMS' || service.serviceType === 'WMTS');

  function set(key: string, value: Service[keyof Service]) {
    service = setNestedValue(service, key, value);
    onChange(service);
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
  {#if isDisplayService}
    <ServiceLegendImage_53
      value={service.legendImage}
      onChange={(legendImage) => set('legendImage', legendImage)}
    />
  {/if}
  {#if isWFSService}
    <ColumnsForm
      value={service.columns}
      onChange={(columns) => set('columns', columns)}
    />
  {/if}
  {#if isAtomService}
    <DownloadForm
      value={service.downloads}
      onChange={(downloads) => set('downloads', downloads)}
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
