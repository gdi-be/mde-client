<script lang="ts">
  import { page } from "$app/state";
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import Paper from "@smui/paper";
  import { getFieldConfig, getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import type { ValidationResult } from "../FieldsConfig";

  const KEY = 'isoMetadata.title';
  const LABEL = 'Titel Datenbestand';

  const initialValue = getValue<string>(KEY);
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
  <Paper class="input-wrapper">
    <TextInput
      bind:value
      key={KEY}
      label={LABEL}
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

    :global(.input-wrapper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
