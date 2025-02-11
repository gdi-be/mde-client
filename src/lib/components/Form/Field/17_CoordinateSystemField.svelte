<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'isoMetadata.crs';
  const LABEL = 'Koordinatensystem';

  const OPTIONS = [{
    key: 'http://www.opengis.net/def/crs/EPSG/0/25833',
    label: 'EPSG:25833'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/3857',
    label: 'EPSG:3857'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/4258',
    label: 'EPSG:4258'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/25832',
    label: 'EPSG:25832'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/4326',
    label: 'EPSG:4326'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/3035',
    label: 'EPSG:3035'
  }];

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue || '');
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onSelectionChange = async () => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="title-field">
  <Paper>
    <SelectInput
      {value}
      key={KEY}
      label={LABEL}
      options={OPTIONS}
      onChange={onSelectionChange}
      {validationResult}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
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
