<script lang=ts>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    type MetadataProfile
  } from "$lib/models/metadata";
  import Button from "@smui/button";
  import Select, { Option } from "@smui/select";
  import Textfield from "@smui/textfield";
  import log from "loggisch";
  import MetadataSearchField from "$lib/components/MetadataSearchField.svelte";

  let title = $state<string>('');
  let metadataProfile = $state<MetadataProfile>('ISO');
  let cloneMetadataId = $state<Option>();

  const allFieldsValid = $derived.by(() => {
    return title.length > 0 && metadataProfile.length;
  });

  const onCreateClick = async () => {
    const response = await fetch($page.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title,
        metadataProfile,
        cloneMetadataId: cloneMetadataId?.key
      })
    });

    if (response.ok) {
      const { metadataId } = await response.json();

      if (metadataId) {
        goto(`/metadata/${metadataId}`);
      } else {
        log.error('No metadataId in response');
      }
    }
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
      <Option value="INSPIRE_HARMONISED">Inspire (harmonisiert)</Option>
      <Option value="INSPIRE_IDENTIFIED">Inspire (identified)</Option>
  </Select>
  <MetadataSearchField
    bind:value={cloneMetadataId}
    label="Metadaten kopieren"
  />
  <Button
    variant="raised"
    onclick={onCreateClick}
    disabled={!allFieldsValid}
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
