<script lang="ts">
  import { goto } from "$app/navigation";
  import Card, { ActionIcons, PrimaryAction } from "@smui/card";
  import type { Metadata } from "../models/metadata";
  import IconButton, { Icon } from "@smui/icon-button";

  export type MetadataCardProps = {
    metadata: Metadata;
  }
  let { metadata }: MetadataCardProps = $props();

  const onclick = () => {
    goto(`/metadata/${metadata.metadataId}`);
  };

</script>

<Card class="metadata-card">
  <PrimaryAction
    class="metadata-card-content"
    onclick={onclick}
    padded
    title={metadata.title}
  >
    {metadata.title}
  </PrimaryAction>
  <ActionIcons class="metadata-card-actions" >
    <IconButton
      toggle
      aria-label="Add to favorites"
      title="Add to favorites"
    >
      <Icon class="material-icons" on>favorite</Icon>
      <Icon class="material-icons">favorite_border</Icon>
    </IconButton>
    <IconButton
      class="material-icons"
      title="Share">share</IconButton
    >
    <IconButton
      class="material-icons"
      title="More options">more_vert</IconButton
    >
  </ActionIcons>
</Card>

<style lang="scss">
  :global(.metadata-card) {
    width: 15rem;
    max-height: 288px;

    :global(.metadata-card-content) {
      height: 15rem;
      text-align: center;
    }
  }
</style>
