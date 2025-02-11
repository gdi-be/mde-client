<script lang="ts">
  import { page } from "$app/state";
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import Paper from "@smui/paper";
  import { getValue } from "$lib/context/FormContext.svelte";;
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";

  const KEY = 'technicalMetadata.descriptions';
  const LABEL = 'Technische Beschreibung';

  // TODO: check why this is a List on the server
  let initialValue = getValue<string[]>(KEY)?.[0];
  let value = $state(initialValue || '');
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO implement
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: [value]
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="technical-description-field">
  <Paper>
    <TextInput
      bind:value
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
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
