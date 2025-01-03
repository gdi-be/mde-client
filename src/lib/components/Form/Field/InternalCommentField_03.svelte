<script lang="ts">
  import { page } from "$app/stores";
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import Paper from "@smui/paper";
  import Checkmark from "../../Checkmark.svelte";
  import { getValue } from "../FormContext.svelte";

  const KEY = 'isoMetadata.internal_comment';
  const LABEL = 'Kommentar zur Aktualisierung';

  let initialValue = getValue<string>(KEY) || '';
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

<div class="internal-comment-field">
  <Paper>
    <TextInput
      disabled
      bind:value
      key={KEY}
      label={LABEL}
      onblur={onBlur}
    />
  </Paper>
  <Checkmark
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .internal-comment-field {
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
