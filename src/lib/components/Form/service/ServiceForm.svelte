<script lang="ts">
  import type { Service } from "$lib/models/metadata";
  import Paper from "@smui/paper";
  import TextAreaInput from "../Inputs/TextAreaInput.svelte";
  import TextInput from "../Inputs/TextInput.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";

  export type ServiceFormProps = {
    service: Service;
    onChange?: (service: Service) => void;
  };

  let {
    service,
    onChange = () => {}
  }: ServiceFormProps = $props();

  function setByEvent(key: string, e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    set(key, value);
  }

  function set(key: string, value: string) {
    service = {
      ...service,
      [key]: value
    };
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
        key: 'WFS',
        label: 'WFS'
      }, {
        key: 'WMS',
        label: 'WMS'
      }, {
        key: 'ATOM',
        label: 'ATOM'
      },{
        key: 'WMTS',
        label: 'WMTS'
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
</div>

<style lang="scss">
  .service-form {
    display: flex;
    flex-direction: column;
    gap: 1em;

    :global(label.mdc-text-field) {
      width: 100%;
    }
  }

</style>
