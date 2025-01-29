<script lang="ts">
  import { page } from "$app/state";
  import IconButton from "@smui/icon-button";
  import { getValue } from "../FormContext.svelte";
  import TextInput from "../Inputs/TextInput.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { fly, scale } from "svelte/transition";
  import { backIn } from "svelte/easing";
  import type { ContentDescription } from "../../../models/metadata";
  import { invalidateAll } from "$app/navigation";

  const KEY = 'isoMetadata.contentDescriptions';
  const LABEL = 'Inhaltliche Beschreibung';

  let initialDescriptions = getValue<ContentDescription[]>(KEY);
  let initialValue = initialDescriptions?.map(description => {
    const listId = (Math.floor(Math.random() * 1000000) + Date.now()).toString(36);
    return {
      listId,
      url: description.url || '',
      description: description.description || ''
    };
  });

  let values = $state(initialValue || []);
  let showCheckmark = $state(false);

  const persist = async () => {
    // TODO check if value has changed
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: values.map(contentDescription => ({
          description: contentDescription.description,
          url: contentDescription.url,
          code: 'information'
        } satisfies ContentDescription))
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

  const addItem = () => {
    const listId = Date.now().toString(36);
    values = [
      {
        listId,
        url: '',
        description: ''
      },
      ...values
    ];
  };

  const removeItem = (listId: string) => {
    // TODO: add popconfirm
    values = values.filter(contentDescription => contentDescription.listId !== listId);
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
    {#each values as contentDescription (contentDescription.listId)}
      <fieldset class="contentDescription" in:fly={{ y: -100 }} out:scale={{ easing: backIn }}>
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
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .content-description-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      flex: 1;
      border-radius: 4px;
      // border: 0;
      // box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, .12);

      >legend {
        display: flex;
        align-items: center;
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
