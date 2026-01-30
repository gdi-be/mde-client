<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldHint from '../FieldHint.svelte';
  import FieldTools from '../FieldTools.svelte';
  import NumberInput from '../Inputs/NumberInput.svelte';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';

  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const RESOLUTION_KEY = 'isoMetadata.resolutions';
  const SCALE_KEY = 'isoMetadata.scale';

  let selected = $state<typeof RESOLUTION_KEY | typeof SCALE_KEY>();

  // TODO: check why this is a List
  const resolutionValueFromData = $derived(getValue<number[]>(RESOLUTION_KEY)?.[0]);
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
  const resolutionFieldConfig = getFieldConfig<number>(28);
  let resolutionValidationResult = $derived(
    resolutionFieldConfig?.validator(resolutionValue || undefined)
  );
  const scaleFieldConfig = getFieldConfig<number>(27);
  let scaleValidationResult = $derived(scaleFieldConfig?.validator(scaleValue || undefined));

  const clearAllValues = async () => {
    scaleValue = null;
    resolutionValue = null;
    await updateResolution(null);
    await updateScale(null);
  };

  const onBlur = async (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const minValue = target.getAttribute('min');
    const min = Number(minValue);
    if (!Number.isNaN(min) && Number(target.value) < min) {
      return;
    }
    if (selected === RESOLUTION_KEY) {
      await updateResolution(resolutionValue ? [resolutionValue] : null);
    } else {
      await updateScale(scaleValue);
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
    <legend>{t('28_ResolutionField.label')}</legend>
    <FormField>
      <Radio bind:group={selected} value={RESOLUTION_KEY} onchange={clearAllValues} />
      {#snippet label()}
        {t('28_ResolutionField.label_ground')}
      {/snippet}
    </FormField>
    <FormField>
      <Radio bind:group={selected} value={SCALE_KEY} onchange={clearAllValues} />
      {#snippet label()}
        {t('28_ResolutionField.label_scale')}
      {/snippet}
    </FormField>
    {#if selected === undefined}
      <div>
        <FieldHint
          explanation={t('28_ResolutionField.explanation')}
          validationResult={{
            valid: false,
            helpText: 'Bitte geben Sie die räumliche Auflösung an.'
          }}
          required
        />
      </div>
    {/if}
    {#if selected === RESOLUTION_KEY}
      <NumberInput
        bind:value={resolutionValue as number}
        key={RESOLUTION_KEY}
        label={t('28_ResolutionField.label_ground')}
        fieldConfig={resolutionFieldConfig}
        onblur={onBlur}
        min={0.001}
        validationResult={resolutionValidationResult}
        step="any"
      />
    {:else if selected === SCALE_KEY}
      <NumberInput
        bind:value={
          () => scaleValue as number,
          (val: number) => {
            scaleValue = val ? Math.round(Number(val)) : null;
          }
        }
        key={SCALE_KEY}
        min={1}
        label={t('28_ResolutionField.label_scale')}
        fieldConfig={scaleFieldConfig}
        onblur={onBlur}
        validationResult={scaleValidationResult}
      />
    {/if}
  </fieldset>
  <FieldTools
    fieldConfig={selected === SCALE_KEY ? scaleFieldConfig : resolutionFieldConfig}
    key={selected === SCALE_KEY ? SCALE_KEY : RESOLUTION_KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
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
