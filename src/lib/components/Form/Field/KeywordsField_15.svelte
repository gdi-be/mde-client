<script lang="ts">
  import { page } from "$app/state";
  import type { KeyWords } from "$lib/models/metadata";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import Chip, { Set as ChipSet, Text, TrailingIcon } from "@smui/chips";
  import Autocomplete from "@smui-extra/autocomplete";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Textfield from "@smui/textfield";
  import Button, { Label } from "@smui/button";

  const KEY = 'isoMetadata.keywords';
  const LABEL = 'Schlagwörter';

  let containerElement = $state<HTMLDivElement>();
  let initialKeyWords = getValue<KeyWords>(KEY);
  let { metadataid } = page.params;
  let initialValue = initialKeyWords?.default?.map(entry => entry.keyword) || [];
  let value = $state<string[]>(initialValue);
  let showCheckmark = $state(false);
  let autoKeywords = $state<string[]>([]);
  let uniqueKeywords = $derived(Array.from(new Set([...autoKeywords, ...value])));
  let searchValue = $state('');

  let dialogOpen = $state(false);
  let newKeyword = $state('');

  const getAutoKeywords = async () => {
    const response = await fetch(`/metadata/${metadataid}/autokeywords`)
    if (response.ok) {
      autoKeywords = await response.json() || [];
    } else {
      autoKeywords = [];
    }
  };

  const searchItems = async (input: string) => {
    if (input === '') {
      return [];
    }

    const options = await fetch(`/data/keywords?terms=${input}`)
    const data = await options.json();

    if (data.total_results === 0) {
      return false;
    }

    return data.results;
  };

  const removeKeyword = (keyword: string) => {
    value = value.filter(kw => kw !== keyword);
    persistValues();
  };

  const addSelectedKeyword = ({ detail }: CustomEvent) => {
    value = Array.from(new Set([...value, detail]));
    searchValue = '';
    persistValues();
  };

  const addCustomKeywords = () => {
    if (newKeyword) {
      // split by comma and remove leading/trailing whitespaces
      const splitValues = newKeyword.split(',').map(kw => kw.trim());
      // ensure unique values
      value = Array.from(new Set([...value, ...splitValues]));
      dialogOpen = false;
      persistValues();
    }
  };

  const persistValues = async () => {
    const keywords: KeyWords = {
      default: value.map((entry) => ({ keyword: entry }))
    };
    persistKeywords(keywords);
  };

  const persistKeywords = async (keywords: KeyWords) => {
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: keywords
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  }

  onMount(() => {
    getAutoKeywords();
  });

  // this is a hack to remove the delete button from undeletable chips as the framework
  // does not provide a way to do this
  $effect(() => {
    if (autoKeywords && containerElement) {
      containerElement.querySelectorAll(".mdc-chip").forEach(chip => {
        const textElement = chip.querySelector(".mdc-chip__text");
        if (textElement?.textContent && autoKeywords.includes(textElement?.textContent?.trim())) {
          const removeButton = chip.querySelector(".mdc-deprecated-chip-trailing-action");
          if (removeButton) {
            removeButton.remove();
          }
          chip.setAttribute('title', 'Automatisch generiertes Schlagwort');
        }
      });
    }
  });

</script>

<div
  class="keywords-field"
  bind:this={containerElement}
>
  <fieldset>
    <legend>{LABEL}</legend>
    <ChipSet
      class="keywords-chipset"
      chips={uniqueKeywords}
      nonInteractive
    >
      {#snippet chip(chip)}
        <Chip
          class={autoKeywords.includes(chip) ? 'auto-keyword' : ''}
          {chip}
        >
          <Text tabindex={0}>{chip}</Text>
          {#if !autoKeywords.includes(chip)}
            <TrailingIcon
              title={`Schlagwort "${chip}" entfernen`}
              class="material-icons remove-icon"
              onclick={() => removeKeyword(chip)}
            >
              close
            </TrailingIcon>
          {/if}
        </Chip>
      {/snippet}
    </ChipSet>
    <Autocomplete
      class="keyword-search-input"
      search={searchItems}
      bind:value={searchValue}
      label="UMTHES Schlagwortsuche ..."
      noMatchesActionDisabled={false}
      showMenuWithNoInput={true}
      selectOnExactMatch={false}
      onSMUIAutocompleteNoMatchesAction={() => {
        newKeyword = searchValue;
        dialogOpen = true;
      }}
      onSMUIAutocompleteSelected={addSelectedKeyword}
    >
      {#snippet loading()}
        <Text
          style="display: flex; width: 100%; justify-content: center; align-items: center;"
        >
          Lädt
        </Text>
      {/snippet}
      {#snippet noMatches()}
        <Text>Eigene Schlagwörter hinzufügen</Text>
      {/snippet}
    </Autocomplete>
  </fieldset>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  >
  </FieldTools>
</div>

<Dialog
  class="keywords-dialog"
  bind:open={dialogOpen}
  aria-labelledby="autocomplete-dialog-title"
  aria-describedby="autocomplete-dialog-content"
>
  <Title>Neue Schlagwörter</Title>
  <Content class="custom-keywords-content">
    <p>
      Es wird empfohlen die UMTHES Schlagwortsuche zu verwenden.
      Alternative können Sie hier kommasepariert mehrere eigene Schlagwörter hinzufügen.
    </p>
    <Textfield
      class="custom-keywords-input"
      textarea
      label="Schlagwörter"
      bind:value={newKeyword}
    />
  </Content>
  <Actions>
    <Button>
      <Label>Abbrechen</Label>
    </Button>
    <Button
      variant="raised"
      onclick={addCustomKeywords}
    >
      <Label>Hinzufügen</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  .keywords-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    fieldset {
      border-radius: 4px;

      >legend {
        font-size: 0.75em;
      }
    }

    :global(.keywords-chipset) {
      padding: 0.25em 0;
      gap: 0.5em;
      display: flex;
      flex-wrap: wrap;
    }

    :global(.keywords-chipset .mdc-chip) {
      margin: 0;
    }

    :global(.auto-keyword) {
      pointer-events: auto;
      outline: 1px dashed var(--primary-color);
      opacity: 0.7;
    }

    :global(.remove-icon) {
      cursor: pointer;
    }

    :global(.keyword-search-input) {
      width: 100%;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }

  :global(.keywords-dialog .custom-keywords-content) {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  :global(.keywords-dialog .custom-keywords-input) {
    width: 100%;
  }
</style>
