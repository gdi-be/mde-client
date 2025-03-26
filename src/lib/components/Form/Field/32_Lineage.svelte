<script lang="ts">
  import type { Lineage } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';
  import { getFieldConfig, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import TextInput from '../Inputs/TextInput.svelte';
  import FieldTools from '../FieldTools.svelte';
  import DateInput from '../Inputs/DateInput.svelte';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';

  type LineageListEntry = Lineage & { listId: string };

  const KEY = 'isoMetadata.lineage';

  const valueFromData = $derived(getValue<Lineage[]>(KEY));
  let lineages = $state<LineageListEntry[]>([]);

  $effect(() => {
    if (valueFromData && valueFromData.length > 0) {
      lineages = valueFromData?.map((lineage) => {
        const listId = Date.now().toString(36);
        return {
          listId,
          title: lineage.title || '',
          identifier: lineage.identifier || '',
          date: lineage.date ? new Date(lineage.date).toISOString().split('T')[0] : ''
        };
      });
    } else {
      lineages = [
        {
          listId: Date.now().toString(36),
          title: '',
          identifier: '',
          date: new Date().toISOString().split('T')[0]
        }
      ];
    }
  });

  let showCheckmark = $state(false);
  const fieldConfig = getFieldConfig<Lineage[]>(KEY);

  const persistLineages = async () => {
    const value = lineages.map((lineage) => ({
      title: lineage.title,
      identifier: lineage.identifier,
      date: lineage.date ? new Date(lineage.date).toISOString() : ''
    }));
    const response = await persistValue(KEY, value);
    if (response.ok) {
      showCheckmark = true;
    }
  };

  const addItem = (evt: MouseEvent) => {
    evt.preventDefault();
    const listId = Date.now().toString(36);
    lineages = [
      {
        listId,
        title: '',
        identifier: '',
        date: ''
      },
      ...lineages
    ];
  };

  const removeItem = (listId: string, evt: MouseEvent) => {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        lineages = lineages.filter((lineage) => lineage.listId !== listId);
        persistLineages();
      },
      {
        text: 'Möchten Sie diese Datengrundlage wirklich löschen?',
        confirmButtonText: 'Löschen'
      }
    );
  };
</script>

<div class="lineages-field">
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
    {#each lineages as lineage (lineage.listId)}
      <fieldset class="lineage">
        <legend>
          <IconButton
            class="material-icons"
            onclick={(evt) => removeItem(lineage.listId, evt)}
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
            bind:value={lineage.date}
            key={KEY}
            label="Veröffentlichungsdatum"
            onblur={persistLineages}
          />
          <TextInput
            class="lineage-source-field"
            bind:value={lineage.identifier}
            key={KEY}
            label="Identifier"
            onblur={persistLineages}
            required
          />
        </div>
      </fieldset>
    {/each}
  </fieldset>
  <FieldTools key={KEY} bind:checkMarkAnmiationRunning={showCheckmark} />
</div>

<style lang="scss">
  .lineages-field {
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
