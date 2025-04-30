<script lang="ts">
  import { getFieldConfig, getFormContext, getValue } from '$lib/context/FormContext.svelte';
  import type { FieldKey } from '$lib/models/form';
  import type { Snippet } from 'svelte';
  import * as DisplayFieldSnippets from './DisplayFieldSnippets.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';

  type DisplayFieldProps = {
    key: FieldKey;
    label?: string;
  };

  const { key, label }: DisplayFieldProps = $props();

  const config = $derived(getFieldConfig(key));
  const value = $derived(getValue(key));

  const valueSnippet: Snippet<[unknown, MetadataCollection | undefined]> = $derived.by(() => {
    const renderer = DisplayFieldSnippets[key as keyof typeof DisplayFieldSnippets] as Snippet;
    return renderer || DisplayFieldSnippets.defaultSnippet;
  });

  const metadata = $derived(getFormContext()?.metadata);

</script>

<div class="display-field">
  <strong class="title">{label || config?.label || key}</strong>
  {#if value}
    <span class="value">
      {@render valueSnippet(value, metadata)}
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
