<script lang="ts">
  import { page } from "$app/stores";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import NumberInput from "../Inputs/NumberInput.svelte";
  import type { Extent } from "../../../models/metadata";
  import { invalidateAll } from "$app/navigation";

  const KEY = 'isoMetadata.extent'
  const LABEL = 'Räumliche Ausdehnung';
  const LABEL_MAX_X = 'Maximaler X-Wert';
  const LABEL_MIN_X = 'Minimaler X-Wert';
  const LABEL_MAX_Y = 'Maximaler Y-Wert';
  const LABEL_MIN_Y = 'Minimaler Y-Wert';

  let initialValue = getValue<Extent>(KEY);
  let value = $state(initialValue || {
    minx: NaN,
    maxx: NaN,
    miny: NaN,
    maxy: NaN
  });
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

<div class="validity-range-field">
  <Paper>
    <fieldset>
      <legend>{LABEL}</legend>
      <div class="inline-fields">
        <NumberInput
          bind:value={value.minx}
          label={LABEL_MIN_X}
          type="float"
          onblur={onBlur}
          required
        />
        <NumberInput
          bind:value={value.maxx}
          label={LABEL_MAX_X}
          type="float"
          onblur={onBlur}
          required
        />
      </div>
      <div class="inline-fields">
        <NumberInput
          bind:value={value.miny}
          label={LABEL_MIN_Y}
          type="float"
          onblur={onBlur}
          required
        />
        <NumberInput
          bind:value={value.maxy}
          label={LABEL_MAX_Y}
          type="float"
          onblur={onBlur}
          required
        />
      </div>
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

    .inline-fields {
      display: flex;
      justify-content: space-evenly;
    }

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
