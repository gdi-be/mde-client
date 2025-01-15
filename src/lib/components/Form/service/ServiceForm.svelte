<script lang="ts">
  import type { Service } from "$lib/models/metadata";
  import Paper from "@smui/paper";
  import TextAreaInput from "../Inputs/TextAreaInput.svelte";
  import TextInput from "../Inputs/TextInput.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import { setNestedValue } from "../../../util";
  import NumberInput from "../Inputs/NumberInput.svelte";

  export type ServiceFormProps = {
    service: Service;
    onChange?: (service: Service) => void;
  };

  let {
    service,
    onChange = () => {}
  }: ServiceFormProps = $props();

  // let isDownloadService = $derived(service.serviceType === 'WFS' || service.serviceType === 'ATOM');
  let isDisplayService = $derived(service.serviceType === 'WMS' || service.serviceType === 'WMTS');

  function setByEvent(key: string, e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    set(key, value);
  }

  function set(key: string, value: string) {
    service = setNestedValue(service, key, value);
    onChange(service);
  }

</script>

<div class="service-form">
  <Paper>
    <SelectInput
      label="Typ"
      key="type"
      value={service.serviceType}
      options={[{
        key: 'ATOM',
        label: '🗃️ ATOM'
      }, {
        key: 'WFS',
        label: '🗃️ WFS'
      }, {
        key: 'WMS',
        label: '🗺️ WMS'
      }, {
        key: 'WMTS',
        label: '🗺️ WMTS'
      }]}
      onChange={(value: string) => set("type", value)}
    />
  </Paper>
  <Paper>
    <TextInput
      label="Titel"
      key="title"
      value={service.title}
      maxlength={100}
      onchange={(e: Event) => setByEvent("title", e)}
    />
  </Paper>
  <TextAreaInput
    label="Kurzbeschreibung"
    key="shortDescription"
    value={service.shortDescription}
    maxlength={500}
    onchange={(e: Event) => setByEvent("shortDescription", e)}
  />
  {#if isDisplayService}
    <fieldset class="legend-fieldset">
      <legend>Gesamtlegende</legend>
      <div class="legend-text-fields">
        <TextInput
          label="Format"
          value={service.legendImage?.format}
          maxlength={100}
          onchange={(e: Event) => setByEvent("legendImage.format", e)}
        />
        <TextInput
          label="Url"
          value={service.legendImage?.url}
          maxlength={100}
          onchange={(e: Event) => setByEvent("legendImage.url", e)}
        />
      </div>
      <fieldset>
        <NumberInput
          label="Breite"
          value={service.legendImage?.width}
          onchange={(e: Event) => setByEvent("legendImage.width", e)}
        />
        <NumberInput
          label="Höhe"
          value={service.legendImage?.height}
          onchange={(e: Event) => setByEvent("legendImage.height", e)}
        />
      </fieldset>
    </fieldset>
  {/if}
</div>

<style lang="scss">
  .service-form {
    display: flex;
    flex-direction: column;
    gap: 1em;

    .legend-fieldset {
      display: flex;
      gap: 1em;

      div.legend-text-fields {
        flex: 1;
      }
    }

    :global(label.mdc-text-field),
    :global(.select-input) {
      width: 100%;
    }


  }

</style>
