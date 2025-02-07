<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import DateInput from "../Inputs/DateInput.svelte";
  import type { MaintenanceFrequency } from "$lib/models/metadata";
  import { getLastUpdateValue } from "$lib/util";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'isoMetadata.modified';
  const LABEL = 'letzte Aktualisierung';

  const {
    metadata
  } = $props();

  const initialValue = getValue<string>(KEY, metadata);
  let publishedValue = $derived(getValue<string>('isoMetadata.published', metadata));
  let maintenanceFrequencyValue = $derived(getValue<MaintenanceFrequency>('isoMetadata.maintenanceFrequency', metadata));
  let value = $state(initialValue || '');
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  $effect(() => {
    if (initialValue) {
      value = new Date(initialValue).toISOString().split('T')[0];
    } else if (publishedValue && maintenanceFrequencyValue) {
      const lastUpdateDate = getLastUpdateValue(publishedValue, maintenanceFrequencyValue);
      value = lastUpdateDate?.toISOString().split('T')[0] || '';
    }
  });

  let showCheckmark = $state(false);
  let isAutomatedValue = $derived([
    'continual',
    'daily',
    'weekly',
    'fortnightly',
    'monthly',
    'quarterly',
    'biannually',
    'annually'
  ].includes(maintenanceFrequencyValue!));
  let readOnly = $derived(!!publishedValue && isAutomatedValue);

  const onBlur = async () => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: (new Date(value!)).toISOString()
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };
</script>

<div class="date-time-field">
  <Paper>
    <DateInput
      bind:value
      key={KEY}
      label={LABEL}
      onblur={onBlur}
      disabled={readOnly}
      {validationResult}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .date-time-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
