<script lang=ts>
  import { page } from "$app/stores";
  import {
    type MetadataProfile,
    type MetadataId
  } from "$lib/models/metadata";
  import Button from "@smui/button";
  import Select, { Option } from "@smui/select";
  import Textfield from "@smui/textfield";

  let title = $state<string>('');
  let metadataProfile = $state<MetadataProfile>('ISO');
  let metadataCloneID = $state<MetadataId | undefined>();

  const onCreateClick = async () => {
    fetch($page.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title,
        metadataProfile,
        metadataCloneID
      })
    });
  };

</script>

<div>
  <h1>Neuerfassung</h1>
  <Textfield
    bind:value={title}
    label="Titel"
    required
  />
  <Select
    bind:value={metadataProfile}
    label="Vorlage"
    required
  >
      <Option value="ISO">ISO</Option>
      <Option value="INSPIRE_HARMONIZED">Inspire (harmonisiert)</Option>
      <Option value="INSPIRE_IDENTIFIED">Inspire (identified)</Option>
  </Select>
  <Button
    variant="raised"
    onclick={onCreateClick}
  >
    Metadaten anlegen
  </Button>
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    gap: 1em
  }
</style>
