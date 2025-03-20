<script lang="ts">
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';

  let value = $state('');
</script>

<Textfield
  class="status-filter-field"
  label="Statusfilter"
  bind:value
>
  {#snippet helper()}
    <HelperText>Metadaten nach Status filtern</HelperText>
  {/snippet}
</Textfield>

<style lang="scss">
</style>
