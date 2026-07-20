<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import FieldTools from '../FieldTools.svelte';
  import FieldHint from '../FieldHint.svelte';
  import type { CRS, PartialCoordinate, PartialExtent } from '$lib/models/metadata';
  import { MetadataService } from '$lib/services/MetadataService';
  import Button, { Icon, Label } from '@smui/button';
  import SelectInput from '../Inputs/SelectInput.svelte';
  import { getHighestRole, registerCRSCodes, transformCoordinate } from '$lib/util';
  import { onMount, tick } from 'svelte';
  import { toast } from 'svelte-french-toast';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import type { CRSOption } from '$lib/models/api';
  import { page } from '$app/state';
  import { ValidationService } from '$lib/services/ValidationService';
  import { logger } from 'loggisch';
  import TextInput from '../Inputs/TextInput.svelte';

  const t = $derived(page.data.t);

  type ExtentOption = {
    title: string;
    value: PartialExtent;
  };

  const KEY = 'isoMetadata.extent';
  const CRS_KEY = 'isoMetadata.crs';
  const CRS_LABEL = 'Koordinatensystem';
  const emptyExtent: PartialExtent = {
    minx: undefined,
    maxx: undefined,
    miny: undefined,
    maxy: undefined
  };

  const minXFieldConfig = MetadataService.getFieldConfig<number>(71);
  const maxXFieldConfig = MetadataService.getFieldConfig<number>(72);
  const minYFieldConfig = MetadataService.getFieldConfig<number>(73);
  const maxYFieldConfig = MetadataService.getFieldConfig<number>(74);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const { getValue, updateFormState } = getFormContext();
  let initialCRSKey = getValue<CRS>(CRS_KEY);
  const valueFromData = $derived(getValue<PartialExtent>(KEY));
  let value4326 = $state<PartialExtent>(emptyExtent);
  let isEditing = $state(false);

  $effect(() => {
    if (!isEditing && valueFromData) {
      value4326 = valueFromData;
    }
  });

  let extentOptions = $state<ExtentOption[]>([]);
  let crsOptions = $state<CRSOption[]>([]);
  let crsKey = $state(initialCRSKey);
  let crs = $derived(crsOptions.find((option) => option.key === crsKey));
  let selectedCRS = $derived((crs?.label as CRS) || 'EPSG:4326');
  let showCheckmark = $state(false);
  let inputValue = $state<PartialExtent>(emptyExtent);
  let pendingInputKeys = $state<(keyof PartialExtent)[]>([]);
  let pendingInputValue = $state<PartialExtent>(emptyExtent);
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

  let validationResultMinX = $derived(
    ValidationService.validateField(minXFieldConfig, inputValue.minx)
  );
  let validationResultMinY = $derived(
    ValidationService.validateField(minYFieldConfig, inputValue.miny)
  );
  let validationResultMaxX = $derived(
    ValidationService.validateField(maxXFieldConfig, inputValue.maxx)
  );
  let validationResultMaxY = $derived(
    ValidationService.validateField(maxYFieldConfig, inputValue.maxy)
  );

  let hasInvalidFields = $derived(
    validationResultMinX?.valid === false ||
      validationResultMinY?.valid === false ||
      validationResultMaxX?.valid === false ||
      validationResultMaxY?.valid === false
  );

  const fieldConfigByKey = {
    minx: minXFieldConfig,
    miny: minYFieldConfig,
    maxx: maxXFieldConfig,
    maxy: maxYFieldConfig
  };

  const pairByKey = {
    minx: ['minx', 'miny'],
    miny: ['minx', 'miny'],
    maxx: ['maxx', 'maxy'],
    maxy: ['maxx', 'maxy']
  } satisfies Record<keyof PartialExtent, [keyof PartialExtent, keyof PartialExtent]>;

  const toCoordinate = (
    extent: PartialExtent,
    [xKey, yKey]: [keyof PartialExtent, keyof PartialExtent]
  ) => [extent[xKey], extent[yKey]] as PartialCoordinate;

  const hasCoordinate = (coordinate: PartialCoordinate) =>
    coordinate.every((value) => value !== undefined && Number.isFinite(value));

  const addPendingInputKey = (key: keyof PartialExtent, value: number | undefined) => {
    pendingInputKeys = pendingInputKeys.includes(key)
      ? pendingInputKeys
      : [...pendingInputKeys, key];
    pendingInputValue = {
      ...pendingInputValue,
      [key]: value
    };
  };

  const removePendingInputKeys = (keys: (keyof PartialExtent)[]) => {
    pendingInputKeys = pendingInputKeys.filter((key) => !keys.includes(key));
    pendingInputValue = {
      ...pendingInputValue,
      ...Object.fromEntries(keys.map((key) => [key, undefined]))
    };
  };

  const transformCoordinatePair = (
    extent: PartialExtent,
    pair: [keyof PartialExtent, keyof PartialExtent],
    from: CRS,
    to: CRS
  ) => {
    const coordinate = toCoordinate(extent, pair);
    if (!hasCoordinate(coordinate)) return {};

    if (from === to) {
      return {
        [pair[0]]: coordinate[0],
        [pair[1]]: coordinate[1]
      };
    }

    const transformed = transformCoordinate(coordinate, from, to);
    return {
      [pair[0]]: coordinate[0] === 0 ? 0 : transformed[0],
      [pair[1]]: coordinate[1] === 0 ? 0 : transformed[1]
    };
  };

  const transformAvailableExtent = (extent: PartialExtent, from: CRS, to: CRS) => {
    if (from === to) return extent;

    return {
      ...transformCoordinatePair(extent, pairByKey.minx, from, to),
      ...transformCoordinatePair(extent, pairByKey.maxx, from, to)
    };
  };

  $effect(() => {
    if (isEditing) return;

    try {
      const transformedValue = transformAvailableExtent(value4326, 'EPSG:4326', selectedCRS);
      inputValue = {
        ...transformedValue,
        ...Object.fromEntries(pendingInputKeys.map((key) => [key, pendingInputValue[key]]))
      };
    } catch {
      logger.error(t('18_ExtentField.error_transforming_coordinates_from_server'), {
        value4326,
        targetCRS: crs?.label
      });
    }
  });

  const getInputValue = (target: HTMLInputElement) => {
    const value = target.value.trim();
    return value === '' ? undefined : Number(value);
  };

  const normalizeCoordinateValue = (value: unknown) => {
    if (value === '' || value === undefined || value === null) return undefined;
    return Number(value);
  };

  const normalizeInputValue = (extent: PartialExtent): PartialExtent => ({
    minx: normalizeCoordinateValue(extent.minx),
    miny: normalizeCoordinateValue(extent.miny),
    maxx: normalizeCoordinateValue(extent.maxx),
    maxy: normalizeCoordinateValue(extent.maxy)
  });

  const isValidInput = (key: keyof PartialExtent, currentInputValue: PartialExtent) =>
    ValidationService.validateField(fieldConfigByKey[key], currentInputValue[key])?.valid === true;

  const onChange = (newValue: number | undefined, key: keyof PartialExtent) => {
    const newInputValue = {
      ...normalizeInputValue(inputValue),
      [key]: newValue
    };
    inputValue = newInputValue;
    if (pendingInputKeys.includes(key)) {
      pendingInputValue = {
        ...pendingInputValue,
        [key]: newValue
      };
    }

    const validation = ValidationService.validateField(fieldConfigByKey[key], newValue);
    if (validation?.valid !== true) {
      return;
    }

    const pair = pairByKey[key];
    if (!hasCoordinate(toCoordinate(newInputValue, pair))) {
      if (selectedCRS === 'EPSG:4326') {
        const newValue4326 = {
          ...value4326,
          [key]: newValue
        };
        value4326 = newValue4326;
        sendValue(newInputValue, newValue4326);
      } else {
        addPendingInputKey(key, newValue);
      }
      return;
    }

    try {
      const newValue4326 = {
        ...value4326,
        ...transformCoordinatePair(newInputValue, pair, selectedCRS, 'EPSG:4326')
      };
      value4326 = newValue4326;
      removePendingInputKeys([...pair]);
      sendValue(newInputValue, newValue4326);
    } catch {
      toast.error(t('18_ExtentField.error_transforming_coordinates', { key }));
    }
  };

  const sendValue = async (currentInputValue = inputValue, currentValue4326 = value4326) => {
    const persistableExtent = getPersistableExtent(currentInputValue, currentValue4326);
    updateFormState(KEY, persistableExtent);

    const response = await MetadataService.persistValue(KEY, persistableExtent);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const getPersistableExtent = (
    currentInputValue: PartialExtent,
    currentValue4326: PartialExtent
  ) => {
    return {
      minx: isValidInput('minx', currentInputValue) ? currentValue4326.minx : valueFromData?.minx,
      miny: isValidInput('miny', currentInputValue) ? currentValue4326.miny : valueFromData?.miny,
      maxx: isValidInput('maxx', currentInputValue) ? currentValue4326.maxx : valueFromData?.maxx,
      maxy: isValidInput('maxy', currentInputValue) ? currentValue4326.maxy : valueFromData?.maxy
    };
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
        {#each extentOptions as option (option.value)}
          <Button
            type="button"
            variant={matchingOption?.title === option.title ? 'raised' : 'text'}
            title={option.title}
            onclick={async () => {
              value4326 = option.value;
              pendingInputKeys = [];
              pendingInputValue = emptyExtent;
              await tick();
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
          <TextInput
            label={t('18_ExtentField.label_min_x')}
            fieldConfig={minXFieldConfig}
            value={inputValue.minx}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(getInputValue(target), 'minx');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMinX}
            onfocus={() => (isEditing = true)}
            onblur={() => (isEditing = false)}
          />
          <TextInput
            value={inputValue.maxx}
            label={t('18_ExtentField.label_max_x')}
            fieldConfig={maxXFieldConfig}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(getInputValue(target), 'maxx');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMaxX}
            onfocus={() => (isEditing = true)}
            onblur={() => (isEditing = false)}
          />
        </div>
        <div class="inline-fields">
          <TextInput
            value={inputValue.miny}
            label={t('18_ExtentField.label_min_y')}
            fieldConfig={minYFieldConfig}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(getInputValue(target), 'miny');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMinY}
            onfocus={() => (isEditing = true)}
            onblur={() => (isEditing = false)}
          />
          <TextInput
            value={inputValue.maxy}
            label={t('18_ExtentField.label_max_y')}
            fieldConfig={maxYFieldConfig}
            onchange={(evt) => {
              const target = evt?.target as HTMLInputElement;
              onChange(getInputValue(target), 'maxy');
            }}
            step={['EPSG:4326', 'EPSG:4258'].includes(crs?.label as CRS) ? '0.0001' : undefined}
            validationResult={validationResultMaxY}
            onfocus={() => (isEditing = true)}
            onblur={() => (isEditing = false)}
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
