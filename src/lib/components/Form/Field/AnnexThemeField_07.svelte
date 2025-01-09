<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import SelectInput from "../Inputs/SelectInput.svelte";

  const KEY = 'isoMetadata.topicCategory';
  const LABEL = 'Annex-Thema';

  let initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onChange = async (newValue?: string) => {
    // TODO: Implement
    console.log(newValue);
  };

  const fetchOptions = async () => {
    const response = await fetch('/annex_themes');
    const data = await response.json();

    if (!data.register) {
      return [];
    };

    return data.register.containeditems.map((entry) => ({
      key: entry.theme.id,
      label: entry.theme.label.text
    }));
  };

</script>

<div class="metadata-type-field">
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

<style lang="scss">
  .metadata-type-field {
    position: relative;
    display: flex;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }

    :global(.mdc-select) {
      display: flex;
    }
  }
</style>
