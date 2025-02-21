<script lang="ts">
  import Paper from '@smui/paper';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import type { ValidationResult } from '../FieldsConfig';

  const KEY = 'isoMetadata.crs';

  const OPTIONS = [
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/25833',
      label: 'EPSG:25833'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/3857',
      label: 'EPSG:3857'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/4258',
      label: 'EPSG:4258'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/25832',
      label: 'EPSG:25832'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/4326',
      label: 'EPSG:4326'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/3035',
      label: 'EPSG:3035'
    }
  ];

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onSelectionChange = async () => {
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="title-field">
  <Paper>
    <SelectInput
      {value}
      key={KEY}
      label={fieldConfig?.label}
      options={OPTIONS}
      onChange={onSelectionChange}
      {validationResult}
    />
  </Paper>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
