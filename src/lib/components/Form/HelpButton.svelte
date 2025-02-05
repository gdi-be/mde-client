<script lang="ts">
  import IconButton from "@smui/icon-button";
  import { Icon } from "@smui/button";
  import { getFormContext, hasHelpMarkdown, toggleActiveHelp } from "./FormContext.svelte";

  let {
    key
  } = $props();

  const {
    activeHelpKey
  } = $derived(getFormContext());

  const visible = $derived(hasHelpMarkdown(key));

  const pressed = $derived(key === activeHelpKey);

</script>

{#if visible}
  <IconButton
    title="Hilfe zum Feld anzeigen"
    type="button"
    toggle
    size="button"
    pressed={pressed}
    onclick={() => toggleActiveHelp(key)}
  >
    <Icon class="material-icons">help</Icon>
    <Icon class="material-icons-filled" on>help</Icon>
  </IconButton>
{/if}
