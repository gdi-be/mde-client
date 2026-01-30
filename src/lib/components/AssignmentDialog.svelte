<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Role } from '$lib/models/keycloak';
  import { canAssignSelf, canUnassignSelf, getHighestRole } from '$lib/util';
  import Button, { Label } from '@smui/button';
  import Dialog, { Content, Header, Title } from '@smui/dialog';
  import type { UserData } from '$lib/models/api';
  import Switch from '@smui/switch';
  import FormField from '@smui/form-field';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import { toast } from 'svelte-french-toast';
  import { getContext } from 'svelte';

  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  let { open = $bindable(false) } = $props();

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);

  const token = $derived(getAccessToken());
  const highestRole = $derived(getHighestRole(token));
  const userId = $derived(token?.sub);
  const assignedToMe = $derived(metadata?.assignedUserId === userId);
  const responsibleRole = $derived(metadata?.responsibleRole || '');

  const canAssignToDataOwner = $derived(
    // Admin can do anything
    highestRole === 'MdeAdministrator' ||
      // Editors are responsible and I'm an Editor
      (responsibleRole === 'MdeEditor' && highestRole === 'MdeEditor')
  );

  const canAssignToEditor = $derived(
    // Admin can do anything
    highestRole === 'MdeAdministrator' ||
      // Its assigned to me and I'm not an Editor already
      (assignedToMe && responsibleRole !== 'MdeEditor')
  );

  const canAssignToQualityAssurance = $derived(
    // Admin can do anything
    highestRole === 'MdeAdministrator' ||
      // Editors are responsible and I'm an Editor
      (responsibleRole === 'MdeEditor' && highestRole === 'MdeEditor')
  );

  const canApproveMetadata = $derived(
    ['MdeAdministrator', 'MdeQualityAssurance'].includes(highestRole)
  );

  const canAssignToMe = $derived(canAssignSelf(token, metadata));
  const canUnassign = $derived(canUnassignSelf(token, metadata));

  const assignToRole = async (role: Role) => {
    if (!metadata) return;

    const response = await fetch(`/metadata/${metadata.metadataId}/role`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        role
      })
    });

    if (!response.ok) {
      toast.error(t('assignment.assignRoleError', { role }));
      return Promise.reject('Failed to assign metadata to role');
    }

    goto('/metadata', {
      invalidateAll: true
    });

    open = false;
  };

  const assignToUser = async (keycloakId: string) => {
    if (!metadata) return;

    const response = await fetch(`/metadata/${metadata.metadataId}/user`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId: keycloakId })
    });

    if (!response.ok) {
      toast.error(t('assignment.assignUserError', { user: keycloakId }));
      return Promise.reject('Failed to assign metadata to user');
    }

    goto('/metadata', {
      invalidateAll: true
    });

    open = false;
  };

  const unassignUser = async () => {
    if (!metadata || !userId) return;

    const response = await fetch(`/metadata/${metadata.metadataId}/user`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    });

    if (!response.ok) {
      toast.error(t('assignment.unassignError'));
    }

    goto('/metadata', {
      invalidateAll: true
    });

    open = false;
  };

  const fetchTeamAndGroupByRole = async () => {
    if (!metadata) return;
    const response = await fetch(`/metadata/${metadata.metadataId}/team`);

    if (!response.ok) {
      toast.error(t('assignment.teamLoadError'));
      return Promise.reject('Failed to fetch team members');
    }

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
  };

  const onApprovalStateChange = async (approved: boolean) => {
    if (!metadata) return;
    const response = await fetch(`/metadata/${metadata.metadataId}/approved`, {
      method: approved ? 'POST' : 'DELETE'
    });

    if (!response.ok) {
      toast.error(t('assignment.approvalError', { action: approved ? 'approve' : 'revoke' }));
      return Promise.reject(`Failed to ${approved ? 'approve' : 'revoke approval'} metadata`);
    }
  };
</script>

