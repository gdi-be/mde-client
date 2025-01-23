<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import IconButton from "@smui/icon-button";
  import Button, { Icon, Label } from "@smui/button";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Textfield from "@smui/textfield";
  import type { Option } from "$lib/models/form";
  import SelectInput from "../Inputs/SelectInput.svelte";

  const KEY = 'isoMetadata.resourceConstraints';
  const LABEL = 'Nutzungsbedingungen*';
  const title = getValue<string>('isoMetadata.title') || '[Datensatztitel]';

  // TODO: Options are extendable and so need to be fetched from the server/db
  const OPTIONS: Option[] = $state([
    {
      key: 'default',
      label: 'Standard',
      description: `Für die Nutzung der Daten ist die Datenlizenz Deutschland - Namensnennung - Version 2.0 anzuwenden. Die Lizenz ist über https://www.govdata.de/dl-de/by-2-0 abrufbar. Der Quellenvermerk gemäß (2)  der Lizenz lautet "Geoportal Berlin / ${title}".`
    },
    {
      key: 'defaultNoBrandenburg',
      label: 'Standard ohne Brandenburg',
      description: `Für die Nutzung der Daten ist die Datenlizenz Deutschland - Namensnennung - Version 2.0 anzuwenden. Die Lizenz ist über https://www.govdata.de/dl-de/by-2-0 abrufbar. Der Quellenvermerk gemäß (2)  der Lizenz lautet "Geoportal Berlin / ${title}". Gilt nicht für Brandenburger Landesteile.`
    },
    {
      key: 'environmentalAtlas',
      label: 'Umweltatlas',
      description: `Für die Nutzung der Daten ist die  Datenlizenz Deutschland - Namensnennung - Version 2.0 anzuwenden. Die Lizenz ist über https://www.govdata.de/dl-de/by-2-0 abrufbar. Der Quellenvermerk gemäß (2)  der Lizenz lautet "Umweltatlas Berlin / ${title}".`
    },
    {
      key: 'statisticOffice',
      label: 'Amt für Statistik',
      description: `Der Datenbestand wird unter der Lizenz CC-BY-3.0-Namensnennung veröffentlicht (vgl. https://creativecommons.org/licenses/by/3.0/de/). Als Urheber ist dabei zu nennen: Amt für Statistik Berlin-Brandenburg.`
    },
    {
      key: 'standardWitBrandenburg',
      label: 'Standard mit Brandenburg',
      description: `Nutzungsbedingungen: Für die Nutzung der Daten ist die  Datenlizenz Deutschland - Namensnennung - Version 2.0 anzuwenden. Die Lizenz ist über https://www.govdata.de/dl-de/by-2-0 abrufbar. Der Quellenvermerk gemäß (2)  der Lizenz lautet "Geoportal Berlin / ${title}". Werden auch Daten des Bundeslandes Brandenburg genutzt, ist der Quellenvermerk um den Hinweis "© GeoBasis-DE/LGB (2023), dl-de/by-2-0, Daten geändert" zu ergänzen.`
    },
    {
      key: 'serviceUse',
      label: 'Dienstgebrauch',
      description: `Nur für den Dienstgebrauch gemäß GG0 I §45`
    }
  ]);

  let open = $state(false);
  let newConditionValue = $state('');

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);
  let selectedDescription = $derived(OPTIONS.find(o => o.key === value)?.description);

  const onChange = async (newValue?: string) => {
    // TODO: Implement
    console.log(newValue);
  };

  const onAddClick = () => {
    // TODO: Implement
    OPTIONS.push({
      key: newConditionValue,
      label: newConditionValue
    });
  };

</script>

<Dialog
  class="terms-of-use-dialog"
  bind:open
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">Nutzungsbedingung hinzufügen</Title>
  <Content id="simple-content">
    <Textfield
      label="Neue Nutzungsbedingung"
      bind:value={newConditionValue}
    />
  </Content>
  <Actions>
    <Button
      variant="outlined"
      type="button"
      onclick={() => open = false}
    >
      <Label>Abbrechen</Label>
    </Button>
    <Button
      variant="raised"
      type="button"
      onclick={onAddClick}
    >
      <Label>Hinzufügen</Label>
    </Button>
  </Actions>
</Dialog>

<div class="terms-of-use-field">
  <Paper>
    <div class="inline-fields">
      <SelectInput
        key={KEY}
        label={LABEL}
        options={OPTIONS}
        bind:value
        {onChange}
      />
      <IconButton
        type="button"
        size="button"
        onclick={() => open = true}
        disabled
      >
        <Icon class="material-icons">add</Icon>
      </IconButton>
    </div>
    {#if selectedDescription}
      <p class="description">{selectedDescription}</p>
    {/if}
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  :global(.terms-of-use-dialog .mdc-text-field) {
    width: 100%;
  }

  .terms-of-use-field {
    position: relative;
    display: flex;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }

    .inline-fields {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .description {
      font-size: 0.75em;
      color: var(--mdc-theme-secondary);
    }

    :global(.mdc-select) {
      flex: 1;
      display: flex;
    }
  }
</style>
