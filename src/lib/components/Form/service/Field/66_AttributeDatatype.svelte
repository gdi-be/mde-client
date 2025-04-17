<script lang="ts">
  import type { ColumnInfo } from '$lib/models/metadata';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';
  import type { Option } from '$lib/models/form';
  import { getSubFieldConfig } from '$lib/context/FormContext.svelte';
  import { getContext } from 'svelte';
  import type { Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';

  export type ServiceTypeProps = {
    value?: ColumnInfo['type'];
    onChange: (newValue: string) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();
  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));

  const fieldConfig = getSubFieldConfig(
    'isoMetadata.services',
    'featuretypes',
    'attributes',
    'type'
  );

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

{#if fieldVisible}
  <div class="attribute-type-field">
    <SelectInput label={fieldConfig?.label || 'Attribut-Datentyp'} {value} {options} {onChange} />
  </div>
{/if}

<style lang="scss">
  .attribute-type-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.select-input) {
      flex: 1;
    }
  }
</style>
