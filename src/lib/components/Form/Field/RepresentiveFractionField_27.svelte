<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import NumberInput from "../Inputs/NumberInput.svelte";

  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Vergleichsmaßstab'

  let initialValue = getValue<number>(KEY);
  let value = $state(initialValue || Number.NaN);
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO implement
  };

</script>

<div class="title-field">
  <Paper>
    <NumberInput
      bind:value
      key={KEY}
      label={LABEL}
      onblur={onBlur}
      prefix="1:"
      required
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
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
