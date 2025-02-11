<script lang="ts">
  import Checkmark from "./Checkmark.svelte";
  import HelpButton from "./HelpButton.svelte";
  import CopyButton from "./CopyButton.svelte";
  import type { Snippet } from "svelte";

  export type FieldToolsProps = {
    key: string;
    children?: Snippet;
    checkMarkAnmiationRunning?: boolean;
  }

  let {
    key,
    children,
    checkMarkAnmiationRunning: running = $bindable<boolean>(false)
  }: FieldToolsProps = $props();

</script>

<div class="field-tools">
  <HelpButton {key} />
  <CopyButton {key} />
  {@render children?.()}
  <Checkmark bind:running={running} />
</div>

<style lang="scss">
  .field-tools {
    position: relative;
    padding: 0.25em 0;
    width: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f9fa;
    outline: 1px solid #e9ecef;
    border-radius: var(--mdc-shape-medium, 4px);

    :global(.checkmark) {
      margin: 10px 0;
    }
  }
</style>
