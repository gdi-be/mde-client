<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import NumberInput from '../Inputs/NumberInput.svelte';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';
  import type { ValidationResult } from '../FieldsConfig';

  const RESOLUTION_KEY = 'isoMetadata.resolutions';
  const SCALE_KEY = 'isoMetadata.scale';

  let selected = $state<typeof RESOLUTION_KEY | typeof SCALE_KEY>();

  // TODO: check why this is a List
  const resolutionValueFromData = $derived(getValue<number>(RESOLUTION_KEY?.[0]));
  let resolutionValue = $state<number | null>(null);
  $effect(() => {
    if (resolutionValueFromData) {
      resolutionValue = resolutionValueFromData;
      selected = RESOLUTION_KEY;
    }
  });

  const scaleValueFromData = $derived(getValue<number>(SCALE_KEY));
  let scaleValue = $state<number | null>(null);
  $effect(() => {
    if (scaleValueFromData) {
      scaleValue = scaleValueFromData;
      selected = SCALE_KEY;
    }
  });

  let showCheckmark = $state(false);
  const resolutionFieldConfig = getFieldConfig<number>(RESOLUTION_KEY);
  let resolutionValidationResult = $derived(
    resolutionFieldConfig?.validator(resolutionValue || undefined)
  ) as ValidationResult;
  const scaleFieldConfig = getFieldConfig<number>(SCALE_KEY);
  let scaleValidationResult = $derived(
    scaleFieldConfig?.validator(scaleValue || undefined)
  ) as ValidationResult;

  const onBlur = async () => {
    if (selected === RESOLUTION_KEY) {
      if (Number.isFinite(resolutionValue)) {
        await updateResolution([resolutionValue as number]);
        updateScale(null);
      }
    } else {
      if (Number.isFinite(scaleValue)) {
        await updateScale(scaleValue as number);
        updateResolution(null);
      }
    }
  };

  const updateResolution = async (newValue: [number] | null) => {
    const response = await persistValue(RESOLUTION_KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const updateScale = async (newValue: number | null) => {
    const response = await persistValue(SCALE_KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="title-field">
  <fieldset>
    <legend>Räumliche Auflösung</legend>
    <FormField>
      <Radio bind:group={selected} value={RESOLUTION_KEY} />
      {#snippet label()}
        {resolutionFieldConfig?.label}
      {/snippet}
    </FormField>
    <FormField>
      <Radio bind:group={selected} value={SCALE_KEY} />
      {#snippet label()}
        {scaleFieldConfig?.label}
      {/snippet}
    </FormField>
    {#if selected === RESOLUTION_KEY}
      <NumberInput
        bind:value={resolutionValue as number}
        key={RESOLUTION_KEY}
        label={resolutionFieldConfig?.label}
        fieldConfig={resolutionFieldConfig}
        type="float"
        onblur={onBlur}
        validationResult={resolutionValidationResult}
      />
    {:else}
      <NumberInput
        bind:value={scaleValue as number}
        key={SCALE_KEY}
        label={scaleFieldConfig?.label}
        fieldConfig={scaleFieldConfig}
        onblur={onBlur}
        prefix="1:"
        validationResult={scaleValidationResult}
      />
    {/if}
  </fieldset>
  <FieldTools key={RESOLUTION_KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 4px;

      > legend {
        font-size: 1.5em;
      }

      :global(.number-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.number-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
    }

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
