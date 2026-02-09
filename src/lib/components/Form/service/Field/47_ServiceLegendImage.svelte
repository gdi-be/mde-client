<script lang="ts">
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import type { Service } from '$lib/models/metadata';
  import NumberInput from '$lib/components/Form/Inputs/NumberInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const KEY = 'isoMetadata.services.legendImage';

  export type ServiceTypeProps = {
    value: Service['legendImage'];
    onChange: (newValue: Service['legendImage']) => Promise<Response>;
  };

  let { value, onChange }: ServiceTypeProps = $props();

  const fieldConfig = MetadataService.getFieldConfig(47);
  const fieldConfigUrl = MetadataService.getFieldConfig(75);
  const fieldConfigFormat = MetadataService.getFieldConfig(76);
  const fieldConfigWidth = MetadataService.getFieldConfig(77);
  const fieldConfigHeight = MetadataService.getFieldConfig(78);
  const validationResult = $derived(fieldConfig?.validator(value));
  const validationResultUrl = $derived(fieldConfigUrl?.validator(value?.url));
  const validationResultFormat = $derived(fieldConfigFormat?.validator(value?.format));
  const validationResultWidth = $derived(fieldConfigWidth?.validator(value?.width));
  const validationResultHeight = $derived(fieldConfigHeight?.validator(value?.height));
  let showCheckmark = $state(false);

  const update = async (key: string, val: string | number) => {
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
    <legend>{t('47_ServiceLegendImage.label')}</legend>
    <FieldHint
      explanation={t('47_ServiceLegendImage.explanation')}
      {fieldConfig}
      {validationResult}
    />
    <div class="inputs">
      <div class="legend-text-fields">
        <div class="field-wrapper">
          <TextInput
            label={t('47_ServiceLegendImage.url')}
            value={value?.url}
            onchange={(e: Event) => update('url', (e.target as HTMLInputElement).value)}
            fieldConfig={fieldConfigUrl}
            validationResult={validationResultUrl}
          />
          <FieldTools value={value?.url} key={KEY} noCheckmark noHelpButton />
        </div>
        <div class="field-wrapper">
          <TextInput
            label={t('47_ServiceLegendImage.format')}
            value={value?.format}
            onchange={(e: Event) => update('format', (e.target as HTMLInputElement).value)}
            fieldConfig={fieldConfigFormat}
            validationResult={validationResultFormat}
          />
          <FieldTools value={value?.format} key={KEY} noCheckmark noHelpButton />
        </div>
      </div>
      <div class="legend-size-fields">
        <div class="field-wrapper">
          <NumberInput
            label={t('47_ServiceLegendImage.width')}
            value={value?.width}
            onblur={(e: Event) => update('width', Number((e.target as HTMLInputElement).value))}
            fieldConfig={fieldConfigWidth}
            validationResult={validationResultWidth}
          />
          <FieldTools value={value?.width} key={KEY} noCheckmark noHelpButton />
        </div>
        <div class="field-wrapper">
          <NumberInput
            label={t('47_ServiceLegendImage.height')}
            value={value?.height}
            onblur={(e: Event) => update('height', Number((e.target as HTMLInputElement).value))}
            fieldConfig={fieldConfigHeight}
            validationResult={validationResultHeight}
          />
          <FieldTools value={value?.height} key={KEY} noCheckmark noHelpButton />
        </div>
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
        flex-wrap: wrap;
        gap: 1em;

        div.field-wrapper {
          display: flex;
          gap: 0.25em;
        }

        div.legend-text-fields {
          flex: 1;
        }

        div.legend-size-fields {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
        }

        :global(.text-input),
        :global(.number-input) {
          flex: 1;
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
