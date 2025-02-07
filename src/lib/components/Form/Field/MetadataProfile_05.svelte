<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import type { MetadataProfile } from "$lib/models/metadata";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'isoMetadata.metadataProfile';
  const LABEL = 'Metadaten-Typ';
  const OPTIONS: {
    key: MetadataProfile;
    label: string;
  }[] = [{
    key: 'ISO',
    label: 'ISO'
  }, {
    key: 'INSPIRE_HARMONISED',
    label: 'INSPIRE harmonisiert'
  }, {
    key: 'INSPIRE_IDENTIFIED',
    label: 'INSPIRE identifiziert'
  }];

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue?: string) => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: newValue
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="metadata-type-field">
  <Paper>
    <SelectInput
      key={KEY}
      label={LABEL}
      options={OPTIONS}
      {value}
      {onChange}
      {validationResult}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .metadata-type-field {
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
