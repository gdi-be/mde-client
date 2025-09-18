<script lang="ts">
  import type { Service, ServiceType } from '$lib/models/metadata';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';

  export type ServiceTypeProps = {
    value: Service['serviceType'];
    onChange: (newValue: ServiceType) => Promise<Response>;
  };
  let { value, onChange }: ServiceTypeProps = $props();

  const fieldConfig = getFieldConfig(58);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);
  const HELP_KEY = 'isoMetadata.services.type';
  console.log(value);
</script>

<div class="service-type-field">
  <SelectInput
    label="Typ"
    {value}
    {fieldConfig}
    {validationResult}
    options={[
      {
        key: 'ATOM',
        label: '📥 ATOM'
      },
      {
        key: 'WFS',
        label: '📥 WFS'
      },
      {
        key: 'WMS',
        label: '🌎 WMS'
      },
      {
        key: 'WMTS',
        label: '🌎 WMTS'
      }
    ]}
    onChange={async (value) => {
      const response = await onChange(value as ServiceType);
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
