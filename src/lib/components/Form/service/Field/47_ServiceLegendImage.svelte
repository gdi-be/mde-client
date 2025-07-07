<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Service } from '$lib/models/metadata';
  import NumberInput from '$lib/components/Form/Inputs/NumberInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import { getFieldConfig } from '$lib/context/FormContext.svelte';

  const KEY = 'isoMetadata.services.legendImage';

  export type ServiceTypeProps = {
    value: Service['legendImage'];
    onChange: (newValue: Service['legendImage']) => Promise<Response>;
  };

  let { value, onChange }: ServiceTypeProps = $props();

  const fieldConfig = getFieldConfig(47);
  const validationResult = $derived(fieldConfig?.validator(value));
  let showCheckmark = $state(false);

  const update = async (key: string, val: string) => {
    const response = await onChange({
      ...value,
      [key]: val
    });
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="legend-fieldset">
  <fieldset>
    <legend>{fieldConfig?.label || 'Gesamtlegende'}</legend>
    <FieldHint {fieldConfig} {validationResult} />
    <div class="inputs">
      <div class="legend-text-fields">
        <TextInput
          label="Url"
          value={value?.url}
          onchange={(e: Event) => update('url', (e.target as HTMLInputElement).value)}
          fieldConfig={getFieldConfig(47, 'isoMetadata.services.legendImage.url')}
        />
        <TextInput
          label="Format"
          value={value?.format}
          onchange={(e: Event) => update('format', (e.target as HTMLInputElement).value)}
          fieldConfig={getFieldConfig(47, 'isoMetadata.services.legendImage.format')}
        />
      </div>
      <div class="legend-size-fields">
        <NumberInput
          label="Breite"
          value={value?.width}
          onchange={(e: Event) => update('width', (e.target as HTMLInputElement).value)}
          fieldConfig={getFieldConfig(47, 'isoMetadata.services.legendImage.width')}
        />
        <NumberInput
          label="Höhe"
          value={value?.height}
          onchange={(e: Event) => update('height', (e.target as HTMLInputElement).value)}
          fieldConfig={getFieldConfig(47, 'isoMetadata.services.legendImage.height')}
        />
      </div>
    </div>
  </fieldset>
  <FieldTools noCopyButton key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
