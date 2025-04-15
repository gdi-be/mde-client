<script lang="ts">
  import type { ColumnInfo } from '$lib/models/metadata';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';
  import type { Option } from '$lib/models/form';

  export type ServiceTypeProps = {
    value?: ColumnInfo['type'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();

  const options: Option[] = [
    { key: 'BigDecimal', label: 'BigDecimal' },
    { key: 'Date', label: 'Date' },
    { key: 'Double', label: 'Double' },
    { key: 'Float', label: 'Float' },
    { key: 'Geometry', label: 'Geometry' },
    { key: 'Integer', label: 'Integer' },
    { key: 'Link', label: 'Link' },
    { key: 'Long', label: 'Long' },
    { key: 'Text', label: 'Text' },
    { key: 'Short', label: 'Short' },
    { key: 'Timestamp', label: 'Timestamp' }
  ];
</script>

<SelectInput key="type" label="Attribut-Datentyp" {value} {options} {onChange} />
