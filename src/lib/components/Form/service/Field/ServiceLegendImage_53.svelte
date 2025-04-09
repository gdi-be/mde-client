<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Service } from '$lib/models/metadata';
  import NumberInput from '$lib/components/Form/Inputs/NumberInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';

  const KEY = 'isoMetadata.services.legendImage';

  export type ServiceTypeProps = {
    value: Service['legendImage'];
    onChange: (newValue: Service['legendImage']) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();

  const update = (key: string, val: string) => {
    onChange({
      ...value,
      [key]: val
    });
  };
</script>

<div class="legend-fieldset">
  <fieldset>
    <legend>Gesamtlegende</legend>
    <div class="legend-text-fields">
      <TextInput
        label="Format"
        value={value?.format}
        maxlength={100}
        onchange={(e: Event) => update('format', (e.target as HTMLInputElement).value)}
      />
      <TextInput
        label="Url"
        value={value?.url}
        maxlength={100}
        onchange={(e: Event) => update('url', (e.target as HTMLInputElement).value)}
      />
    </div>
    <div class="legend-size-fields">
      <NumberInput
        label="Breite"
        value={value?.width}
        onchange={(e: Event) => update('width', (e.target as HTMLInputElement).value)}
      />
      <NumberInput
        label="Höhe"
        value={value?.height}
        onchange={(e: Event) => update('height', (e.target as HTMLInputElement).value)}
      />
    </div>
  </fieldset>
  <FieldTools key={KEY} />
</div>

<style lang="scss">
  .legend-fieldset {
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      display: flex;
      gap: 1em;
      border-radius: 0.25em;

      legend {
        font-size: 1.5em;
      }

      div.legend-text-fields {
        flex: 1;
      }

      div.legend-size-fields {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }

      :global(.text-input),
      :global(.number-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.text-input > legend),
      :global(.number-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
    }
  }
</style>
