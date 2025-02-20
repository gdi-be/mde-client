<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import NumberInput from '../Inputs/NumberInput.svelte';
  import type { CRS, Extent } from '$lib/models/metadata';
  import Button, { Icon, Label } from '@smui/button';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { transformExtent } from '$lib/util';
  import type { ValidationResult, ValidationResultList } from '../FieldsConfig';
  import ValidationFeedbackText from '../ValidationFeedbackText.svelte';

  const KEY = 'isoMetadata.extent';
  const CRS_KEY = 'isoMetadata.crs';
  const CRS_LABEL = 'Koordinatensystem';
  const LABEL_MAX_X = 'Maximaler X-Wert';
  const LABEL_MIN_X = 'Minimaler X-Wert';
  const LABEL_MAX_Y = 'Maximaler Y-Wert';
  const LABEL_MIN_Y = 'Minimaler Y-Wert';

  const CRS_OPTIONS: {
    key: string;
    label: CRS;
  }[] = [
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/25833',
      label: 'EPSG:25833'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/4326',
      label: 'EPSG:4326'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/3857',
      label: 'EPSG:3857'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/4258',
      label: 'EPSG:4258'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/25832',
      label: 'EPSG:25832'
    },
    {
      key: 'http://www.opengis.net/def/crs/EPSG/0/3035',
      label: 'EPSG:3035'
    }
  ];

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

  let crsKey = $state(initialCRSKey || CRS_OPTIONS[1].key);
  let crs = $derived(CRS_OPTIONS.find((option) => option.key === crsKey) || CRS_OPTIONS[1]);
  let showCheckmark = $state(false);
  let transformedValue = $derived(
    crs ? transformExtent(value4326, 'EPSG:4326', crs.label) : value4326
  );
  let isBerlin = $derived(
    value4326.minx === 13.079 &&
      value4326.maxx === 13.7701 &&
      value4326.miny === 52.3284 &&
      value4326.maxy === 52.6877
  );
  let isBrandenburg = $derived(
    value4326.minx === 11.1343 &&
      value4326.maxx === 15 &&
      value4326.miny === 51.2075 &&
      value4326.maxy === 53.6987
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
    value4326 = transformExtent(newTransformedValue, crs.label, 'EPSG:4326');
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
</script>

<div class="extent-field">
  <fieldset>
    <legend>{fieldConfig?.label}</legend>
    <div class="tools">
      <SelectInput bind:value={crsKey} key={KEY} label={CRS_LABEL} options={CRS_OPTIONS} />
      <Button
        type="button"
        variant={isBerlin ? 'raised' : 'text'}
        title="Räumliche Ausdehnung auf Berlin setzen"
        onclick={() => {
          value4326 = {
            minx: 13.079,
            maxx: 13.7701,
            miny: 52.3284,
            maxy: 52.6877
          };
          sendValue();
        }}
      >
        <Label>Berlin</Label>
        <Icon class="material-icons">pageless</Icon>
      </Button>
      <Button
        type="button"
        variant={isBrandenburg ? 'raised' : 'text'}
        title="Räumliche Ausdehnung auf Brandenburg setzen"
        onclick={() => {
          value4326 = {
            minx: 11.1343,
            maxx: 15,
            miny: 51.2075,
            maxy: 53.6987
          };
          sendValue();
        }}
      >
        <Label>Brandenburg</Label>
        <Icon class="material-icons">pageless</Icon>
      </Button>
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
          input$step={['EPSG:4326', 'EPSG:4258'].includes(crs.label) ? '0.0001' : undefined}
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
          input$step={['EPSG:4326', 'EPSG:4258'].includes(crs.label) ? '0.0001' : undefined}
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
          input$step={['EPSG:4326', 'EPSG:4258'].includes(crs.label) ? '0.0001' : undefined}
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
          input$step={['EPSG:4326', 'EPSG:4258'].includes(crs.label) ? '0.0001' : undefined}
          validationResult={getFieldValidation('maxy')}
        />
      </div>
      <ValidationFeedbackText validationResult={generalValidationResult} />
    </div>
  </fieldset>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

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
      border-radius: 4px;
      justify-content: space-between;

      > legend {
        font-size: 0.75em;
      }

      .tools {
        display: flex;
        flex-direction: column;

        :global(.select-input .mdc-line-ripple::before) {
          border-bottom: 0;
        }
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
