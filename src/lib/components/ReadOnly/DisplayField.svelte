<script lang="ts">
  import { getFormContext } from '$lib/context/FormContext.svelte';
  import { page } from '$app/state';
  import type { FieldKey } from '$lib/models/form';
  import DisplayFieldSnippets from './DisplayFieldSnippets.svelte';
  import { MetadataService } from '$lib/services/MetadataService';

  type DisplayFieldProps = {
    key: FieldKey;
    label: string;
  };

  const t = $derived(page.data.t);
  const { key, label }: DisplayFieldProps = $props();

  const metadata = $derived(getFormContext()?.formState?.metadata);
  const value = $derived(MetadataService.getValue(key, metadata));
</script>

<div class="display-field">
  <strong class="title">{label}</strong>
  {#if value}
    <span class="value">
      <DisplayFieldSnippets {t} {key} {value} {metadata} />
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
