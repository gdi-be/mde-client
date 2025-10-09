<script lang="ts">
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import NumberInput from '../Inputs/NumberInput.svelte';
  import type { CRS, Extent } from '$lib/models/metadata';
  import Button, { Icon, Label } from '@smui/button';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { getHighestRole, transformExtent } from '$lib/util';
  import type { Option } from '$lib/models/form';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  type ExtentOption = {
    title: string;
    value: Extent;
  };

  const KEY = 'isoMetadata.extent';
  const CRS_KEY = 'isoMetadata.crs';
  const CRS_LABEL = 'Koordinatensystem';

  const token = $derived(getAccessToken());
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

  const fieldConfig = getFieldConfig<Extent>(18);
  const minXFieldConfig = getFieldConfig<number>(71);
  const maxXFieldConfig = getFieldConfig<number>(72);
  const minYFieldConfig = getFieldConfig<number>(73);
  const maxYFieldConfig = getFieldConfig<number>(74);

  let validationResultMinX = $derived(minXFieldConfig?.validator(transformedValue.minx));
  let validationResultMinY = $derived(minYFieldConfig?.validator(transformedValue.miny));
  let validationResultMaxX = $derived(maxXFieldConfig?.validator(transformedValue.maxx));
  let validationResultMaxY = $derived(maxYFieldConfig?.validator(transformedValue.maxy));

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

  onMount(async () => {
    const crsResponse = await fetch('/data/crs');

    if (!crsResponse.ok) {
      toast.error('Fehler beim Abrufen der CRS Optionen');
    } else {
      crsOptions = await crsResponse.json();
      if (!crsKey && crsOptions[0].key) {
        crsKey = crsOptions[0].key as CRS;
      }
    }

    const extentResponse = await fetch('/data/extents');
    if (!extentResponse.ok) {
      toast.error('Fehler beim Abrufen der Extent Optionen');
      return;
    }

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
            label={minXFieldConfig?.label}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'minx');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMinX}
          />
          <NumberInput
            value={transformedValue.maxx}
            label={maxXFieldConfig?.label}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'maxx');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMaxX}
          />
        </div>
        <div class="inline-fields">
          <NumberInput
            value={transformedValue.miny}
            label={minYFieldConfig?.label}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'miny');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMinY}
          />
          <NumberInput
            value={transformedValue.maxy}
            label={maxYFieldConfig?.label}
            onblur={sendValue}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(Number(target.value), 'maxy');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMaxY}
          />
        </div>
      </div>
    </fieldset>
    <FieldTools noCopyButton key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
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
      flex-wrap: wrap;
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
          flex-wrap: wrap;
          justify-content: space-evenly;
        }
      }
    }
  }
</style>
