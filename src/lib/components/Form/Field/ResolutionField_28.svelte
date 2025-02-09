<script lang="ts">
  import { page } from "$app/state";
  import { getFieldConfig, getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import NumberInput from "../Inputs/NumberInput.svelte";
  import { invalidateAll } from "$app/navigation";
  import FormField from "@smui/form-field";
  import Radio from "@smui/radio";
  import type { ValidationResult } from "../FieldsConfig";

  const RESOLUTION_KEY = 'isoMetadata.resolutions';
  const RESOLUTION_LABEL = 'Bodenauflösung'
  const SCALE_KEY = 'isoMetadata.scale';
  const SCALE_LABEL = 'Vergleichsmaßstab'

  // TODO: check why this is a List
  let initialResolutionValue = getValue<number[]>(RESOLUTION_KEY)?.[0];
  let resolutionValue = $state(initialResolutionValue || null);
  let initialScaleValue = getValue<number>(SCALE_KEY);
  let scaleValue = $state(initialScaleValue  || null);
  let selected = $state(initialResolutionValue ? RESOLUTION_KEY : SCALE_KEY);
  let showCheckmark = $state(false);
  const resolutionFieldConfig = getFieldConfig<number>(RESOLUTION_KEY);
  let resolutionValidationResult = $derived(resolutionFieldConfig?.validator(resolutionValue || undefined)) as ValidationResult;
  const scaleFieldConfig = getFieldConfig<number>(SCALE_KEY);
  let scaleValidationResult = $derived(scaleFieldConfig?.validator(scaleValue || undefined)) as ValidationResult;

  const onBlur = async () => {
    if (selected === RESOLUTION_KEY) {
      if (Number.isFinite(resolutionValue)) {
        await updateResolution([resolutionValue as number]);
        updateScale(null);
      }
    } else {
      if (Number.isFinite(scaleValue)) {
        await updateScale(scaleValue);
        updateResolution(null);
      }
    }
  };

  const updateResolution = async (newValue: [number] | null) => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: RESOLUTION_KEY,
        value: newValue
      })
    });
    if (response.ok) {
      if (newValue === null) {
        resolutionValue = null;
      }
      showCheckmark = true;
      invalidateAll();
    }
  };

  const updateScale = async (newValue: number | null) => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: SCALE_KEY,
        value: newValue
      })
    });
    if (response.ok) {
      if (newValue === null) {
        scaleValue = null;
      }
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="title-field">
  <fieldset>
    <legend>Räumliche Auflösung</legend>
    <FormField>
      <Radio
        bind:group={selected}
        value={RESOLUTION_KEY}
      />
      {#snippet label()}
        {RESOLUTION_LABEL}
      {/snippet}
    </FormField>
    <FormField>
      <Radio
        bind:group={selected}
        value={SCALE_KEY}
      />
      {#snippet label()}
        {SCALE_LABEL}
      {/snippet}
    </FormField>
    {#if selected === RESOLUTION_KEY}
      <NumberInput
        bind:value={resolutionValue as number}
        key={RESOLUTION_KEY}
        label={RESOLUTION_LABEL}
        type="float"
        onblur={onBlur}
        validationResult={resolutionValidationResult}
      />
    {:else}
      <NumberInput
        bind:value={scaleValue as number}
        key={SCALE_KEY}
        label={SCALE_LABEL}
        onblur={onBlur}
        prefix="1:"
        validationResult={scaleValidationResult}
      />
    {/if}
  </fieldset>
  <FieldTools
    key={RESOLUTION_KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .title-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 4px;

      >legend {
        font-size: 0.75em;
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
