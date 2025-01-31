<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import { invalidateAll } from "$app/navigation";
  import AutoFillButton from "../AutoFillButton.svelte";

  const {
    metadata
  } = $props();

  const KEY = 'isoMetadata.topicCategory';
  const LABEL = 'Themenkategorie (ISO)';

  let initialValue = getValue<string>(KEY, metadata);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onAutoFill = async (autoFillTopic: unknown) => {
    if (!autoFillTopic) return;
    value = autoFillTopic as string;
    onChange(value);
  };

  const onChange = async (newValue?: string) => {
    const response = await fetch(page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: newValue
      })
    });
    if (response.ok) {
      showCheckmark = true;
      invalidateAll();
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('/data/iso_themes');
    const data = await response.json();

    return data.map((entry) => ({
      key: entry.isoName as string,
      label: entry.isoName as string
    }));
  };

</script>

<div class="topic-category-field">
  <Paper>
    {#await fetchOptions()}
      <p>Lade Themen Kategorien</p>
    {:then OPTIONS}
      <SelectInput
        key={KEY}
        label={LABEL}
        options={OPTIONS}
        {value}
        {onChange}
      />
    {/await}
  </Paper>
  <FieldTools
    key={KEY}
    bind:running={showCheckmark}
  >
    <AutoFillButton
      key={KEY}
      {metadata}
      {onAutoFill}
    />
  </FieldTools>
</div>

<style lang="scss">
  .topic-category-field {
    position: relative;
    display: flex;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
