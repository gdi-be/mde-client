<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import NumberInput from "../Inputs/NumberInput.svelte";
  import type { CRS, Extent } from "$lib/models/metadata";
  import { invalidateAll } from "$app/navigation";
  import Button, { Icon, Label } from "@smui/button";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import { transformExtent } from "$lib/util";

  const KEY = 'isoMetadata.extent'
  const CRS_KEY = 'isoMetadata.crs';
  const LABEL = 'Räumliche Ausdehnung';
  const CRS_LABEL = 'Koordinatensystem';
  const LABEL_MAX_X = 'Maximaler X-Wert';
  const LABEL_MIN_X = 'Minimaler X-Wert';
  const LABEL_MAX_Y = 'Maximaler Y-Wert';
  const LABEL_MIN_Y = 'Minimaler Y-Wert';

  const CRS_OPTIONS: {
    key: string,
    label: CRS
  }[] = [{
    key: 'http://www.opengis.net/def/crs/EPSG/0/25833',
    label: 'EPSG:25833'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/4326',
    label: 'EPSG:4326'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/3857',
    label: 'EPSG:3857'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/4258',
    label: 'EPSG:4258'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/25832',
    label: 'EPSG:25832'
  }, {
    key: 'http://www.opengis.net/def/crs/EPSG/0/3035',
    label: 'EPSG:3035'
  }];

  let initialValue = getValue<Extent>(KEY);
  let initialCRSKey = getValue<CRS>(CRS_KEY);
  let value4326 = $state(initialValue || {
    minx: NaN,
    maxx: NaN,
    miny: NaN,
    maxy: NaN
  });
  let crsKey = $state(initialCRSKey || CRS_OPTIONS[1].key);
  let crs = $derived(CRS_OPTIONS.find(option => option.key === crsKey) || CRS_OPTIONS[1]);
  let showCheckmark = $state(false);
  let transformedValue = $derived(crs ? transformExtent(value4326, 'EPSG:4326', crs.label) : value4326);
  let isBerlin = $derived(value4326.minx === 13.0790 && value4326.maxx === 13.7701 && value4326.miny === 52.3284 && value4326.maxy === 52.6877);
  let isBrandenburg = $derived(value4326.minx === 11.1343 && value4326.maxx === 15 && value4326.miny === 51.2075 && value4326.maxy === 53.6987);

  const onChange = (newValue: number, key: keyof Extent) => {
    const newTansformedValue = {
      ...transformedValue,
      [key]: newValue
    };
    value4326 = transformExtent(newTansformedValue, crs.label, 'EPSG:4326');
  };

  const sendValue = async () => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: value4326
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

</script>

<div class="extent-field">
  <fieldset>
    <legend>{LABEL}</legend>
    <div class="tools">
      <SelectInput
        bind:value={crsKey}
        key={KEY}
        label={CRS_LABEL}
        options={CRS_OPTIONS}
      />
      <Button
        type="button"
        variant={isBerlin ? 'raised' : 'text'}
        title="Räumliche Ausdehnung auf Berlin setzen"
        onclick={() => {
          value4326 = {
            minx: 13.0790,
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
          }
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
        />
      </div>
    </div>
  </fieldset>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
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

      >legend {
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
