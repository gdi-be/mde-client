<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '../Inputs/TextInput.svelte';
  import FieldTools from '../FieldTools.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import type { ContentDescription } from '../../../models/metadata';

  type ContentDescriptionListEntry = ContentDescription & { listId: string };

  const KEY = 'isoMetadata.contentDescriptions';

  const valueFromData = $derived(getValue<ContentDescription[]>(KEY));
  let contentDescriptions = $state<ContentDescriptionListEntry[]>([]);

  $effect(() => {
    if (valueFromData && valueFromData.length > 0) {
      contentDescriptions = valueFromData?.map((contentDescription) => {
        const listId = contentDescription.url + contentDescription.description + Date.now().toString(36);
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
        contentDescriptions = contentDescriptions.filter((contentDescription) => contentDescription.listId !== listId);
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
        title="Kontakt hinzufügen"
      >
        add
      </IconButton>
    </legend>
    {#each contentDescriptions as contentDescription (contentDescription.listId)}
      <fieldset class="contentDescription">
        <legend>
          <IconButton
            class="material-icons"
            onclick={(evt) => removeItem(contentDescription.listId, evt)}
            size="button"
            title="Kontakt entfernen"
          >
            delete
          </IconButton>
        </legend>
        <TextInput
          bind:value={contentDescription.description}
          key={KEY}
          label="Titel"
          onblur={persistContentDescriptions}
          required
        />
        <TextInput
          bind:value={contentDescription.url}
          key={KEY}
          label="Url"
          onblur={persistContentDescriptions}
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
      border-radius: 4px;

      > legend {
        display: flex;
        align-items: center;
        font-size: 0.75em;
      }
    }

    .contentDescription {
      legend {
        text-align: right;
      }
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
