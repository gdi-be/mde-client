<script lang="ts">
  import IconButton from "@smui/icon-button";
  import { getValue } from "$lib/context/FormContext.svelte";;
  import TextInput from "../Inputs/TextInput.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { fly, scale } from "svelte/transition";

  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Weitere Informationen';

  let initialDescriptions = getValue<string[]>(KEY);
  let initialValue = initialDescriptions?.map(value => {
    const listId = (Math.floor(Math.random() * 1000000) + Date.now()).toString(36);
    return {
      listId,
      value
    };
  });

  let values = $state(initialValue || []);
  let showCheckmark = $state(false);

  const persist = async () => {
    // TODO implement
  };

  const addItem = () => {
    const listId = Date.now().toString(36);
    values = [
      {
        listId,
        value: ''
      },
      ...values
    ];
  };

  const removeItem = (listId: string) => {
    // TODO: add popconfirm
    values = values.filter(contact => contact.listId !== listId);
    persist();
  };

</script>

<div class="content-description-field">
  <fieldset>
    <legend>{LABEL}
      <IconButton
        class="material-icons"
        onclick={() => addItem()}
        size="button"
        title="Quelle hinzufügen"
      >
        add
      </IconButton>
    </legend>
    {#each values as contact (contact.listId)}
      <fieldset class="contact" in:fly={{ y: -100 }} out:scale={{ duration: 200 }}>
        <legend>
          <IconButton
          class="material-icons"
          onclick={() => removeItem(contact.listId)}
          size="button"
          title="Quelle entfernen"
        >
          delete
        </IconButton>
        </legend>
        <TextInput
          bind:value={contact.value}
          key={KEY}
          label="URL (Dokument oder Website)"
          onblur={persist}
        />
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .content-description-field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 4px;

      >legend {
        display: flex;
        align-items: center;
        font-size: 0.75em;
      }
    }

    .contact {
      legend {
        text-align: right;
      }
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
