<script lang="ts">
  import IconButton from "@smui/icon-button";
  import { Icon } from "@smui/button";
  import { getAutoFillValues } from "./FormContext.svelte";

  let {
    key,
    onAutoFill,
  } = $props();

  const autoFillValue = async () => {
    const autoFillValue = getAutoFillValues(key);
    onAutoFill(autoFillValue);
  };

</script>

{#if onAutoFill}
  <IconButton
    title="Feld automatisch ausfüllen/ergänzen"
    type="button"
    size="button"
    onclick={autoFillValue}
  >
    <Icon class="material-icons">brightness_auto</Icon>
  </IconButton>
{/if}

<style>
</style>
