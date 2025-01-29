<script lang="ts">
  import Checkmark from "./Checkmark.svelte";
  import HelpButton from "./HelpButton.svelte";
  import CopyButton from "./CopyButton.svelte";

  let {
    key,
    running = $bindable<boolean>(false)
  } = $props();

</script>

<div class="field-tools">
  <HelpButton {key} />
  <CopyButton {key} />
  <Checkmark bind:running={running} />
</div>

<style lang="scss">
  .field-tools {
    padding-bottom: 0.5em;
    width: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f9fa;
    outline: 1px solid #e9ecef;
    border-radius: var(--mdc-shape-medium, 4px);
  }
</style>
