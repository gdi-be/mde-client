<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";
  import { Text } from "@smui/list";
  import type { MetadataId } from "$lib/models/metadata";
  import { type Option } from "$lib/models/form";

  export type MetadataSearchFieldProps = {
    value: MetadataId | undefined;
    label?: string;
  };

  let {
    value = $bindable(),
    label = 'Suche nach Metadaten'
  }: MetadataSearchFieldProps = $props();

  async function searchItems(input: string) {
    if (input === '') {
      return [];
    }

    // TODO: implement search
    return [{
      key: 'a10f5c2b-0a31-3a9a-99b0-db903996b5c5',
      label: 'Straßenparkplätze'
    }, {
      key: '886873a2-813e-33a6-bad4-f80364f94e24',
      label: 'Gebäudegeschosse'
    }, {
      key: 'c54eebcb-9eae-3b60-b112-bcb291eeddc7',
      label: 'Pflegeeinrichtungen'
    }]
  }

</script>

<Autocomplete
  search={searchItems}
  bind:value
  getOptionLabel={(option: Option) => {
    if (!option) return '';
    return option.label;
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
</Autocomplete>

<style lang="scss">


</style>
