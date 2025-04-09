<script lang="ts">
  import type { Service } from '$lib/models/metadata';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';

  export type ServiceTypeProps = {
    value: Service['serviceType'];
    onChange: (newValue: string) => void;
  };

  const KEY = 'isoMetadata.services.type';

  let { value, onChange }: ServiceTypeProps = $props();
</script>

<div class="service-type-field">
  <SelectInput
    label="Typ"
    key="type"
    {value}
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
  <FieldTools key={KEY} noCheckmark />
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
