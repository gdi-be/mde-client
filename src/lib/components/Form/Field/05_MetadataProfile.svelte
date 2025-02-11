<script lang="ts">
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue, persistValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import type { MetadataProfile } from "$lib/models/metadata";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'isoMetadata.metadataProfile';
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

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    value = valueFromData || '';
  });
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue?: string) => {
    // TODO check if value has changed
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

</script>

<div class="metadata-type-field">
  <Paper>
    <SelectInput
      key={KEY}
      label={fieldConfig?.label}
      options={OPTIONS}
      {value}
      {onChange}
      {validationResult}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
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
