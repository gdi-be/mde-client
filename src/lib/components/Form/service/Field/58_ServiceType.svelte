<script lang="ts">
  import type { Service, ServiceType } from '$lib/models/metadata';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  export type ServiceTypeProps = {
    value: Service['serviceType'];
    onChange: (newValue: ServiceType) => Promise<Response>;
  };
  let { value, onChange }: ServiceTypeProps = $props();
  let localValue = $state(value);
  $effect(() => {
    localValue = value;
  });

  const fieldConfig = MetadataService.getFieldConfig(58);
  const validationResult = $derived(fieldConfig?.validator(localValue));
  let showCheckmark = $state(false);
  const HELP_KEY = 'isoMetadata.services.type';
</script>

<div class="service-type-field">
  <SelectInput
    label={t('58_ServiceType.label')}
    explanation={t('58_ServiceType.explanation')}
    value={localValue}
    {fieldConfig}
    {validationResult}
    options={[
      {
        key: 'ATOM',
        label: '📥 ' + t('58_ServiceType.atom')
      },
      {
        key: 'WFS',
        label: '📥 ' + t('58_ServiceType.wfs')
      },
      {
        key: 'WMS',
        label: '🌎 ' + t('58_ServiceType.wms')
      },
      {
        key: 'WMTS',
        label: '🌎 ' + t('58_ServiceType.wmts')
      }
    ]}
    onChange={async (value) => {
      const newValue = value as ServiceType;
      localValue = newValue;
      if (fieldConfig?.validator(newValue).valid === false) return;
      const response = await onChange(newValue);
      if (response.ok) {
        showCheckmark = true;
      }
    }}
  />
  <FieldTools {value} {fieldConfig} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .service-type-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.select-input) {
      flex: 1;
    }
  }
</style>
