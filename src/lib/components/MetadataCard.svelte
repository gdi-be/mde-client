<script lang="ts">
  import { goto } from "$app/navigation";
  import Card, { ActionIcons, Media, MediaContent, PrimaryAction } from "@smui/card";
  import type { IsoMetadata } from "$lib/models/metadata";
  import IconButton, { Icon } from "@smui/icon-button";
  import { getContext } from "svelte";
  import type { Token } from "$lib/models/keycloak";
  import RoleTag from "./RoleTag.svelte";

  const FALLBACK_IMAGE = "https://www.berlin.de/css/berlin_de/foxtrot/images/logo_berlin_m_srgb.svg";

  export type MetadataCardProps = {
    metadata: IsoMetadata;
  }
  let { metadata }: MetadataCardProps = $props();

  const { sub: userId } = getContext<Token>('user_token');
  const assignedToMe = $derived(metadata.responsibleUserId === userId);
  let previewNotAvailable = $state(!metadata.data.preview);

  const onclick = () => {
    goto(`/metadata/${metadata.metadataId}`);
  };

  const assignToMe = async () => {
    await fetch(`/metadata/${metadata.metadataId}/user`, {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
  };

  const removeAssignment = async () => {
    await fetch(`/metadata/${metadata.metadataId}/user`, {
      method: "DELETE",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
  }

  $inspect(metadata);
</script>

<Card class="metadata-card">
  <PrimaryAction
    class="metadata-card-content"
    onclick={onclick}
    padded
    title={metadata.title}
  >
    <span class="title">{metadata.title}</span>
    <Media aspectRatio="square">
      <MediaContent>
        <img
          class={["preview-image", previewNotAvailable && "not-available"]}
          src={previewNotAvailable ? FALLBACK_IMAGE : metadata.data.preview as string}
          onerror={() => previewNotAvailable = true}
          alt="Vorschau nicht erreichbar"
        />
      </MediaContent>
    </Media>
  </PrimaryAction>
  <ActionIcons class="metadata-card-actions" >
    {#if metadata.responsibleRole}
      <RoleTag role={metadata.responsibleRole} />
      <div style="flex: 1;"></div>
    {/if}
    <IconButton
      toggle
      aria-label={assignedToMe ? "Mir zugewiesen.\nKlicken um Zuordnung zu entfernen." : "Mir zuweisen"}
      title={assignedToMe ? "Mir zugewiesen.\nKlicken um Zuordnung zu entfernen." : "Mir zuweisen"}
      onclick={assignedToMe ? removeAssignment : assignToMe}
      pressed={assignedToMe}
    >
      <Icon class="material-icons-filled assigned-to-me" on>assignment_ind</Icon>
      <Icon class="material-icons">assignment_add</Icon>
    </IconButton>
  </ActionIcons>
</Card>

<style lang="scss">
  :global(.metadata-card) {
    width: 15rem;
    max-height: 288px;

    .title {
      min-height: 2.5em;
    }

    .preview-image {
      object-fit: contain;
      width: 100%;
      height: 100%;

      &.not-available {
        filter: grayscale(100%);
        opacity: 0.25;
        scale: 0.6;
      }
    }

    :global(.metadata-card-content) {
      height: 15rem;
      text-align: center;
    }

    :global(.assigned-to-me) {
      color: var(--mdc-theme-primary);
    }
  }
</style>
