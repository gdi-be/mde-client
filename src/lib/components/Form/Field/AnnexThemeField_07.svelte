<script lang="ts">
  import { page } from "$app/state";
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";
  import { invalidateAll } from "$app/navigation";

  const PROFILE_KEY = 'isoMetadata.metadataProfile';
  const KEY = 'isoMetadata.inspireTheme';
  const LABEL = 'Annex-Thema';

  const {
    metadata
  } = $props();

  let metadataProfile = $derived(getValue<string>(PROFILE_KEY, metadata));
  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

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
    const response = await fetch('/data/inspire_themes');
    const data = await response.json();

    if (!data.register) {
      return [];
    };

    return data.register.containeditems.map((entry) => ({
      key: entry.theme.id.split('/').at(-1).toUpperCase().replace(/-/g, '_'),
      label: entry.theme.label.text
    }));
  };

</script>

{#if metadataProfile !== 'ISO'}
  <div class="annex-theme-field">
    <Paper>
      {#await fetchOptions()}
        <p>Lade Annex Themen</p>
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
    />
  </div>
{/if}

<style lang="scss">
  .annex-theme-field {
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
