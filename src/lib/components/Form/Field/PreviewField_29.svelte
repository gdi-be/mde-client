<script lang="ts">
  import { page } from "$app/stores";
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import type { Previews } from "$lib/models/metadata";
  import IconButton, { Icon } from "@smui/icon-button";
  import Checkmark from "../../Checkmark.svelte";
  import { getValue } from "../FormContext.svelte";
  import Paper from "@smui/paper";

  const KEY = 'isoMetadata.previews';
  const LABEL = 'Vorschau';

  const initialPreviews = getValue<Previews>(KEY);
  let initialValue = initialPreviews?.[0]?.content || '';
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const linkRegex = /https?:\/\/[^\s]+/;
  let isValidLink = $derived(linkRegex.test(value));

  const onBlur = async () => {
    if (value === initialValue) {
      return;
    }

    const previews: Previews = [{ content: value }];

    const response = await fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value: previews
      })
    });
    if (response.ok) {
      initialValue = value;
      showCheckmark = true;
    }
  };

</script>

<div class="preview-field">
  <Paper>
    <TextInput
      bind:value
      key={KEY}
      label={LABEL}
      onblur={onBlur}
    />
    {#if isValidLink}
      <IconButton
        aria-label="Link in neuem Tab öffnen"
        title="Link in neuem Tab öffnen"
        onclick={() => window.open(value, '_blank')}
      >
        <Icon class="material-icons">open_in_new</Icon>
      </IconButton>
    {/if}
  </Paper>
  <Checkmark
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .preview-field {
    position: relative;
    display: flex;
    gap: 1em;

    :global(.smui-paper) {
      flex: 1;
      display: flex;
      align-items: flex-end;
    }

    :global(.mdc-text-field) {
      flex: 1;
    }
  }
</style>
