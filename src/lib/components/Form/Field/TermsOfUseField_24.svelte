<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import IconButton from "@smui/icon-button";
  import Button, { Icon, Label } from "@smui/button";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Textfield from "@smui/textfield";

  const KEY = 'isoMetadata.termsOfUse';
  const LABEL = 'Nutzungsbedingungen*';

  // TODO: Options are extendable and so need to be fetched from the server/db
  const OPTIONS: {
    key: string;
    label: string;
  }[] = $state([{
    key: 'Deutschland - Namensnennung - Version 2.0',
    label: 'Deutschland - Namensnennung - Version 2.0'
  }]);

  let open = $state(false);
  let newConditionValue = $state('');

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

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
    <SelectInput
      key={KEY}
      label={LABEL}
      options={OPTIONS}
      {value}
      {onChange}
    />

    <IconButton
      type="button"
      size="button"
      onclick={() => open = true}
    >
      <Icon class="material-icons">add</Icon>
    </IconButton>
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
      display: flex;
      align-items: center;
    }

    :global(.mdc-select) {
      flex: 1;
      display: flex;
    }
  }
</style>
