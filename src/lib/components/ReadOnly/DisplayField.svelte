<script lang="ts">
  import { getFieldConfig, getFormContext, getValue } from '$lib/context/FormContext.svelte';
  import { page } from '$app/state';
  import type { FieldKey } from '$lib/models/form';
  import type { Snippet } from 'svelte';
  import * as DisplayFieldSnippets from './DisplayFieldSnippets.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';

  type DisplayFieldProps = {
    profileId?: number;
    key: FieldKey;
    label?: string;
  };

  const t = $derived(page.data.t);
  const { key, profileId, label }: DisplayFieldProps = $props();

  const config = $derived(profileId ? getFieldConfig(profileId) : undefined);
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
    <span class="value">{t('displayfield.noValue')}</span>
  {/if}
</div>

<style lang="scss">
  .display-field {
    display: flex;
    gap: 2em;
    padding: 0.25em 0;

    &:nth-of-type(even) {
      background: rgba(0, 0, 0, 0.05);
    }

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
