<script lang="ts">
  import type { Contact, Contacts } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import { MetadataService } from '$lib/services/MetadataService';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import { getPopconfirm } from '$lib/context/PopConfirmContext.svelte';
  import AutoFillButton from '$lib/components/Form/AutoFillButton.svelte';
  import { toast } from 'svelte-french-toast';
  import { page } from '$app/state';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { getHighestRole } from '$lib/util';

  const t = $derived(page.data.t);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));

  const KEY = 'isoMetadata.pointsOfContact';

  const { getValue } = getFormContext();
  let contacts = $state<Contact[]>([]);
  const valueFromData = $derived(getValue<Contacts>(KEY));

  // important that this is not a state
  let previousValueAsString: string;

  const popconfirm = $derived(getPopconfirm());

  $effect(() => {
    // this check prevents rerendering if nothing has actually changed
    const newValueAsString = JSON.stringify(valueFromData);
    if (
      previousValueAsString === newValueAsString ||
      !valueFromData ||
      valueFromData.length === 0
    ) {
      return;
    }
    contacts =
      valueFromData?.map((contact: Contact) => {
        return {
          id: contact.id,
          name: contact.name || '',
          organisation: contact.organisation || '',
          phone: contact.phone || '',
          email: contact.email || ''
        };
      }) || [];
    previousValueAsString = JSON.stringify(valueFromData);
  });

  let showCheckmark = $state(false);
  const fieldConfig = MetadataService.getFieldConfig<Contacts>(19);
  let validationResult = $derived(fieldConfig?.validator(contacts));

  const nameConfig = MetadataService.getFieldConfig<string>(20);
  const organisationConfig = MetadataService.getFieldConfig<string>(21);
  const phoneConfig = MetadataService.getFieldConfig<string>(22);
  const emailConfig = MetadataService.getFieldConfig<string>(23);

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
      toast.error(t('19_ContactsField.error_fetch'));
      return Promise.reject(t('19_ContactsField.error_fetch'));
    }

    const json = await response.json();
    contact.name = json.firstName + ' ' + json.lastName;
    contact.phone = json.phone;
    contact.email = json.email;
    persistContacts();
  };

  const persistContacts = async (evt?: FocusEvent) => {
    // Due to the SvelteKit lifecycle the blur effect gets trigger twice
    // this leads to a loss of focus on the input field. This need to be fixed.
    const focusedElement = evt?.relatedTarget as HTMLElement | null;
    const response = await MetadataService.persistValue(KEY, contacts);
    if (response.ok) {
      showCheckmark = true;
    }

    if (!focusedElement) return;
    setTimeout(() => {
      const elementToFocus = document.getElementById(focusedElement.id);
      elementToFocus?.focus();
    }, 10);
  };

  const addItem = (evt?: MouseEvent) => {
    if (evt) evt.preventDefault();
    const id = crypto.randomUUID();
    contacts = [
      {
        id,
        name: '',
        organisation: '',
        phone: '',
        email: ''
      },
      ...contacts
    ];
    persistContacts();
  };

  const removeItem = (id: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm.open(
      targetEl,
      async () => {
        contacts = contacts.filter((contact) => contact.id !== id);
        persistContacts();
      },
      {
        text: t('19_ContactsField.delete_confirm'),
        confirmButtonText: t('19_ContactsField.delete')
      }
    );
  };

  let hasInvalidFields = $derived.by(() => {
    if (!fieldConfig) return false;
    const { editingRoles } = fieldConfig;
    const isEditingRole =
      highestRole === 'MdeAdministrator' ||
      (editingRoles ? editingRoles?.includes(highestRole) : true);
    const hasInvalidFields = contacts.some((contact) => {
      const nameValid = nameConfig?.validator(contact.name).valid ?? true;
      const organisationValid = organisationConfig
        ? organisationConfig?.validator(contact.organisation).valid
        : true;
      const phoneValid = phoneConfig ? phoneConfig?.validator(contact.phone).valid : true;
      const emailValid = emailConfig ? emailConfig?.validator(contact.email).valid : true;
      return !nameValid || !organisationValid || !phoneValid || !emailValid;
    });
    return isEditingRole && (!validationResult?.valid || hasInvalidFields);
  });
</script>

<div class="contacts-field">
  <fieldset class={[hasInvalidFields ? 'invalid' : '']}>
    <legend>
      <span>{t('19_ContactsField.label')}</span>
      <IconButton
        class="material-icons"
        onclick={(evt: MouseEvent) => addItem(evt)}
        size="button"
        type="button"
        title={t('19_ContactsField.add')}
      >
        add
      </IconButton>
    </legend>
    <FieldHint {validationResult} {fieldConfig} explanation={t('19_ContactsField.explanation')} />
    {#each contacts as contact, index (contact.id)}
      <fieldset class="contact">
        <legend>
          <IconButton
            class="material-icons"
            onclick={(evt: MouseEvent) => removeItem(contact.id, evt)}
            size="button"
            type="button"
            title={t('19_ContactsField.delete')}
          >
            delete
          </IconButton>
        </legend>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.name}
            label={t('19_ContactsField.name')}
            onblur={persistContacts}
            fieldConfig={nameConfig}
            validationResult={nameConfig?.validator(contact.name)}
            id={`${KEY}-${index}-name`}
          />
          <FieldTools
            key={`${KEY}[${index}].name`}
            noHelpButton
            noCheckmark
            noCloneButton
            {fieldConfig}
          />
        </div>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.organisation}
            label={t('19_ContactsField.organisation')}
            onblur={persistContacts}
            fieldConfig={organisationConfig}
            validationResult={organisationConfig?.validator(contact.organisation)}
            id={`${KEY}-${index}-organisation`}
          />
          <FieldTools
            key={`${KEY}[${index}].organisation`}
            noHelpButton
            noCheckmark
            noCloneButton
            {fieldConfig}
          />
        </div>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.phone}
            label={t('19_ContactsField.phone')}
            onblur={persistContacts}
            fieldConfig={phoneConfig}
            validationResult={phoneConfig?.validator(contact.phone)}
            id={`${KEY}-${index}-phone`}
          />
          <FieldTools
            key={`${KEY}[${index}].phone`}
            noHelpButton
            noCheckmark
            noCloneButton
            {fieldConfig}
          />
        </div>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contact.email}
            label={t('19_ContactsField.email')}
            onblur={persistContacts}
            fieldConfig={emailConfig}
            validationResult={emailConfig?.validator(contact.email)}
            id={`${KEY}-${index}-email`}
          />
          <FieldTools
            key={`${KEY}[${index}].email`}
            noHelpButton
            noCheckmark
            noCloneButton
            {fieldConfig}
          />
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools noCopyButton key={KEY} bind:checkMarkAnmiationRunning={showCheckmark}>
    <AutoFillButton title={t('19_ContactsField.autofill')} onclick={autoFillUserDetails} />
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

      &.invalid {
        border: 2px solid var(--mdc-theme-error) !important;
      }

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
