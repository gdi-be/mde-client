<script lang="ts">
  import type { ColumnInfo } from '$lib/models/metadata';
  import SelectInput from '$lib/components/Form/Inputs/SelectInput.svelte';
  import type { Option } from '$lib/models/form';
  import { MetadataService } from '$lib/services/MetadataService';
  import { getHighestRole } from '$lib/util';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';
  const t = $derived(page.data.t);

  export type ServiceTypeProps = {
    value?: ColumnInfo['type'];
    onChange: (newValue: string) => Promise<Response>;
  };

  let { value, onChange }: ServiceTypeProps = $props();
  let localValue = $state(value);
  $effect(() => {
    localValue = value;
  });
  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const fieldVisible = $derived(['MdeEditor', 'MdeAdministrator'].includes(highestRole));

  const HELP_KEY = 'isoMetadata.services.featureTypes.columns.type';
  const fieldConfig = MetadataService.getFieldConfig(66);
  const validationResult = $derived(fieldConfig?.validator(localValue));
  let showCheckmark = $state(false);

  const options: Option[] = [
    { key: 'BigDecimal', label: 'BigDecimal' },
    { key: 'Boolean', label: 'Boolean' },
    { key: 'Date', label: 'Date' },
    { key: 'Double', label: 'Double' },
    { key: 'Float', label: 'Float' },
    { key: 'Geometry', label: 'Geometry' },
    { key: 'Integer', label: 'Integer' },
    { key: 'Link', label: 'Link' },
    { key: 'Long', label: 'Long' },
    { key: 'Short', label: 'Short' },
    { key: 'Text', label: 'Text' },
    { key: 'Timestamp', label: 'Timestamp' }
  ];
</script>

{#if fieldVisible}
  <div class="attribute-type-field">
    <SelectInput
      label={t('66_AttributeDatatype.label')}
      {fieldConfig}
      {validationResult}
      value={localValue}
      {options}
      onChange={async (newValue) => {
        const typedValue = newValue as ColumnInfo['type'];
        localValue = typedValue;
        if (!typedValue) return;
        if (fieldConfig?.validator(typedValue).valid === false) return;
        const response = await onChange(typedValue);
        if (response.ok) {
          showCheckmark = true;
        }
      }}
    />
    <FieldTools {value} key={HELP_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
