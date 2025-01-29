<script lang="ts">
  import FieldTools from "../FieldTools.svelte";
  import { getValue } from "../FormContext.svelte";
  import TextAreaInput from "../Inputs/TextAreaInput.svelte";

  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Inhaltliche Beschreibung - Freitext';

  let initialValue = getValue<string>(KEY) || '';
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO: implement
  };

</script>

<div class="content-description-field">
  <TextAreaInput
    bind:value
    key={KEY}
    label={LABEL}
    onblur={onBlur}
  />
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .content-description-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.text-area-input) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
