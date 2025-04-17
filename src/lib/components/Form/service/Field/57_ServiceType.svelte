<script lang="ts">
  import type { Service } from '$lib/models/metadata';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';

  export type ServiceTypeProps = {
    value: Service['serviceType'];
    onChange: (newValue: string) => void;
  };
  let { value, onChange }: ServiceTypeProps = $props();

  const fieldConfig = getSubFieldConfig('isoMetadata.services', 'type');
  const HELP_KEY = 'isoMetadata.services.type';
</script>

<div class="service-type-field">
  <SelectInput
    label="Typ"
    {value}
    {fieldConfig}
    options={[
      {
        key: 'ATOM',
        label: '🗃️ ATOM'
      },
      {
        key: 'WFS',
        label: '🗃️ WFS'
      },
      {
        key: 'WMS',
        label: '🗺️ WMS'
      },
      {
        key: 'WMTS',
        label: '🗺️ WMTS'
      }
    ]}
    {onChange}
  />
  <FieldTools key={HELP_KEY} noCheckmark />
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
