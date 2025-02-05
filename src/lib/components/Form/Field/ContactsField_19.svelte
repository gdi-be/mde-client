<script lang="ts">
  import { page } from "$app/state";
  import type { Contacts } from "$lib/models/metadata";
  import IconButton from "@smui/icon-button";
  import { getFieldConfig, getValue } from "../FormContext.svelte";
  import TextInput from "../Inputs/TextInput.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import { fly, scale } from "svelte/transition";

  const KEY = 'isoMetadata.pointsOfContact';
  const LABEL = 'Kontakt';

  let initialContacts = getValue<Contacts>(KEY);
  const fieldConfig = getFieldConfig<Contacts>(KEY);
  let initialValue = initialContacts?.map(contact => {
    const listId = (Math.floor(Math.random() * 1000000) + Date.now()).toString(36);
    return {
      listId,
      name: contact.name || '',
      organisation: contact.organisation || '',
      phone: contact.phone || '',
      email: contact.email || ''
    };
  });

  let contacts = $state(initialValue || []);
  let showCheckmark = $state(false);
  let validationResult = $derived(fieldConfig?.validator(contacts));

  const persistContacts = async () => {
    // TODO add equals check to prevent unnecessary requests
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: contacts.map(contact => ({
          name: contact.name,
          organisation: contact.organisation,
          phone: contact.phone,
          email: contact.email
        }))
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

  const addItem = () => {
    const listId = Date.now().toString(36);
    contacts = [
      {
        listId,
        name: '',
        organisation: '',
        phone: '',
        email: ''
      },
      ...contacts
    ];
  };

  const removeItem = (listId: string) => {
    // TODO: add popconfirm
    contacts = contacts.filter(contact => contact.listId !== listId);
    persistContacts();
  };

  const getValidation = (i: number, k: string) => {
    if (!Array.isArray(validationResult)) return {};
    const matchingValidation =  validationResult.find(({index, subKey}) => index === i && subKey === k);
    return {
      isValid: matchingValidation?.valid,
      helpText: matchingValidation?.helpText
    }
  };

</script>

<div class="contacts-field">
  <fieldset>
    <legend>{LABEL}
      <IconButton
        class="material-icons"
        onclick={() => addItem()}
        size="button"
        title="Kontakt hinzufügen"
      >
        add
      </IconButton>
    </legend>
    {#each contacts as contact, index (contact.listId)}
      <fieldset class="contact" in:fly={{ y: -100 }} out:scale={{ duration: 200 }}>
        <legend>
          <IconButton
          class="material-icons"
          onclick={() => removeItem(contact.listId)}
          size="button"
          title="Kontakt entfernen"
        >
          delete
        </IconButton>
        </legend>
        <TextInput
          bind:value={contact.name}
          key={KEY}
          label="Name"
          onblur={persistContacts}
          {...getValidation(index, 'name')}
        />
        <TextInput
          bind:value={contact.organisation}
          key={KEY}
          label="Organisation"
          onblur={persistContacts}
          {...getValidation(index, 'organisation')}
        />
        <TextInput
          bind:value={contact.phone}
          key={KEY}
          label="Telefon"
          onblur={persistContacts}
          {...getValidation(index, 'phone')}
        />
        <TextInput
          bind:value={contact.email}
          key={KEY}
          label="E-Mail"
          onblur={persistContacts}
          {...getValidation(index, 'email')}
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
  .contacts-field {
    position: relative;
    display: flex;
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
