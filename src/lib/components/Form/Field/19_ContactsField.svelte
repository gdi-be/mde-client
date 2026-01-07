<script lang="ts">
  import type { Contact, Contacts } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContext.svelte';
  import AutoFillButton from '$lib/components/Form/AutoFillButton.svelte';
  import { toast } from 'svelte-french-toast';

  const KEY = 'isoMetadata.pointsOfContact';

  type ContactListEntry = Contact & { listId: string };

  let contacts = $state<ContactListEntry[]>([]);
  const valueFromData = $derived(getValue<Contacts>(KEY));
  let isEditing = $state<boolean>(false);

  $effect(() => {
    if (valueFromData && valueFromData.length > 0) {
      contacts =
        valueFromData?.map((contact) => {
          const listId = crypto.randomUUID();
          return {
            listId,
            name: contact.name || '',
            organisation: contact.organisation || '',
            phone: contact.phone || '',
            email: contact.email || ''
          };
        }) || [];
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<Contacts>(19);
  let validationResult = $derived(fieldConfig?.validator(contacts));

  const nameConfig = getFieldConfig<string>(20);
  const organisationConfig = getFieldConfig<string>(21);
  const phoneConfig = getFieldConfig<string>(22);
  const emailConfig = getFieldConfig<string>(23);

  const autoFillUserDetails = async () => {
    addItem();
    const contact = contacts[0];
    const response = await fetch('/userdetails', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!response.ok) {
      toast.error('Fehler beim automatischen Abrufen der Kontaktdaten. Bitte manuell eingeben.');
      return Promise.reject('Fehler beim Abrufen der Kontaktdaten. Bitte manuell eingeben.');
    }

    const json = await response.json();
    contact.name = json.firstName + ' ' + json.lastName;
    contact.phone = json.phone;
    contact.email = json.email;
    persistContacts();
  };

  const onBlur = async () => {
    await persistContacts();
    isEditing = false;
  };

  const onFocus = () => {
    isEditing = true;
  };

  const persistContacts = async (evt?: FocusEvent) => {
    // Due to the SvelteKit lifecycle the blur effect gets trigger twice
    // this leads to a loss of focus on the input field. This need to be fixed.
    const focusedElement = evt?.relatedTarget as HTMLElement | null;

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

    if (!focusedElement) return;
    setTimeout(() => {
      const elementToFocus = document.getElementById(focusedElement.id);
      elementToFocus?.focus();
    }, 300);
  };

  const addItem = (evt?: MouseEvent) => {
    if (evt) evt.preventDefault();
    const listId = crypto.randomUUID();
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
    persistContacts();
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
</script>

<div class="contacts-field">
  <fieldset>
    <legend>
      <span>{fieldConfig?.label}</span>
      <IconButton
        class="material-icons"
        disabled={isEditing}
        onclick={(evt) => addItem(evt)}
        size="button"
        title="Kontakt hinzufügen"
        type="button"
      >
        add
      </IconButton>
    </legend>
    <FieldHint {validationResult} {fieldConfig} />
    {#each contacts as contact, index (contact.listId)}
      <fieldset class="contact">
        <legend>
          <IconButton
            class="material-icons"
            disabled={isEditing}
            onclick={(evt) => removeItem(contact.listId, evt)}
            size="button"
            title="Kontakt entfernen"
            type="button"
          >
            delete
          </IconButton>
        </legend>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.name}
            label={nameConfig?.label}
            onblur={onBlur}
            onfocus={onFocus}
            fieldConfig={nameConfig}
            validationResult={nameConfig?.validator(contact.name)}
            id={`${KEY}-${index}-name`}
          />
          <FieldTools key={`${KEY}[${index}].name`} noHelpButton noCheckmark {fieldConfig} />
        </div>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.organisation}
            label={organisationConfig?.label}
            onblur={onBlur}
            onfocus={onFocus}
            fieldConfig={organisationConfig}
            validationResult={organisationConfig?.validator(contact.organisation)}
            id={`${KEY}-${index}-organisation`}
          />
          <FieldTools
            key={`${KEY}[${index}].organisation`}
            noHelpButton
            noCheckmark
            {fieldConfig}
          />
        </div>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.phone}
            label={phoneConfig?.label}
            onblur={onBlur}
            onfocus={onFocus}
            fieldConfig={phoneConfig}
            validationResult={phoneConfig?.validator(contact.phone)}
            id={`${KEY}-${index}-phone`}
          />
          <FieldTools key={`${KEY}[${index}].phone`} noHelpButton noCheckmark {fieldConfig} />
        </div>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.email}
            label={emailConfig?.label}
            onblur={onBlur}
            onfocus={onFocus}
            fieldConfig={emailConfig}
            validationResult={emailConfig?.validator(contact.email)}
            id={`${KEY}-${index}-email`}
          />
          <FieldTools key={`${KEY}[${index}].email`} noHelpButton noCheckmark {fieldConfig} />
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools noCopyButton key={KEY} bind:checkMarkAnmiationRunning={showCheckmark}>
    <AutoFillButton title="Eigene Kontaktdaten übernehmen" onclick={autoFillUserDetails} />
  </FieldTools>
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

      .subfield-wrapper {
        display: flex;

        :global(.text-input) {
          flex: 1;
        }
      }

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
