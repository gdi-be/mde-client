<script lang="ts">
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";

  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Technische Beschreibung';

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue || '');
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO implement
  };

</script>

<div class="technical-description-field">
  <Paper>
    <TextInput
      bind:value
      key={KEY}
      label={LABEL}
      onblur={onBlur}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .technical-description-field {
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
