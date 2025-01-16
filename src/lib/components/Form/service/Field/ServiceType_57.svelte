<script lang="ts">
  import type { Service } from "$lib/models/metadata";
  import Paper from "@smui/paper";
  import SelectInput from "../../Inputs/SelectInput.svelte";

  export type ServiceTypeProps = {
    value: Service["serviceType"]
    onChange: (newValue: string) => void
  };

  let {
    value,
    onChange
  }: ServiceTypeProps = $props();

</script>

<Paper>
  <SelectInput
    label="Typ"
    key="type"
    {value}
    options={[{
      key: 'ATOM',
      label: '🗃️ ATOM'
    }, {
      key: 'WFS',
      label: '🗃️ WFS'
    }, {
      key: 'WMS',
      label: '🗺️ WMS'
    }, {
      key: 'WMTS',
      label: '🗺️ WMTS'
    }]}
    onChange={onChange}
  />
</Paper>
