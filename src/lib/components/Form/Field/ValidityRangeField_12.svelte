<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import DateInput from "../Inputs/DateInput.svelte";

  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Gültigkeitszeitraum';
  const START_LABEL = 'Anfangsdatum';
  const END_LABEL = 'Enddatum';

  let initialStartValue = getValue<string>(KEY)?.[0];
  let initialEndValue = getValue<string>(KEY)?.[1];
  if (initialStartValue) {
    initialStartValue = new Date(initialStartValue).toISOString().split('T')[0];
  }
  if (initialEndValue) {
    initialEndValue = new Date(initialEndValue).toISOString().split('T')[0];
  }
  let startValue = $state(initialStartValue || '');
  let endValue = $state(initialEndValue || '');
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO: implement
  };

</script>

<div class="validity-range-field">
  <Paper>
    <fieldset>
      <legend>{LABEL}</legend>
      <DateInput
        bind:value={startValue}
        label={START_LABEL}
        onblur={onBlur}
      />
      <DateInput
        bind:value={endValue}
        label={END_LABEL}
        onblur={onBlur}
      />
    </fieldset>
  </Paper>
  <FieldTools
    key={KEY}
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
