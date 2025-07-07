<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import type { CI_OnLineFunctionCode, ContentDescription } from '$lib/models/metadata';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';
  import SelectInput from '../Inputs/SelectInput.svelte';

  type ContentDescriptionListEntry = ContentDescription & { listId: string };

  const KEY = 'isoMetadata.contentDescriptions';

  const valueFromData = $derived(getValue<ContentDescription[]>(KEY));
  let contentDescriptions = $state<ContentDescriptionListEntry[]>([]);

  $effect(() => {
    if (valueFromData && valueFromData.length > 0) {
      contentDescriptions = valueFromData?.map((contentDescription) => {
        const { url, description, code } = contentDescription;
        const listId = crypto.randomUUID();
        return {
          listId,
          code,
          description,
          url
        };
      });
    } else {
      contentDescriptions = [
        {
          listId: crypto.randomUUID(),
          code: 'information',
          description: '',
          url: ''
        }
      ];
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<ContentDescription[]>(39);

  const persistContentDescriptions = async () => {
    const value = contentDescriptions.map((contentDescription) => ({
      description: contentDescription.description,
      url: contentDescription.url,
      code: contentDescription.code
    }));
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = (evt: MouseEvent) => {
    evt.preventDefault();
    const listId = crypto.randomUUID();
    contentDescriptions = [
      {
        listId,
        code: 'information',
        description: '',
        url: ''
      },
      ...contentDescriptions
    ];
  };

  const removeItem = (listId: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        contentDescriptions = contentDescriptions.filter(
          (contentDescription) => contentDescription.listId !== listId
        );
        persistContentDescriptions();
      },
      {
        text: 'Möchten Sie diese Datengrundlage wirklich löschen?',
        confirmButtonText: 'Löschen'
      }
    );
  };
</script>

<div class="contentDescriptions-field">
  <fieldset>
    <legend
      >{fieldConfig?.label}
      <IconButton
        class="material-icons"
        onclick={(evt) => addItem(evt)}
        size="button"
        title="Informationen hinzufügen"
      >
        add
      </IconButton>
    </legend>
    <FieldHint {fieldConfig} />
    {#each contentDescriptions as contentDescription, index (contentDescription.listId)}
      <fieldset class="contentDescription">
        <legend>
          <IconButton
            class="material-icons"
            onclick={(evt) => removeItem(contentDescription.listId, evt)}
            size="button"
            title="Informationen entfernen"
          >
            delete
          </IconButton>
        </legend>
        <div class="subfield-wrapper">
          <TextInput
            bind:value={contentDescription.description}
            label="Titel"
            onblur={persistContentDescriptions}
            fieldConfig={getFieldConfig(39, 'isoMetadata.contentDescriptions.title')}
            validationResult={getFieldConfig(
              39,
              'isoMetadata.contentDescriptions.title'
            )?.validator(contentDescription.description)}
          />
          <FieldTools
            key={`${KEY}[${index}].description`}
            fieldConfig={getFieldConfig(39, 'isoMetadata.contentDescriptions.description.title')}
          />
        </div>
        <div class="inline-fields">
          <div class="subfield-wrapper code-select-field">
            <SelectInput
              value={contentDescription.code}
              onChange={(code) => {
                contentDescription.code = code as CI_OnLineFunctionCode;
                persistContentDescriptions();
              }}
              label="Code"
              fieldConfig={getFieldConfig(39, 'isoMetadata.contentDescriptions.code')}
              validationResult={getFieldConfig(
                39,
                'isoMetadata.contentDescriptions.code'
              )?.validator(contentDescription.code)}
              options={[
                { label: 'Herunterladen', key: 'download' },
                { label: 'Information', key: 'information' },
                { label: 'Offline-Zugriff', key: 'offlineAccess' },
                { label: 'Bestellung', key: 'order' },
                { label: 'Suche', key: 'search' }
              ]}
            />
            <FieldTools
              key={`${KEY}[${index}].code`}
              fieldConfig={getFieldConfig(39, 'isoMetadata.contentDescriptions.code')}
            />
          </div>
          <div class="subfield-wrapper url-field">
            <TextInput
              bind:value={contentDescription.url}
              label="Url"
              onblur={persistContentDescriptions}
              fieldConfig={getFieldConfig(39, 'isoMetadata.contentDescriptions.url')}
              validationResult={getFieldConfig(
                39,
                'isoMetadata.contentDescriptions.url'
              )?.validator(contentDescription.url)}
            />
            <FieldTools
              key={`${KEY}[${index}].url`}
              fieldConfig={getFieldConfig(39, 'isoMetadata.contentDescriptions.url')}
            />
          </div>
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .contentDescriptions-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 0.25em;

      > legend {
        display: flex;
        align-items: center;
        font-size: 1.5em;
      }
    }

    .contentDescription {
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

      :global(.text-input),
      :global(.select-input) {
        border: none;
        background-color: rgba(244, 244, 244, 0.7);
      }

      :global(.text-input > legend),
      :global(.select-input > legend) {
        font-size: 1.2em;
        background-color: white;
        border-radius: 0.25em;
        padding: 0 0.25em;
      }

      :global(.mdc-select) {
        background-color: white;
      }
    }

    .inline-fields {
      display: flex;
      gap: 1em;

      :global(.code-select-field) {
        flex: 1;
      }

      :global(.url-field) {
        flex: 3;
      }
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
