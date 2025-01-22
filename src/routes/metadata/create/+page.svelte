<script lang=ts>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    type MetadataProfile
  } from "$lib/models/metadata";
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  import log from "loggisch";
  import MetadataSearchField from "$lib/components/MetadataSearchField.svelte";
  import type { Option } from "$lib/models/form";
  import Card, { Content } from "@smui/card";

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

<div class="create-metadata">
  <Card>
    <Content>
      <h1>Neuerfassung</h1>
      <p>
        Hier können Sie neue Metadaten anlegen.
        Wählen sie dazu einen Titel und eine Vorlage aus.
      </p><p>
        Optional können sie die Daten auch von bestehenden Metadaten ableiten.
        Durchsuchen sie dazu unten die Metadaten und wählen sie den gewünschten Datensatz aus.
      </p>
      <Textfield
        bind:value={title}
        label="Titel"
        required
      />
      <MetadataSearchField
        bind:value={cloneMetadataId}
        label="Bestehende Metadaten als Vorlage verwenden"
      />
      <Button
        variant="raised"
        onclick={onCreateClick}
        disabled={!allFieldsValid}
      >
        Metadaten anlegen
      </Button>
    </Content>
  </Card>
</div>

<style lang="scss">
  .create-metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    gap: 1em;

    :global(.smui-card__content) {
      width: 30em;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1em;
    }

    :global(.mdc-text-field),
    :global(.mdc-select),
    :global(.mdc-menu) {
      width: 25em;
    }
  }
</style>
