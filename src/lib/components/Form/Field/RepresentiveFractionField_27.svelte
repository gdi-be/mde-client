<script lang="ts">
  import { page } from "$app/stores";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import NumberInput from "../Inputs/NumberInput.svelte";
  import { invalidateAll } from "$app/navigation";

  const KEY = 'isoMetadata.scale';
  const LABEL = 'Vergleichsmaßstab'

  let initialValue = getValue<number>(KEY);
  let value = $state(initialValue || Number.NaN);
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO check if value has changed
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
      showCheckmark = true;
      invalidateAll();
    }
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
