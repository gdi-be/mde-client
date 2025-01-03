<script lang="ts">
  import { page } from "$app/stores";
  import Checkmark from "../../Checkmark.svelte";
  import { getValue } from "../FormContext.svelte";
  import TextAreaInput from "../Inputs/TextAreaInput.svelte";

  const KEY = 'isoMetadata.description';
  const LABEL = 'Kurzbeschreibung Datenbestand';

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onBlur = async () => {
    if (value === initialValue) {
      return;
    }
    const response = await fetch($page.url, {
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
      initialValue = value;
      showCheckmark = true;
    }
  };

</script>

<div class="description-field">
  <TextAreaInput
    bind:value
    key={KEY}
    label={LABEL}
    maxlength={500}
    onblur={onBlur}
  />
  <Checkmark
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .description-field {
    position: relative;
    display: flex;
    gap: 1em;

    :global(.text-area-input) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
