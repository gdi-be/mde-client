<script lang="ts">
  import type { Contact, Contacts } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import {
    getFieldConfig,
    getSubFieldConfig,
    getValue,
    persistValue
  } from '$lib/context/FormContext.svelte';
  import TextInput from '../Inputs/TextInput.svelte';
  import FieldTools from '../FieldTools.svelte';
  import FieldHint from '../FieldHint.svelte';
  import type { ValidationResult, ValidationResultList } from '../FieldsConfig';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';

  const KEY = 'isoMetadata.pointsOfContact';

  type ContactListEntry = Contact & { listId: string };

  let contacts = $state<ContactListEntry[]>([]);
  const valueFromData = $derived(getValue<Contacts>(KEY));
  $effect(() => {
    if (valueFromData && valueFromData.length > 0) {
      contacts =
        valueFromData?.map((contact) => {
          const listId = (Math.floor(Math.random() * 1000000) + Date.now()).toString(36);
          return {
            listId,
            name: contact.name || '',
            organisation: contact.organisation || '',
            phone: contact.phone || '',
            email: contact.email || ''
          };
        }) || [];
    } else {
      contacts = [
        {
          listId: Date.now().toString(36),
          name: '',
          organisation: '',
          phone: '',
          email: ''
        }
      ];
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<Contacts>(KEY);
  let validationResult = $derived(fieldConfig?.validator(contacts)) as ValidationResultList;
  let generalValidationResult = $derived(
    validationResult?.find(({ index }) => index === undefined)
  );

  const persistContacts = async () => {
    const value = contacts.map((contact) => ({
      name: contact.name,
      organisation: contact.organisation,
      phone: contact.phone,
      email: contact.email
    }));
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = (evt: MouseEvent) => {
    evt.preventDefault();
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

  const removeItem = (listId: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        contacts = contacts.filter((contact) => contact.listId !== listId);
        persistContacts();
      },
      {
        text: 'Möchten Sie diesen Kontakt wirklich löschen?',
        confirmButtonText: 'Löschen'
      }
    );
  };

  const getFieldValidation = (i: number, k: string): ValidationResult | undefined => {
    if (!Array.isArray(validationResult)) return;
    return validationResult.find(({ index, subKey }) => index === i && subKey === k);
  };
</script>

<div class="contacts-field">
  <fieldset>
    <legend>
      <span>{fieldConfig?.label}</span>
      <IconButton
        class="material-icons"
        onclick={(evt) => addItem(evt)}
        size="button"
        title="Kontakt hinzufügen"
      >
        add
      </IconButton>
    </legend>
    <FieldHint validationResult={generalValidationResult} {fieldConfig} />
    {#each contacts as contact, index (contact.listId)}
      <fieldset class="contact">
        <legend>
          <IconButton
            class="material-icons"
            onclick={(evt) => removeItem(contact.listId, evt)}
            size="button"
            title="Kontakt entfernen"
          >
            delete
          </IconButton>
        </legend>
        <TextInput
          bind:value={contact.name}
          label="Name"
          onblur={persistContacts}
          validationResult={getFieldValidation(index, 'name')}
          fieldConfig={getSubFieldConfig(KEY, 'name')}
        />
        <TextInput
          bind:value={contact.organisation}
          label="Organisation"
          onblur={persistContacts}
          validationResult={getFieldValidation(index, 'organisation')}
          fieldConfig={getSubFieldConfig(KEY, 'organisation')}
        />
        <TextInput
          bind:value={contact.phone}
          label="Telefon"
          onblur={persistContacts}
          validationResult={getFieldValidation(index, 'phone')}
          fieldConfig={getSubFieldConfig(KEY, 'phone')}
        />
        <TextInput
          bind:value={contact.email}
          label="E-Mail"
          onblur={persistContacts}
          validationResult={getFieldValidation(index, 'email')}
          fieldConfig={getSubFieldConfig(KEY, 'email')}
        />
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .contacts-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 4px;

      > legend {
        display: flex;
        align-items: center;
        font-size: 1.5em;
      }
    }

    .contact {
      display: flex;
      flex-direction: column;
      gap: 1em;

      legend {
        text-align: right;
      }

      :global(.text-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.text-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }
    }
  }
</style>
