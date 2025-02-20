<script lang="ts">
  import type { Service } from '$lib/models/metadata';
  import { setNestedValue } from '../../../util';
  import ServiceType_57 from './Field/ServiceType_57.svelte';
  import ServiceTitle_58 from './Field/ServiceTitle_58.svelte';
  import ServiceShortDescription_59 from './Field/ServiceShortDescription_59.svelte';
  import ServiceLegendImage_53 from './Field/ServiceLegendImage_53.svelte';

  export type ServiceFormProps = {
    service: Service;
    onChange?: (service: Service) => void;
  };

  let { service, onChange = () => {} }: ServiceFormProps = $props();

  // let isDownloadService = $derived(service.serviceType === 'WFS' || service.serviceType === 'ATOM');
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
</div>

<style lang="scss">
  .service-form {
    display: flex;
    flex-direction: column;
    gap: 1em;

    :global(label.mdc-text-field),
    :global(.select-input) {
      width: 100%;
    }
  }
</style>
