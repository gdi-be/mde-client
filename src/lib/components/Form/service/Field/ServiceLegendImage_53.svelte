<script lang="ts">
  import TextInput from "../../Inputs/TextInput.svelte";
  import type { Service } from "$lib/models/metadata";
  import NumberInput from "../../Inputs/NumberInput.svelte";

  export type ServiceTypeProps = {
    value: Service["legendImage"]
    onChange: (newValue: Service["legendImage"]) => void
  };

  let {
    value,
    onChange
  }: ServiceTypeProps = $props();

  const update = (key: string, val: string) => {
    onChange({
      ...value,
      [key]: val
    });
  };

</script>


<fieldset class="legend-fieldset">
  <legend>Gesamtlegende</legend>
  <div class="legend-text-fields">
    <TextInput
      label="Format"
      value={value?.format}
      maxlength={100}
      onchange={(e: Event) => update("format", (e.target as HTMLInputElement).value)}
    />
    <TextInput
      label="Url"
      value={value?.url}
      maxlength={100}
      onchange={(e: Event) => update("url", (e.target as HTMLInputElement).value)}
    />
  </div>
  <fieldset>
    <NumberInput
      label="Breite"
      value={value?.width}
      onchange={(e: Event) => update("width", (e.target as HTMLInputElement).value)}
    />
    <NumberInput
      label="Höhe"
      value={value?.height}
      onchange={(e: Event) => update("height", (e.target as HTMLInputElement).value)}
    />
  </fieldset>
</fieldset>

<style lang="scss">
  .legend-fieldset {
    display: flex;
    gap: 1em;

    div.legend-text-fields {
      flex: 1;
    }
  }

</style>