{#snippet approve()}
  <fieldset class="approve">
    <legend>{t('assignment.review')}</legend>
    <p>{t('assignment.reviewStatusHint')}</p>
    <FormField align="end">
      {#snippet label()}
        <Label>{t('assignment.reviewStatus')}</Label>
      {/snippet}
      <Switch
        checked={metadata?.approved}
        onSMUISwitchChange={(event) => {
          const approved = event.detail.selected;
          onApprovalStateChange(Boolean(approved));
        }}
      />
    </FormField>
  </fieldset>
{/snippet}

{#snippet assignToEditor(users: UserData[] = [])}
  <div class="assign-section assign-editor">
    <h4>{t('assignment.assignEditor')}</h4>
    <div class="actions">
      {#if users?.length > 0 && highestRole !== 'MdeDataOwner'}
        {#each users as user}
          <Button variant="raised" onclick={() => assignToUser(user.keycloakId)} type="button">
            <Label>{t('assignment.handoverTo', { name: user.displayName })}</Label>
          </Button>
        {/each}
      {/if}
      <Button variant="outlined" onclick={() => assignToRole('MdeEditor')} type="button">
        <Label>{t('assignment.handoverToRole', { role: t('assignment.assignEditor') })}</Label>
      </Button>
    </div>
  </div>
{/snippet}

{#snippet assignToDataOwner(users: UserData[] = [])}
  <div class="assign-section assign-data-owner">
    <h4>{t('assignment.assignDataOwner')}</h4>
    <div class="actions">
      {#if users.length === 1}
        {@const user = users[0]}
        <Button variant="raised" onclick={() => assignToUser(user.keycloakId)} type="button">
          <Label>{t('assignment.handoverTo', { name: user.displayName })}</Label>
        </Button>
      {:else}
        <span class="failure">
          {t('assignment.dataOwnerUserNotFound')}
        </span>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet assignToQualityAssurance(users: UserData[] = [])}
  <div class="assign-section assign-quality-assurance">
    <h4>{t('assignment.assignQuality')}</h4>
    <div class="actions">
      {#if users?.length > 0}
        {#each users as user}
          <Button variant="raised" onclick={() => assignToUser(user.keycloakId)} type="button">
            <Label>{t('assignment.handoverTo', { name: user.displayName })}</Label>
          </Button>
        {/each}
      {/if}
      <Button variant="outlined" onclick={() => assignToRole('MdeQualityAssurance')} type="button">
        <Label>{t('assignment.handoverToRole', { role: t('assignment.assignQuality') })}</Label>
      </Button>
    </div>
  </div>
{/snippet}

{#snippet assignToMe(userId?: string)}
  {#if userId}
    <div class="assign-section assign-self">
      <h4>{t('assignment.assignSelf')}</h4>
      <div class="actions">
        <Button variant="raised" onclick={() => assignToUser(userId)} type="button">
          <Label>{t('assignment.assignToMe')}</Label>
        </Button>
      </div>
    </div>
  {/if}
{/snippet}

{#snippet unassign()}
  <div class="assign-section unassign">
    <h4>{t('assignment.assignedToMe')}</h4>
    <div class="actions">
      <Button variant="raised" onclick={() => unassignUser()} type="button">
        <Label>{t('assignment.unassign')}</Label>
      </Button>
    </div>
  </div>
{/snippet}

<Dialog bind:open aria-labelledby="Zuweisung" aria-describedby="Zuweisung">
  <Header>
    <Title>{t('assignment.assignDialog')}</Title>
  </Header>
  <Content>
    <div class="assignment-panel">
      {#if !canAssignToEditor && !canAssignToDataOwner && !canAssignToQualityAssurance && !canAssignToMe}
        <p>{t('assignment.noPermission')}</p>
      {:else}
        {#if canApproveMetadata}
          {@render approve()}
        {/if}
        <p>{t('assignment.chooseRoleOrUser')}</p>
        {#await fetchTeamAndGroupByRole()}
          <p>{t('assignment.loadingTeam')}</p>
        {:then groups}
          {#if canAssignToMe}
            {@render assignToMe(userId)}
          {/if}
          {#if canUnassign}
            {@render unassign()}
          {/if}
          {#if canAssignToEditor}
            {@render assignToEditor(groups['MdeEditor'])}
          {/if}
          {#if canAssignToDataOwner}
            {@render assignToDataOwner(groups['MdeDataOwner'])}
          {/if}
          {#if canAssignToQualityAssurance}
            {@render assignToQualityAssurance(groups['MdeQualityAssurance'])}
          {/if}
        {:catch}
          {#if canAssignToMe}
            {@render assignToMe(userId)}
          {/if}
          {#if canUnassign}
            {@render unassign()}
          {/if}
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

<style lang="scss">
  .assignment-panel {
    color: black;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;

    fieldset.approve {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      border-radius: 0.25em;

      --mdc-switch-unselected-handle-color: var(--mdc-theme-error);
      --mdc-switch-selected-handle-color: var(--ready-for-release-color);
    }

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
