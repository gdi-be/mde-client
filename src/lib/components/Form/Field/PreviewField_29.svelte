<script lang="ts">
  import { page } from "$app/stores";
  import type { PreviewMap } from "$lib/models/metadata";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import NumberInput from "../Inputs/NumberInput.svelte";
  import TextInput from "../Inputs/TextInput.svelte";

  const KEY = 'isoMetadata.previewMap';
  const LABEL = 'Vorschau';
  const LABEL_EXTENT = 'Räumliche Ausdehnung';
  const LABEL_URL = 'URL';
  const LABEL_CRS = 'Koordinatenreferenzsystem';
  const LABEL_MAX_X = 'Maximaler X-Wert';
  const LABEL_MIN_X = 'Minimaler X-Wert';
  const LABEL_MAX_Y = 'Maximaler Y-Wert';
  const LABEL_MIN_Y = 'Minimaler Y-Wert';

  let initialValue = getValue<PreviewMap>(KEY);
  let value = $state(initialValue  || {
    crs: '',
    url: '',
    minx: NaN,
    maxx: NaN,
    miny: NaN,
    maxy: NaN
  });
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO: check if value has changed
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
      invalidateAll();
    }
  };

</script>

<div class="preview-field">
  <fieldset class="wrapper-fieldset">
    <legend>{LABEL}</legend>
    <div class="text-inputs">
      <TextInput
        bind:value={value.url}
        label={LABEL_URL}
        onblur={onBlur}
        required
      />
      <TextInput
        bind:value={value.crs}
        label={LABEL_CRS}
        onblur={onBlur}
      />
    </div>
    <fieldset class="extent-fieldset">
      <legend>{LABEL_EXTENT}</legend>
      <div class="inline-fields">
        <NumberInput
          bind:value={value.minx}
          label={LABEL_MIN_X}
          type="float"
          onblur={onBlur}
        />
        <NumberInput
          bind:value={value.maxx}
          label={LABEL_MAX_X}
          type="float"
          onblur={onBlur}
        />
      </div>
      <div class="inline-fields">
        <NumberInput
          bind:value={value.miny}
          label={LABEL_MIN_Y}
          type="float"
          onblur={onBlur}
        />
        <NumberInput
          bind:value={value.maxy}
          label={LABEL_MAX_Y}
          type="float"
          onblur={onBlur}
        />
      </div>
    </fieldset>
  </fieldset>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .preview-field {
    display: flex;
    gap: 1em;

    .text-inputs {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1em;
    }

    .inline-fields {
      display: flex;
      gap: 1em;
      justify-content: space-evenly;
    }

    .wrapper-fieldset {
      display: flex;
      justify-content: space-between;
      flex: 1;
      gap: 2em;
      border-radius: 4px;

      >legend {
        display: flex;
        align-items: center;
      }
    }

  }
</style>
