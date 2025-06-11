<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Service } from '$lib/models/metadata';
  import NumberInput from '$lib/components/Form/Inputs/NumberInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import FieldHint from '../../FieldHint.svelte';
  import { getSubFieldConfig } from '../../../../context/FormContext.svelte';

  const KEY = 'isoMetadata.services.legendImage';

  export type ServiceTypeProps = {
    value: Service['legendImage'];
    onChange: (newValue: Service['legendImage']) => void;
  };

  let { value, onChange }: ServiceTypeProps = $props();

  const fieldConfig = getSubFieldConfig('isoMetadata.services', 'legendImage');

  const update = (key: string, val: string) => {
    onChange({
      ...value,
      [key]: val
    });
  };
</script>

<div class="legend-fieldset">
  <fieldset>
    <legend>{fieldConfig?.label || 'Gesamtlegende'}</legend>
    <FieldHint {fieldConfig} />
    <div class="inputs">
      <div class="legend-text-fields">
        <TextInput
          label="Url"
          value={value?.url}
          onchange={(e: Event) => update('url', (e.target as HTMLInputElement).value)}
          fieldConfig={getSubFieldConfig('isoMetadata.services', 'legendImage', 'url')}
        />
        <TextInput
          label="Format"
          value={value?.format}
          onchange={(e: Event) => update('format', (e.target as HTMLInputElement).value)}
          fieldConfig={getSubFieldConfig('isoMetadata.services', 'legendImage', 'format')}
        />
      </div>
      <div class="legend-size-fields">
        <NumberInput
          label="Breite"
          value={value?.width}
          onchange={(e: Event) => update('width', (e.target as HTMLInputElement).value)}
          fieldConfig={getSubFieldConfig('isoMetadata.services', 'legendImage', 'width')}
        />
        <NumberInput
          label="Höhe"
          value={value?.height}
          onchange={(e: Event) => update('height', (e.target as HTMLInputElement).value)}
          fieldConfig={getSubFieldConfig('isoMetadata.services', 'legendImage', 'height')}
        />
      </div>
    </div>
  </fieldset>
  <FieldTools key={KEY} />
</div>

<style lang="scss">
  .legend-fieldset {
    display: flex;
    gap: 0.25em;

    fieldset {
      border-radius: 0.25em;
      flex: 1;

      legend {
        font-size: 1.5em;
      }

      .inputs {
        margin-top: 1em;
        display: flex;
        gap: 1em;

        div.legend-text-fields {
          flex: 1;
        }

        div.legend-size-fields {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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
  }
</style>
