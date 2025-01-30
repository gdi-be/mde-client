<script lang="ts">
  import { page } from "$app/state";
  import type { KeyWords } from "$lib/models/metadata";
  import type { Option } from "$lib/models/form";
  import { getValue } from "../FormContext.svelte";
  import ChipInput from "../Inputs/ChipInput.svelte";
  import Paper from "@smui/paper";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";

  const KEY = 'isoMetadata.keywords';
  const LABEL = 'Schlagwörter';

  let containerElement = $state<HTMLDivElement>();
  let initialKeyWords = getValue<KeyWords>(KEY);
  let { metadataid } = page.params;
  let initialValue = initialKeyWords?.default?.map(
    (entry) => ({ key: entry.keyword, label: entry.keyword })
  ) || [];
  let value = $state<Option[]>(initialValue);
  let showCheckmark = $state(false);
  let autoKeywords = $state<string[]>([]);
  let autoValue = $derived<Option[]>(autoKeywords.map(
    (entry) => ({ key: entry, label: entry })
  ));
  let uniqueValue = $derived(Array.from(
    new Map([...autoValue,...value].map((entry) => [entry.key, entry])).values()
  ));

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

    return data.results.map((entry: string) => ({
      key: entry,
      label: entry
    }));
  };

  const onChange = async (newChips: Option[]) => {
    const keywords: KeyWords = {
      ...initialKeyWords,
      default: newChips
        .filter((entry) => entry?.key)
        .map((entry) => ({ keyword: entry.key as string }))
    };
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
  };

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
  <Paper>
    <ChipInput
      chips={uniqueValue}
      fieldLabel={LABEL + '*'}
      search={searchItems}
      onChange={onChange}
    />
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .keywords-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.mdc-chip:not(:has(.mdc-deprecated-chip-trailing-action))) {
      pointer-events: auto;
      cursor: default;
      border: 1px dashed var(--primary-color);
      opacity: 0.7;
    }

    // Disable clicke events but keep the title attribute
    :global(.mdc-chip:not(:has(.mdc-deprecated-chip-trailing-action)):active),
    :global(.mdc-chip:not(:has(.mdc-deprecated-chip-trailing-action)):focus),
    :global(.mdc-chip:not(:has(.mdc-deprecated-chip-trailing-action)) button),
    :global(.mdc-chip:not(:has(.mdc-deprecated-chip-trailing-action)) a) {
      pointer-events: none;
    }

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
