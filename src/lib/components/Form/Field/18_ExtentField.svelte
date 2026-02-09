<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import FieldHint from '../FieldHint.svelte';
  import NumberInput from '../Inputs/NumberInput.svelte';
  import type { CRS, Extent } from '$lib/models/metadata';
  import { MetadataService } from '$lib/services/MetadataService';
  import Button, { Icon, Label } from '@smui/button';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { getHighestRole, registerCRSCodes, transformExtent } from '$lib/util';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import type { CRSOption } from '$lib/models/api';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  type ExtentOption = {
    title: string;
    value: Extent;
  };

  const KEY = 'isoMetadata.extent';
  const CRS_KEY = 'isoMetadata.crs';
  const CRS_LABEL = 'Koordinatensystem';

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const { getValue } = getFormContext();
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
  let crsOptions = $state<CRSOption[]>([]);
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

  const minXFieldConfig = MetadataService.getFieldConfig<number>(71);
  const maxXFieldConfig = MetadataService.getFieldConfig<number>(72);
  const minYFieldConfig = MetadataService.getFieldConfig<number>(73);
  const maxYFieldConfig = MetadataService.getFieldConfig<number>(74);

  let validationResultMinX = $derived(minXFieldConfig?.validator(transformedValue.minx));
  let validationResultMinY = $derived(minYFieldConfig?.validator(transformedValue.miny));
  let validationResultMaxX = $derived(maxXFieldConfig?.validator(transformedValue.maxx));
  let validationResultMaxY = $derived(maxYFieldConfig?.validator(transformedValue.maxy));

  let hasInvalidFields = $derived(
    validationResultMinX?.valid === false ||
      validationResultMinY?.valid === false ||
      validationResultMaxX?.valid === false ||
      validationResultMaxY?.valid === false
  );

  const onChange = (newValue: number, key: keyof Extent) => {
    const newTransformedValue = {
      ...transformedValue,
      [key]: newValue
    };
    value4326 = transformExtent(newTransformedValue, crs?.label as CRS, 'EPSG:4326');
  };

  const sendValue = async () => {
    const response = await MetadataService.persistValue(KEY, value4326);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  onMount(async () => {
    const crsResponse = await fetch('/data/crs');

    if (!crsResponse.ok) {
      toast.error(t('general.error_fetch_options'));
    } else {
      crsOptions = await crsResponse.json();
      registerCRSCodes(crsOptions);
      if (!crsKey && crsOptions[0].key) {
        crsKey = crsOptions[0].key as CRS;
      }
    }

    const extentResponse = await fetch('/data/extents');
    if (!extentResponse.ok) {
      toast.error(t('general.error_fetch_options'));
      return;
    }

    extentOptions = await extentResponse.json();
  });
</script>

{#if highestRole !== 'MdeDataOwner'}
  <div class="extent-field">
    <fieldset class={[hasInvalidFields ? 'invalid' : '']}>
      <legend>{t('18_ExtentField.label')}</legend>
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
            label={t('18_ExtentField.label_min_x')}
            fieldConfig={minXFieldConfig}
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
            label={t('18_ExtentField.label_max_x')}
            fieldConfig={maxXFieldConfig}
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
            label={t('18_ExtentField.label_min_y')}
            fieldConfig={minYFieldConfig}
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
            label={t('18_ExtentField.label_max_y')}
            fieldConfig={maxYFieldConfig}
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
      <FieldHint fieldConfig={minXFieldConfig} explanation={t('18_ExtentField.explanation')} />
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

      &.invalid {
        border: 2px solid var(--mdc-theme-error) !important;
      }

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
