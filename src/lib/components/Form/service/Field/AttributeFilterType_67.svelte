<script lang="ts">
  import type { ColumnInfo } from '$lib/models/metadata';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';
  import type { Option } from '$lib/models/form';

  export type ServiceTypeProps = {
    value?: ColumnInfo['filterType'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();

  const options: Option[] = [
    { key: 'SelectBox', label: 'SelectBox' },
    { key: 'CatalogBox', label: 'CatalogBox' },
    { key: 'DoubleEditOrderField', label: 'DoubleEditOrderField' },
    { key: 'EditField', label: 'EditField' },
    { key: 'EditOrderField', label: 'EditOrderField' },
  ];
</script>

<SelectInput
  key="filter-type"
  label="Attribut-Datentyp"
  {value}
  {options}
  {onChange}
/>
