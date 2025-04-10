<script lang="ts">
  import { getFieldConfig, getValue } from "$lib/context/FormContext.svelte";
  import type { FieldKey } from "$lib/models/form";
  import type { Snippet } from "svelte";
  import * as DisplayFieldSnippets from "./DisplayFieldSnippets.svelte";

  type DisplayFieldProps = {
    key: FieldKey;
  };

  const {
    key
  }: DisplayFieldProps = $props();

  const config = $derived(getFieldConfig(key));
  const value = $derived(getValue(key));

  const valueSnippet: Snippet<[unknown]> = $derived(
    DisplayFieldSnippets[key as keyof typeof DisplayFieldSnippets] as Snippet
  );

</script>

<div class="display-field">
  <strong class="title">{config?.label}</strong>
  {#if value}
    <span class="value">
      {@render valueSnippet(value)}
    </span>
  {:else}
    <span class="value">Keine Angabe</span>
  {/if}
</div>

<style lang="scss">
  .display-field {
    display: flex;
    gap: 2em;
    padding: 1em 0;

    strong.title {
      flex: 1;
      text-align: right;
      font-size: 1.1em;
    }

    span.value {
      flex: 4;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      word-break: break-word;
      min-width: 0;
    }
  }
</style>
