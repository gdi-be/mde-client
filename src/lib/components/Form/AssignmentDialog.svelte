<script lang="ts">
  import { getContext } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Role, Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';
  import Button, { Label } from '@smui/button';
  import Dialog, { Content, Header, Title } from '@smui/dialog';
  import type { UserData } from '$lib/models/api';

  let { metadata, open = $bindable(false) } = $props();

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const myUserId = $derived(token?.sub);
  const assignedToMe = $derived(metadata?.assignedUserId === myUserId);
  const responsibleRole = $derived(metadata?.responsibleRole || '');

  const canAssignToDataOwner = $derived(
    // Admin can do anything
    highestRole === 'Administrator' ||
    // Editors are responsible and I'm an Editor
    (responsibleRole === 'Editor' && highestRole === 'Editor')
  );

  const canAssignToEditor = $derived(
    // Admin can do anything
    highestRole === 'Administrator' ||
    // Its assigned to me and I'm not an Editor already
    (assignedToMe && responsibleRole !== 'Editor')
  );

  const canAssignToQualityAssurance = $derived(
    // Admin can do anything
    highestRole === 'Administrator' ||
    // Editors are responsible and I'm an Editor
    (responsibleRole === 'Editor' && highestRole === 'Editor')
  );

  $inspect({
    canAssignToQualityAssurance,
    highestRole,
    assignedToMe,
    responsibleRole
  });

  const assignToRole = async (role: Role) => {
    if (!metadata) return;

    await fetch(`/metadata/${metadata.metadataId}/role`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        role,
        assignUser: true
      })
    });

    goto('/metadata', {
      invalidateAll: true,
    });

    open = false;
  }

  const assignToUser = async (keycloakId: string) => {
    if (!metadata) return;

    await fetch(`/metadata/${metadata.metadataId}/user`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId: keycloakId })
    });

    goto('/metadata', {
      invalidateAll: true,
    });

    open = false;
  };

  const fetchTeamAndGroupByRole = async () => {
    const response = await fetch(`/metadata/${metadata.metadataId}/team`);
    if (response.ok) {
      const teamMembers = await response.json();

      // group teamMembers by role
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const groupedTeamMembers = teamMembers.reduce((acc: any, member: any) => {
        if (!acc[member.role]) {
          acc[member.role] = [];
        }
        acc[member.role].push(member);
        return acc;
      }, {});

      // sort team members by displayName
      Object.keys(groupedTeamMembers).forEach((role) => {
        groupedTeamMembers[role].sort((a: UserData, b: UserData) =>
          a.displayName.localeCompare(b.displayName)
        );
      });

      return groupedTeamMembers;
    }
  };
</script>

{#snippet assignToEditor(users: UserData[] = [])}
  <div class="assign-section assign-editor">
    <h4>Redaktion</h4>
    <div class="actions">
      {#if users?.length > 0}
        {#each users as user}
          <Button variant="raised" onclick={() => assignToUser(user.keycloakId)}>
            <Label>An "{user.displayName}" übergeben</Label>
          </Button>
        {/each}
      {/if}
      <Button variant="outlined" onclick={() => assignToRole('Editor')}>
        <Label>An Redaktion übergeben</Label>
      </Button>
    </div>
  </div>
{/snippet}

{#snippet assignToDataOwner(users: UserData[] = [])}
  <div class="assign-section assign-data-owner">
    <h4>Datenhaltende Stelle</h4>
    <div class="actions">
      {#if users.length === 1}
        {@const user = users[0]}
        <Button variant="raised" onclick={() => assignToUser(user.keycloakId)}>
          <Label>An "{user.displayName}" übergeben</Label>
        </Button>
      {:else}
        <span class="failure">
          Der User der datenhaltende Stelle konnte nicht ermittelt werden.
        </span>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet assignToQualityAssurance(users: UserData[] = [])}
  <div class="assign-section assign-quality-assurance">
    <h4>Qualitätssicherung</h4>
    <div class="actions">
      {#if users?.length > 0}
        {#each users as user}
          <Button variant="raised" onclick={() => assignToUser(user.keycloakId)}>
            <Label>An "{user.displayName}" übergeben</Label>
          </Button>
        {/each}
      {/if}
      <Button variant="outlined" onclick={() => assignToRole('QualityAssurance')}>
        <Label>An Qualitätssicherung übergeben</Label>
      </Button>
    </div>
  </div>
{/snippet}

<Dialog
  bind:open
  aria-labelledby="Zuweisung"
  aria-describedby="Zuweisung"
>
  <Header>
    <Title>Zuweisung</Title>
  </Header>
  <Content>
    <div class="assignment-panel">
      {#if !canAssignToEditor && !canAssignToDataOwner && !canAssignToQualityAssurance}
        <p>Sie haben keine Berechtigung um die Metadaten zuzuweisen.</p>
      {:else}
        <p>Wählen Sie eine Rolle oder einen User an die Sie die Metadaten übergeben wollen.</p>
        {#await fetchTeamAndGroupByRole()}
          <p>Lade Team</p>
        {:then groups}
          {#if canAssignToEditor}
            {@render assignToEditor(groups['Editor'])}
          {/if}
          {#if canAssignToDataOwner}
            {@render assignToDataOwner(groups['DataOwner'])}
          {/if}
          {#if canAssignToQualityAssurance}
            {@render assignToQualityAssurance(groups['QualityAssurance'])}
          {/if}
        {:catch}
          {#if canAssignToEditor}
            {@render assignToEditor()}
          {/if}
          {#if canAssignToDataOwner}
            {@render assignToDataOwner()}
          {/if}
          {#if canAssignToQualityAssurance}
            {@render assignToQualityAssurance()}
          {/if}
        {/await}
      {/if}
    </div>
  </Content>
</Dialog>

<style lang="less">
  .assignment-panel {
    color: black;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;

    .assign-section {
      display: flex;
      flex-direction: column;
      gap: 0.5em;

      h4 {
        margin: 0;
      }

      .actions {
        margin-left: 3em;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 0.5em;
      }

      .failure {
        color: var(--mdc-theme-error);
        font-weight: bold;
      }
    }
  }
</style>
