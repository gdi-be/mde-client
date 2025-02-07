<script lang="ts">
  import { page } from "$app/state";
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'technicalMetadata.deliveredCrs';
  const LABEL = 'Geliefertes Koordinatensystem';

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue || '');
  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value)) as ValidationResult;

  const onBlur = async () => {
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
    <TextInput
      bind:value
      key={KEY}
      label={LABEL}
      maxlength={100}
      onblur={onBlur}
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

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
