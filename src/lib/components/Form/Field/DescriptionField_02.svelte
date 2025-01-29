<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/state";
  import FieldTools from "../FieldTools.svelte";
  import { getValue } from "../FormContext.svelte";
  import TextAreaInput from "../Inputs/TextAreaInput.svelte";

  const KEY = 'isoMetadata.description';
  const LABEL = 'Kurzbeschreibung Datenbestand';

  let initialValue = getValue<string>(KEY) || '';
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO: check if value has changed
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

<div class="description-field">
  <TextAreaInput
    bind:value
    key={KEY}
    label={LABEL}
    maxlength={500}
    onblur={onBlur}
    required
  />
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .description-field {
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
