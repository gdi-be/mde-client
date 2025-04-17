<script lang="ts">
  import IconButton from '@smui/icon-button';
  import {
    getFieldConfig,
    getSubFieldConfig,
    getValue,
    persistValue
  } from '$lib/context/FormContext.svelte';
  import TextInput from '$lib/components/Form/Inputs/TextInput.svelte';
  import FieldTools from '$lib/components/Form/FieldTools.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import type { ContentDescription } from '$lib/models/metadata';
  import FieldHint from '$lib/components/Form/FieldHint.svelte';

  type ContentDescriptionListEntry = ContentDescription & { listId: string };

  const KEY = 'isoMetadata.contentDescriptions';

  const valueFromData = $derived(getValue<ContentDescription[]>(KEY));
  let contentDescriptions = $state<ContentDescriptionListEntry[]>([]);

  $effect(() => {
    if (valueFromData && valueFromData.length > 0) {
      contentDescriptions = valueFromData?.map((contentDescription) => {
        const listId =
          contentDescription.url + contentDescription.description + Date.now().toString(36);
        return {
          listId,
          code: 'information',
          description: contentDescription.description || '',
          url: contentDescription.url || ''
        };
      });
    } else {
      contentDescriptions = [
        {
          listId: Date.now().toString(36),
          code: 'information',
          description: '',
          url: ''
        }
      ];
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<ContentDescription[]>(KEY);

  const persistContentDescriptions = async () => {
    const value = contentDescriptions.map((contentDescription) => ({
      description: contentDescription.description,
      url: contentDescription.url,
      code: 'information'
    }));
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = (evt: MouseEvent) => {
    evt.preventDefault();
    const listId = Date.now().toString(36);
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
    {#each contentDescriptions as contentDescription (contentDescription.listId)}
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
        <TextInput
          bind:value={contentDescription.description}
          label="Titel"
          onblur={persistContentDescriptions}
          fieldConfig={getSubFieldConfig(KEY, 'title')}
          required
        />
        <TextInput
          bind:value={contentDescription.url}
          label="Url"
          onblur={persistContentDescriptions}
          fieldConfig={getSubFieldConfig(KEY, 'url')}
          required
        />
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

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
