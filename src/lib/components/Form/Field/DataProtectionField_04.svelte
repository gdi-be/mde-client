<script lang="ts">
  import Paper from "@smui/paper";
  import { getValue } from "../FormContext.svelte";
  import FieldTools from "../FieldTools.svelte";
  import CheckboxInput from "../Inputs/CheckboxInput.svelte";

  // TODO
  const KEY = 'isoMetadata.UNKNOWN';
  const LABEL = 'Datenschutz';
  const OPTIONS: {
    key: string;
    label: string;
  }[] = [{
    key: 'none',
    label: 'Nicht Datenschutz relevant'
  }, {
    key: 'internal-only',
    label: 'Schutz von Daten juristischer Personen und deren Interessen - Nutzungsbestimmung "Nur für den Dienstgebrauch"'
  }, {
    key: 'personal-data',
    label: 'Schutz von persönlichen Daten bei natürlichen Personen'
  }, {
    key: 'critical-infrastructures',
    label: 'Schutz von Daten, die als Kritische Infrastruktur eingestuft werden'
  }];

  let initialValue = getValue<string[]>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onChange = async (data?: string[]) => {
    // TODO: Implement
    console.log(data);
  };

</script>

<div class="data-protection-field">
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

<style lang="scss">
  .data-protection-field {
    display: flex;
    position: relative;
    gap: 0.25em;

    :global(.smui-paper) {
      flex: 1;
    }
  }
</style>
