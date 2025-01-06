<script lang="ts">
  import Checkmark from "./Checkmark.svelte";
  import HelpIcon from "./HelpIcon.svelte";

  let {
    key,
    running = $bindable<boolean>(false)
  } = $props();

</script>

<div class="field-tools">
  <HelpIcon {key} />
  <Checkmark bind:running={running} />
</div>

<style lang="scss">
  .field-tools {
    width: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
  }
</style>
