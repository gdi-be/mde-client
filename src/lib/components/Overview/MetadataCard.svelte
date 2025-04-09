<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import Card, { ActionIcons, Media, MediaContent, PrimaryAction } from '@smui/card';
  import IconButton, { Icon } from '@smui/icon-button';
  import { getContext } from 'svelte';
  import type { Token } from '$lib/models/keycloak';
  import type { MetadataCollection } from '$lib/models/metadata';
  import { popconfirm } from '$lib/context/PopConfirmContex.svelte';
  import { Set } from '@smui/chips';
  import StatusChip from '$lib/components/StatusChip.svelte';
  import { getHighestRole } from '../../util';

  const FALLBACK_IMAGE = '/logo_berlin_m_srgb.svg';

  export type MetadataCardProps = {
    metadata: MetadataCollection;
  };
  let { metadata }: MetadataCardProps = $props();

  const token = getContext<Token>('user_token');
  const userId = $derived(token?.sub);
  const highestRole = $derived(getHighestRole(token));
  const assignedToMe = $derived(metadata.assignedUserId === userId);
  const assignedToSomeoneElse = $derived((metadata.assignedUserId && metadata.assignedUserId !== userId) || false);
  const isTeamMember = $derived(metadata.teamMemberIds?.includes(userId));
  let previewNotAvailable = $state(!metadata.isoMetadata?.preview);
  const showDeleteAction = $derived(
    highestRole === 'Administrator' ||
    metadata.assignedUserId === userId &&
    highestRole === 'Editor'
  );
  const showCommentsAction = $derived(true);
  const showPrintAction = $derived(true);
  const showEditAction = $derived(
    highestRole === 'Administrator' ||
    metadata.assignedUserId === userId
  );
  const showAssignAction = $derived(
    highestRole === 'Administrator' ||
    (
      !assignedToSomeoneElse &&
      highestRole === metadata.responsibleRole &&
      highestRole !== 'DataOwner'
    )
  );

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

  const assignButtonLabeL = $derived.by(() => {
    if (highestRole === 'Administrator') {
      return 'Zuweisung verwalten.';
    } else if (assignedToMe) {
      return 'Mir zugewiesen.\nKlicken um Zuordnung zu entfernen.';
    } else if (isTeamMember) {
      return 'Mir zuweisen';
    }
  });

  const onAssign = () => {
    if (highestRole === 'Administrator') {
      goto(`/metadata/${metadata.metadataId}/readonly?action=print`);
    } else if (assignedToMe) {
      removeAssignment();
    } else {
      assignToMe();
    }
  };

  const onComments = () => {
    goto(`/metadata/${metadata.metadataId}/?action=comments`);
  };

  const onPrint = () => {
    goto(`/metadata/${metadata.metadataId}/readonly?action=print`);
  };

  const onEdit = () => {
    goto(`/metadata/${metadata.metadataId}`);
  };

  const onRead = () => {
    goto(`/metadata/${metadata.metadataId}/readonly`);
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
  // previewNotAvailable ? FALLBACK_IMAGE : (metadata.isoMetadata.preview as string)
  async function getImageSource() {
    if (metadata.isoMetadata?.preview) {
      const response = await fetch('/replace_variable', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          value: metadata.isoMetadata?.preview
        })
      });

      if (response.ok) {
        const { value } = await response.json();
        const success = true;
        console.log('Image source:', value);
        return { src: value, success };
      } else {
        const success = false;
        return { src: FALLBACK_IMAGE, success };
      }
    } else {
      const success = false;
      return { src: FALLBACK_IMAGE, success };
    }
  }

</script>

<Card class="metadata-card">
  <PrimaryAction class="metadata-card-content" onclick={onRead} padded title={metadata.title}>
    <span class="title">{metadata.title}</span>
    <Media aspectRatio="16x9">
      <MediaContent>
        {#await getImageSource() }
          <img
            class={['preview-image not-available']}
            src={FALLBACK_IMAGE}
            alt="Vorschau nicht erreichbar"
          />
        {:then asyncSource }
          <img
            class={[
              'preview-image',
              (!asyncSource.success || previewNotAvailable) && 'not-available'
            ]}
            src={previewNotAvailable ? FALLBACK_IMAGE : asyncSource.src}
            onerror={() => (previewNotAvailable = true)}
            alt="Vorschau"
          />
        {/await}
      </MediaContent>
    </Media>
  </PrimaryAction>
  <Set class="status-chipset" chips={statuses} nonInteractive>
    {#snippet chip(chip)}
      <StatusChip chip={chip} colored={true} mini/>
    {/snippet}
  </Set>
  <ActionIcons class="metadata-card-actions">
    {#if showDeleteAction}
    <IconButton
      aria-label={'Metadatensatz Löschen'}
      title={'Metadatensatz Löschen'}
      onclick={onDelete}
    >
      <Icon class="material-icons">delete</Icon>
    </IconButton>
    {/if}
    {#if showCommentsAction}
    <IconButton
      aria-label={'Kommentare anzeigen'}
      title={'Kommentare anzeigen'}
      onclick={onComments}
    >
      <Icon class="material-icons">chat</Icon>
    </IconButton>
    {/if}
    {#if showPrintAction}
    <IconButton
      aria-label={'Drucken'}
      title={'Drucken'}
      onclick={onPrint}
    >
      <Icon class="material-icons">print</Icon>
    </IconButton>
    {/if}
    {#if showEditAction}
    <IconButton
      aria-label={'Bearbeiten'}
      title={'Bearbeiten'}
      onclick={onEdit}
    >
      <Icon class="material-icons">edit</Icon>
    </IconButton>
    {/if}
    {#if showAssignAction}
      <IconButton
        toggle
        class="assign-button"
        aria-label={assignButtonLabeL}
        title={assignButtonLabeL}
        onclick={onAssign}
        pressed={assignedToMe && highestRole !== 'Administrator'}
      >
        <Icon class="material-icons-filled assigned-to-me" on>person_remove</Icon>
        <Icon class="material-icons-filled">
          {highestRole === 'Administrator' ? 'manage_accounts' : 'person_check'}
        </Icon>
      </IconButton>
    {/if}
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
