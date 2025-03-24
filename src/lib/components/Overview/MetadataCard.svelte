<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import Card, { ActionIcons, Media, MediaContent, PrimaryAction } from '@smui/card';
  import IconButton, { Icon } from '@smui/icon-button';
  import { getContext } from 'svelte';
  import type { Token } from '$lib/models/keycloak';
  import RoleTag from '../RoleTag.svelte';
  import type { MetadataCollection } from '$lib/models/metadata';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import { Set } from '@smui/chips';
  import StatusChip from '$lib/components/StatusChip.svelte';

  const FALLBACK_IMAGE = '/logo_berlin_m_srgb.svg';

  export type MetadataCardProps = {
    metadata: MetadataCollection;
  };
  let { metadata }: MetadataCardProps = $props();

  const { sub: userId } = getContext<Token>('user_token');
  const assignedToMe = $derived(metadata.assignedUserId === userId);
  const isTeamMember = $derived(metadata.teamMemberIds?.includes(userId));
  let previewNotAvailable = $state(!metadata.isoMetadata?.preview);

  const statuses = $derived.by(() => {
    const chips = [];
    if (assignedToMe) {
      chips.push('ASSIGNED_TO_ME');
    }
    if (isTeamMember) {
      chips.push('TEAM_MEMBER');
    }
    if (metadata.responsibleRole) {
      chips.push('ROLE_' + metadata.responsibleRole);
    }
    if (metadata.isoMetadata.valid) {
      chips.push('READY_FOR_RELEASE');
    }
    return chips;
  });

  const onclick = () => {
    goto(`/metadata/${metadata.metadataId}`);
  };

  const assignToMe = async () => {
    await fetch(`/metadata/${metadata.metadataId}/user`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    invalidateAll();
  };

  const removeAssignment = async () => {
    await fetch(`/metadata/${metadata.metadataId}/user`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    invalidateAll();
  };

  async function onDelete(evt: MouseEvent) {
    const targetEl = evt.currentTarget as HTMLElement;
    evt.preventDefault();
    popconfirm(
      targetEl,
      async () => {
        // TODO:
      },
      {
        text: 'Löschen ist noch nicht implementiert',
        confirmButtonText: 'Ok'
      }
    );
  }
</script>

<Card class="metadata-card">
  <PrimaryAction class="metadata-card-content" {onclick} padded title={metadata.title}>
    <span class="title">{metadata.title}</span>
    <Media aspectRatio="16x9">
      <MediaContent>
        <img
          class={['preview-image', previewNotAvailable && 'not-available']}
          src={previewNotAvailable ? FALLBACK_IMAGE : (metadata.isoMetadata.preview as string)}
          onerror={() => (previewNotAvailable = true)}
          alt="Vorschau nicht erreichbar"
        />
      </MediaContent>
    </Media>
  </PrimaryAction>
  <Set class="status-chipset" chips={statuses} nonInteractive>
    {#snippet chip(chip)}
      <StatusChip chip={chip} colored={true} mini/>
    {/snippet}
  </Set>
  <ActionIcons class="metadata-card-actions">
    <IconButton
      aria-label={'Metadatensatz Löschen'}
      title={'Metadatensatz Löschen'}
      onclick={onDelete}
    >
      <Icon class="material-icons">delete</Icon>
    </IconButton>
    <IconButton
      aria-label={'Kommentare anzeigen'}
      title={'Kommentare anzeigen'}
      onclick={() => goto(`/metadata/${metadata.metadataId}/?action=comments`)}
    >
      <Icon class="material-icons">chat</Icon>
    </IconButton>
    <IconButton
      aria-label={'Drucken'}
      title={'Drucken'}
      onclick={() => goto(`/metadata/${metadata.metadataId}/readonly?action=print`)}
    >
      <Icon class="material-icons">print</Icon>
    </IconButton>
    <IconButton
      aria-label={'Leseansicht'}
      title={'Leseansicht'}
      onclick={() => goto(`/metadata/${metadata.metadataId}/readonly`)}
    >
      <Icon class="material-icons">preview</Icon>
    </IconButton>
    <IconButton
      toggle
      class="assign-button"
      aria-label={assignedToMe
        ? 'Mir zugewiesen.\nKlicken um Zuordnung zu entfernen.'
        : 'Mir zuweisen'}
      title={assignedToMe ? 'Mir zugeordnet.\nKlicken um Zuordnung zu entfernen.' : 'Mir zuordnen'}
      onclick={assignedToMe ? removeAssignment : assignToMe}
      pressed={assignedToMe}
    >
      <Icon class="material-icons-filled assigned-to-me" on>person_remove</Icon>
      <Icon class="material-icons-filled">person_check</Icon>
    </IconButton>
  </ActionIcons>
</Card>

<style lang="scss">
  :global(.metadata-card) {
    max-width: 300px;
    max-height: 300px;

    .title {
      min-height: 2.5em;
      text-align: center;
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

    :global(.status-chipset) {
      flex: 1 1 auto;
    }

    :global(.metadata-card-actions) {
      flex-grow: 0;
      justify-content: space-around;
    }

    :global(.assigned-to-me) {
      color: var(--error-color);
    }
  }
</style>
