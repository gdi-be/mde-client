<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '../Inputs/TextInput.svelte';
  import FieldTools from '../FieldTools.svelte';
  import type { ContentDescription } from '$lib/models/metadata';

  type ContentDescriptionListEntry = ContentDescription & { listId: string };

  const KEY = 'isoMetadata.UNKNOWN';

  const valueFromData = $derived(getValue<ContentDescription[]>(KEY));
  let values = $state<ContentDescriptionListEntry[]>([]);
  $effect(() => {
    if (valueFromData) {
      values = valueFromData?.map((description) => {
        const listId = (Math.floor(Math.random() * 1000000) + Date.now()).toString(36);
        return {
          listId,
          url: description.url || '',
          description: description.description || '',
          code: 'information'
        };
      });
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<ContentDescription[]>(KEY);

  const persist = async () => {
    const response = await persistValue(
      KEY,
      values.map(
        (contentDescription) =>
          ({
            description: contentDescription.description,
            url: contentDescription.url,
            code: 'information'
          }) satisfies ContentDescription
      )
    );
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = () => {
    const listId = Date.now().toString(36);
    values = [
      {
        listId,
        url: '',
        description: '',
        code: 'information'
      },
      ...values
    ];
  };

  const removeItem = (listId: string) => {
    // TODO: add popconfirm
    values = values.filter((contentDescription) => contentDescription.listId !== listId);
    persist();
  };
</script>

<div class="content-description-field">
  <fieldset>
    <legend
      >{fieldConfig?.label || 'TODO: Inhaltliche Beschreibung'}
      <IconButton
        class="material-icons"
        onclick={() => addItem()}
        size="button"
        title="Quelle hinzufügen"
      >
        add
      </IconButton>
    </legend>
    {#each values as contentDescription (contentDescription.listId)}
      <fieldset class="contentDescription">
        <legend>
          <IconButton
            class="material-icons"
            onclick={() => removeItem(contentDescription.listId)}
            size="button"
            title="Quelle entfernen"
          >
            delete
          </IconButton>
        </legend>
        <TextInput
          bind:value={contentDescription.url}
          key={KEY}
          label="URL (Dokument oder Website)"
          onblur={persist}
        />
        <TextInput
          bind:value={contentDescription.description}
          key={KEY}
          label="Beschreibung der Quelle"
          onblur={persist}
        />
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .content-description-field {
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
