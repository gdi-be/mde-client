<script lang="ts">
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue, persistValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import AutoFillButton from "../AutoFillButton.svelte";
  import type { IsoTheme } from "$lib/models/metadata";
  import type { ValidationResult } from "../FieldsConfig";

  const {
    metadata
  } = $props();

  const KEY = 'isoMetadata.topicCategory';

  const valueFromData = $derived(getValue<string>(KEY));
  let value = $state('');
  $effect(() => {
    if (valueFromData) {
      value = valueFromData;
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onChange = async (newValue?: string) => {
    const response = await persistValue(KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/iso_themes');
    const data = await response.json();
    return data.map((entry: IsoTheme) => ({
      key: entry.isoID,
      label: entry.isoName
    }));
  };

  const getAutoFillValues = async () => {
    const inspireTheme = getValue<string>('isoMetadata.inspireTheme', metadata);
    if (!inspireTheme) return;
    const response = await fetch(`/data/iso_themes`);
    const data = await response.json();
    const match = data.find((entry: IsoTheme) => entry.inspireID === inspireTheme);
    if (!match) return;
    value = match.isoID;
    onChange(value);
  }

</script>

<div class="topic-category-field">
  <Paper>
    {#await fetchOptions()}
      <p>Lade Themen Kategorien</p>
    {:then OPTIONS}
      <SelectInput
        key={KEY}
        label={fieldConfig?.label}
        options={OPTIONS}
        {value}
        {onChange}
        {validationResult}
      />
    {/await}
  </Paper>
  <FieldTools
    key={KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
  >
    <AutoFillButton
      onclick={getAutoFillValues}
    />
  </FieldTools>
</div>

<style lang="scss">
  .topic-category-field {
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
