<script lang="ts">
  import { allFieldsValid } from "$lib/context/FormContext.svelte";;
  import CommentsPanel from "./CommentsPanel.svelte";
  import Button, { Icon, Label } from "@smui/button";
  import type { MetadataJson } from "$lib/models/metadata";
  import type { Snippet } from "svelte";

  type FormFooterProps = {
    metadata?: MetadataJson;
    text?: string;
    children?: Snippet;
  }

  let {
    metadata,
    children
  }: FormFooterProps = $props();

  let commentsPanelVisible = $state(false);
  let submitEnabled = $derived(allFieldsValid(metadata));

  const closeCommentsPanel = (event: MouseEvent | KeyboardEvent) => {
    if (event.target instanceof Element && !event.target.closest(".comments-panel")) {
      commentsPanelVisible = false;
    }
  };

</script>

<footer class="form-footer">
  <div class="container left-container">
    {#if metadata}
      <Button
        variant="raised"
        class="comments-panel-toggle-button"
        onclick={() => commentsPanelVisible = true}
      >
        <Icon class="material-icons">chat</Icon>
        <Label>Kommentare</Label>
      </Button>
    {/if}
  </div>
  <div class="container center-container">
    {@render children?.()}
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
      <div
        class="mask"
        onclick={closeCommentsPanel}
        onkeydown={closeCommentsPanel}
        role="button"
        tabindex="0"
      >
      </div>
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

    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.25); /* Halbtransparent */
      z-index: 1; /* Damit es über allem anderen liegt */
    }

    .container {
      display: flex;
      padding: 0 1em;
    }
  }
</style>
