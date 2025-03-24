<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';

  let value = $state(page.url.searchParams.get('query') || '');

  let onchange = (e: Event) => {
    const url = new URL(page.url);
    const value = (e.target as HTMLInputElement).value;
    if (value.length > 2) {
      url.searchParams.set('query', value);
    } else {
      url.searchParams.delete('query');
    }
    goto(url, {
      keepFocus: true
    });
  }

</script>

<Textfield
  class="text-filter-field"
  label="Suche"
  bind:value
  onkeyup={onchange}
>
  {#snippet helper()}
    <HelperText>Titel durchsuchen</HelperText>
  {/snippet}
</Textfield>

<style lang="scss">
</style>
