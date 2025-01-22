<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";
  import { Text } from "@smui/list";
  import type { IsoMetadata } from "$lib/models/metadata";
  import { type Option } from "$lib/models/form";
  import Icon from "@smui/textfield/icon";
  import Textfield from "@smui/textfield";

  export type MetadataSearchFieldProps = {
    value: Option | undefined;
    label?: string;
  };

  let {
    value = $bindable(),
    label = 'Suche nach Metadaten'
  }: MetadataSearchFieldProps = $props();

  let text = $state('');

  async function searchItems(input: string) {
    if (input === '') {
      return [];
    }

    const url = new URL('/metadata/search', window.location.origin);
    url.searchParams.append('query', input);

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      return data.map((isoMetadata: IsoMetadata) => ({
        key: isoMetadata.metadataId,
        label: isoMetadata.title
      }));
    }

    return [];
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
    return option.label as string || '';
  }}
  showMenuWithNoInput={false}
  {label}
>
  {#snippet loading()}
    <Text>Loading...</Text>
  {/snippet}

  {#snippet noMatches()}
    <Text>No results found</Text>
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
