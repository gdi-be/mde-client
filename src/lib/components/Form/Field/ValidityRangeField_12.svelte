<script lang="ts">
  import { page } from "$app/stores";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import DateInput from "../Inputs/DateInput.svelte";
  import { invalidateAll } from "$app/navigation";

  const FROM_KEY = 'isoMetadata.validFrom';
  const TO_KEY = 'isoMetadata.validTo';
  const LABEL = 'Gültigkeitszeitraum';
  const START_LABEL = 'Anfangsdatum';
  const END_LABEL = 'Enddatum';

  let initialStartValue = getValue<string>(FROM_KEY);
  let initialEndValue = getValue<string>(TO_KEY);
  if (initialStartValue) {
    initialStartValue = new Date(initialStartValue).toISOString().split('T')[0];
  }
  if (initialEndValue) {
    initialEndValue = new Date(initialEndValue).toISOString().split('T')[0];
  }
  let startValue = $state(initialStartValue || '');
  let endValue = $state(initialEndValue || '');
  let showCheckmark = $state(false);

  const onBlur = async (key: string) => {
    // TODO check if value has changed
    const value = key === FROM_KEY ? startValue : endValue!;
    const response = await fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key,
        value: (new Date(value)).toISOString()
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="validity-range-field">
  <Paper>
    <fieldset>
      <legend>{LABEL}</legend>
      <DateInput
        bind:value={startValue}
        label={START_LABEL}
        onblur={() => onBlur(FROM_KEY)}
      />
      <DateInput
        bind:value={endValue}
        label={END_LABEL}
        onblur={() => onBlur(TO_KEY)}
      />
    </fieldset>
  </Paper>
  <FieldTools
    key={FROM_KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .validity-range-field {
    position: relative;
    display: flex;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }

    fieldset {
      flex: 1;
      border-radius: 4px;

      >legend {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
