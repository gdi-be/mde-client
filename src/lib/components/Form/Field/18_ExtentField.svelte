<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import NumberInput from '../Inputs/NumberInput.svelte';
  import type { CRS, Extent } from '$lib/models/metadata';
  import Button, { Icon, Label } from '@smui/button';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { getHighestRole, transformExtent } from '$lib/util';
  import type { ValidationResult, ValidationResultList } from '../FieldsConfig';
  import ValidationFeedbackText from '../FieldHint.svelte';
  import type { Option } from '$lib/models/form';
  import { getContext, onMount } from 'svelte';
  import type { Token } from '$lib/models/keycloak';

  type ExtentOption = {
    title: string;
    value: Extent;
  };

  const KEY = 'isoMetadata.extent';
  const CRS_KEY = 'isoMetadata.crs';
  const CRS_LABEL = 'Koordinatensystem';
  const LABEL_MAX_X = 'Maximaler X-Wert';
  const LABEL_MIN_X = 'Minimaler X-Wert';
  const LABEL_MAX_Y = 'Maximaler Y-Wert';
  const LABEL_MIN_Y = 'Minimaler Y-Wert';

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));

  let initialCRSKey = getValue<CRS>(CRS_KEY);
  const valueFromData = $derived(getValue<Extent>(KEY));
  let value4326 = $state({
    minx: 0,
    maxx: 0,
    miny: 0,
    maxy: 0
  });

  $effect(() => {
    if (valueFromData) {
      value4326 = valueFromData;
    }
  });

  let extentOptions = $state<ExtentOption[]>([]);
  let crsOptions = $state<Option[]>([]);
  let crsKey = $state(initialCRSKey);
  let crs = $derived(crsOptions.find((option) => option.key === crsKey));
  let showCheckmark = $state(false);
  let transformedValue = $derived(
    crs && value4326 ? transformExtent(value4326, 'EPSG:4326', crs.label as CRS) : value4326
  );
  let matchingOption = $derived(
    extentOptions.find((option) => {
      return (
        option.value.minx === value4326.minx &&
        option.value.maxx === value4326.maxx &&
        option.value.miny === value4326.miny &&
        option.value.maxy === value4326.maxy
      );
    })
  );

  const fieldConfig = getFieldConfig<Extent>(KEY);
  let validationResult = $derived(fieldConfig?.validator(value4326)) as ValidationResultList;
  let generalValidationResult = $derived(
    validationResult?.find(({ subKey }) => subKey === undefined)
  );

  const onChange = (newValue: number, key: keyof Extent) => {
    const newTransformedValue = {
      ...transformedValue,
      [key]: newValue
    };
    value4326 = transformExtent(newTransformedValue, crs?.label as CRS, 'EPSG:4326');
  };

  const sendValue = async () => {
    const response = await persistValue(KEY, value4326);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const getFieldValidation = (k: string): ValidationResult | undefined => {
    if (!Array.isArray(validationResult)) return;
    return validationResult.find(({ subKey }) => subKey === k);
  };

  onMount(async () => {
    const crsResponse = await fetch('/data/crs');
    crsOptions = await crsResponse.json();

    if (!crsKey && crsOptions[0].key) {
      crsKey = crsOptions[0].key as CRS;
    }

    const extentResponse = await fetch('/data/extents');
    extentOptions = await extentResponse.json();
  });
</script>

{#if highestRole !== 'MdeDataOwner'}
  <div class="extent-field">
    <fieldset>
      <legend>{fieldConfig?.label}</legend>
      <div class="tools">
        <SelectInput bind:value={crsKey} label={CRS_LABEL} options={crsOptions} />
        {#each extentOptions as option}
          <Button
            type="button"
            variant={matchingOption?.title === option.title ? 'raised' : 'text'}
            title={option.title}
            onclick={() => {
              value4326 = option.value;
              sendValue();
            }}
          >
            <Label>{option.title}</Label>
            <Icon class="material-icons">pageless</Icon>
          </Button>
        {/each}
      </div>
      <div class="extent-fields">
        <div class="inline-fields">
          <NumberInput
            value={transformedValue.minx}
            label={LABEL_MIN_X}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'minx');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={getFieldValidation('minx')}
          />
          <NumberInput
            value={transformedValue.maxx}
            label={LABEL_MAX_X}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'maxx');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={getFieldValidation('maxx')}
          />
        </div>
        <div class="inline-fields">
          <NumberInput
            value={transformedValue.miny}
            label={LABEL_MIN_Y}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'miny');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={getFieldValidation('miny')}
          />
          <NumberInput
            value={transformedValue.maxy}
            label={LABEL_MAX_Y}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'maxy');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={getFieldValidation('maxy')}
          />
        </div>
        <ValidationFeedbackText validationResult={generalValidationResult} />
      </div>
    </fieldset>
    <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
  </div>
{/if}

<style lang="scss">
  .extent-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.mdc-text-field) {
      display: flex;
    }

    fieldset {
      display: flex;
      flex: 1;
      border-radius: 0.25em;
      justify-content: space-between;

      :global(.select-input),
      :global(.number-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.select-input > legend),
      :global(.number-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }

      > legend {
        font-size: 1.5em;
      }

      .tools {
        display: flex;
        flex-direction: column;
      }

      .extent-fields {
        flex: 1;

        .inline-fields {
          display: flex;
          justify-content: space-evenly;
        }
      }
    }
  }
</style>
