<script lang="ts">
  import { allFieldsValid } from "./FormContext.svelte";
  import CommentsPanel from "./CommentsPanel.svelte";
  import Button, { Icon, Label } from "@smui/button";
  import type { MetadataJson } from "$lib/models/metadata";

  type FormFooterProps = {
    metadata?: MetadataJson;
    text?: string;
  }

  let {
    metadata,
    text = 'FormFooter'
  }: FormFooterProps = $props();

  let commentsPanelVisible = $state(false);
  let submitEnabled = $derived(allFieldsValid(metadata));

</script>

<footer class="form-footer">
  <div class="container left-container">
    {#if metadata}
      <Button
        variant="raised"
        class="comments-panel-toggle-button"
        onclick={() => commentsPanelVisible = !commentsPanelVisible}
      >
        <Icon class="material-icons">chat</Icon>
        <Label>Kommentare</Label>
      </Button>
    {/if}
  </div>
  <div class="container center-container">
    {text}
  </div>
  <div class="container right-container">
    <Button
      class="submit-button"
      title={submitEnabled ? "Speichern" : "Es sind noch nicht alle Felder korrekt ausgefüllt"}
      disabled={true}
    >
      <Icon class="material-icons">verified</Icon>
      <Label>Freigabe</Label>
    </Button>
    {#if commentsPanelVisible}
      <CommentsPanel
        metadata={metadata}
      />
    {/if}
  </div>
</footer>

<style lang="scss">
  footer.form-footer {
    background-color: #f8f9fa;
    height: 4em;
    text-align: center;
    border-bottom: 1px solid #dee2e6;

    display: flex;
    align-items: center;
    justify-content: space-between;

    :global(.submit-button) {
      background-color: #0f913b;

      &:disabled {
        cursor: not-allowed;
        background-color: lightgrey;
      }
    }

    .container {
      display: flex;
      padding: 0 1em;
    }
  }
</style>
