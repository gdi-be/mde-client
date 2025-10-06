<script lang="ts">
  import Autocomplete from '@smui-extra/autocomplete';
  import { Text } from '@smui/list';
  import { type Option } from '$lib/models/form';
  import Icon from '@smui/textfield/icon';
  import Textfield from '@smui/textfield';
  import type { MetadataCollection } from '$lib/models/metadata';
  import { toast } from 'svelte-french-toast';
  import { page } from '$app/state';

  export type MetadataSearchFieldProps = {
    value: Option | undefined;
    label?: string;
  };

  const t = $derived(page.data.t);
  let { value = $bindable(), label }: MetadataSearchFieldProps = $props();
  const defaultLabel = $derived(t('metadatasearch.searchLabel'));

  let text = $state('');

  async function searchItems(input: string) {
    if (input === '') {
      return [];
    }

    const url = new URL('/metadata/search', window.location.origin);
    url.searchParams.append('query', input);

    const response = await fetch(url);

    if (!response.ok) {
      toast.error(t('metadatasearch.fetchError'));
      return [];
    }

    const data = await response.json();

    return (
      data.content?.map((metadataCollection: MetadataCollection) => ({
        key: metadataCollection.metadataId,
        label: metadataCollection.title
      })) || []
    );
  }

  const splitLabel = (l: string) => {
    const regex = new RegExp(`(${text})`, 'gi');
    const parts = l.split(regex);
    return parts;
  };
</script>

<Autocomplete
  class="metadata-search-field"
  search={searchItems}
  bind:value
  bind:text
  selectOnExactMatch={false}
  getOptionLabel={(option: Option) => {
    if (!option) return '';
    return (option.label as string) || '';
  }}
  label={label || defaultLabel}
>
  {#snippet loading()}
    <Text>Lädt...</Text>
  {/snippet}

  {#snippet noMatches()}
    <Text>Bitte Suchbegriff anpassen ...</Text>
  {/snippet}

  {#snippet match(item)}
    <Text title={item.label}>
      {#each splitLabel(item.label) as part}
        {#if part.toLowerCase() === text.toLowerCase()}
          <strong>{part}</strong>
        {:else}
          {part}
        {/if}
      {/each}
    </Text>
  {/snippet}

  <Textfield {label} bind:value={text}>
    {#snippet trailingIcon()}
      <Icon class="material-icons">search</Icon>
    {/snippet}
  </Textfield>
</Autocomplete>

<style lang="scss">
</style>
