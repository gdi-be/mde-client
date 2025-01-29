<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import DateInput from "../Inputs/DateInput.svelte";

  const KEY = 'isoMetadata.created';
  const LABEL = 'Erstellungsdatum';

  let initialValue = getValue<string>(KEY);
  if (initialValue) {
    initialValue = new Date(initialValue).toISOString().split('T')[0];
  }
  let value = $state(initialValue || '');
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: value ? (new Date(value!)).toISOString() : ''
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="date-time-field">
  <Paper>
    <DateInput
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
  .date-time-field {
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
