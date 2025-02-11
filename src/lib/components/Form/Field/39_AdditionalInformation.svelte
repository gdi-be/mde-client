<script lang="ts">
  import IconButton from "@smui/icon-button";
  import { getFieldConfig, getValue, persistValue } from "$lib/context/FormContext.svelte";;
  import TextInput from "../Inputs/TextInput.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { fly, scale } from "svelte/transition";

  type AdditionalInformationListEntry = {
    listId: string;
    value: string;
  };

  const KEY = 'isoMetadata.UNKNOWN';

  const valueFromData = $derived(getValue<string[]>(KEY));
  let values = $state<AdditionalInformationListEntry[]>([]);
  $effect(() => {
    if (valueFromData) {
      values = valueFromData?.map(value => {
        const listId = (Math.floor(Math.random() * 1000000) + Date.now()).toString(36);
        return {
          listId,
          value
        };
      })
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<string[]>(KEY);

  const persist = async () => {
    const response = await persistValue(KEY, values);
    if (response.ok) {
      showCheckmark = true;
    }
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
    <legend>{fieldConfig?.label || 'TODO: Weitere Informationen'}
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
    bind:checkMarkAnmiationRunning={showCheckmark}
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
