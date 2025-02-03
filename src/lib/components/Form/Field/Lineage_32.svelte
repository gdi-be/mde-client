<script lang="ts">
  // import { page } from "$app/state";
  import type { Lineage } from "$lib/models/metadata";
  import IconButton from "@smui/icon-button";
  import { getValue } from "../FormContext.svelte";
  import TextInput from "../Inputs/TextInput.svelte";
  import FieldTools from "../FieldTools.svelte";
  // import { invalidateAll } from "$app/navigation";
  import { fly, scale } from "svelte/transition";
  import DateInput from "../Inputs/DateInput.svelte";

  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Datengrundlage';

  let initialLineages = getValue<Lineage[]>(KEY);
  let initialValue = initialLineages?.map(lineage => {
    const listId = (Math.floor(Math.random() * 1000000) + Date.now()).toString(36);
    return {
      listId,
      title: lineage.title || '',
      source: lineage.source || '',
      publishDate: lineage.publishDate || ''
    };
  });

  let lineages = $state(initialValue || []);
  let showCheckmark = $state(false);

  const persistLineages = async () => {
    // TODO implement
  };

  const addItem = () => {
    const listId = Date.now().toString(36);
    lineages = [
      {
        listId,
        title: '',
        source: '',
        publishDate: ''
      },
      ...lineages
    ];
  };

  const removeItem = (listId: string) => {
    // TODO: add popconfirm
    lineages = lineages.filter(lineage => lineage.listId !== listId);
    persistLineages();
  };

</script>

<div class="lineages-field">
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
    {#each lineages as lineage (lineage.listId)}
      <fieldset class="lineage" in:fly={{ y: -100 }} out:scale={{ duration: 200 }}>
        <legend>
          <IconButton
          class="material-icons"
          onclick={() => removeItem(lineage.listId)}
          size="button"
          title="Kontakt entfernen"
        >
          delete
        </IconButton>
        </legend>
        <TextInput
          bind:value={lineage.title}
          key={KEY}
          label="Titel"
          onblur={persistLineages}
          required
        />
        <div class="inline-fields">
          <DateInput
            class="publish-date-field"
            bind:value={lineage.publishDate}
            key={KEY}
            label="Veröffentlichungsdatum"
            onblur={persistLineages}
          />
          <TextInput
            class="lineage-source-field"
            bind:value={lineage.source}
            key={KEY}
            label="Identifier"
            onblur={persistLineages}
            required
          />
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .lineages-field {
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
      }
    }

    .lineage {
      legend {
        text-align: right;
      }
    }

    .inline-fields {
      display: flex;
      gap: 1em;

      :global(.publish-date-field) {
        flex: 1;
      }

      :global(.lineage-source-field) {
        flex: 3;
      }
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
