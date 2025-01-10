<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import CheckboxInput from "../Inputs/CheckboxInput.svelte";

  const {
    metadata
  } = $props();

  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Qualitätsbericht: Überprüfung';
  const OPTIONS: {
    key: string;
    label: string;
  }[] = [{
    key: 'true',
    label: 'Geprüft'
  }];

  const metadataProfile = $derived(getValue<string>('isoMetadata.metadataProfile', metadata));

  let initialValue = getValue<string[]>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onChange = async (data?: string[]) => {
    // TODO: Implement
    console.log(data);
  };

</script>

{#if metadataProfile === 'INSPIRE_HARMONISED'}
  <div class="quality-report-check-field">
    <Paper>
      <CheckboxInput
        key={KEY}
        label={LABEL}
        options={OPTIONS}
        {value}
        {onChange}
      />
    </Paper>
    <FieldTools
      key={KEY}
      bind:running={showCheckmark}
    />
  </div>
{/if}

<style lang="scss">
  .quality-report-check-field {
    display: flex;
    position: relative;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
    }
  }
</style>
