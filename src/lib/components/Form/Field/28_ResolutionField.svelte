<script lang="ts">
  import {
    FORMSTATE_CONTEXT,
    getFormContext,
    type FormState
  } from '$lib/context/FormContext.svelte';
  import FieldHint from '../FieldHint.svelte';
  import FieldTools from '../FieldTools.svelte';
  import NumberInput from '../Inputs/NumberInput.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import FormField from '@smui/form-field';
  import Radio from '@smui/radio';

  import { page } from '$app/state';
  import { ValidationService } from '$lib/services/ValidationService';
  import { getContext } from 'svelte';

  const t = $derived(page.data.t);

  const RESOLUTION_KEY = 'isoMetadata.resolutions';
  const SCALE_KEY = 'isoMetadata.scale';

  const { getValue } = getFormContext();
  let selected = $state<typeof RESOLUTION_KEY | typeof SCALE_KEY>();
  const formState = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formState.metadata);

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
  const resolutionFieldConfig = MetadataService.getFieldConfig<number>(28);
  let resolutionValidationResult = $derived(
    ValidationService.validateField(resolutionFieldConfig, resolutionValue, {
      metadata
    })
  );
  const scaleFieldConfig = MetadataService.getFieldConfig<number>(27);
  let scaleValidationResult = $derived(
    ValidationService.validateField(scaleFieldConfig, scaleValue, {
      metadata
    })
  );
  let hasInvalidFields = $derived(
    !resolutionValidationResult?.valid && !scaleValidationResult?.valid
  );

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
    const response = await MetadataService.persistValue(RESOLUTION_KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const updateScale = async (newValue: number | null) => {
    const response = await MetadataService.persistValue(SCALE_KEY, newValue);
    if (response.ok) {
      showCheckmark = true;
    }
  };
</script>

<div class="resolution-field">
  <fieldset class={[hasInvalidFields ? 'invalid' : '']}>
    <legend>{t('28_ResolutionField.label')}</legend>
    <FieldHint explanation={t('28_ResolutionField.explanation')} />
    <div class="input-container">
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
    </div>
  </fieldset>
  <FieldTools
    fieldConfig={selected === SCALE_KEY ? scaleFieldConfig : resolutionFieldConfig}
    key={selected === SCALE_KEY ? SCALE_KEY : RESOLUTION_KEY}
    bind:checkMarkAnmiationRunning={showCheckmark}
  />
</div>

<style lang="scss">
  .resolution-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.field-hint) {
      margin: 0.5em 0;
    }

    fieldset {
      flex: 1;
      border-radius: 4px;

      &.invalid {
        border: 2px solid var(--mdc-theme-error) !important;
      }

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
