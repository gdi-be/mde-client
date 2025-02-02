<script lang="ts">
  import { page } from "$app/state";
  import type { KeyWords } from "$lib/models/metadata";
  import type { Option } from "$lib/models/form";
  import { getValue } from "../FormContext.svelte";
  import ChipInput from "../Inputs/ChipInput.svelte";
  import Paper from "@smui/paper";
  import FieldTools from "../FieldTools.svelte";
  import { invalidateAll } from "$app/navigation";

  const KEY = 'isoMetadata.keywords';
  const LABEL = 'Schlagwörter';

  let initialKeyWords = getValue<KeyWords>(KEY);
  let initialValue = initialKeyWords?.default?.map(
    (entry) => ({ key: entry.keyword, label: entry.keyword })
  ) || [];
  let value = $state(initialValue);
  let showCheckmark = $state(false);

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

</script>

<div class="keywords-field">
  <Paper>
    <ChipInput
      bind:chips={value}
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

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
