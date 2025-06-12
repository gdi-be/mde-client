<script lang="ts">
  import { getContext } from 'svelte';
  import { goto } from '$app/navigation';
  import type { Role, Token } from '$lib/models/keycloak';
  import { getHighestRole } from '$lib/util';
  import Button, { Label } from '@smui/button';
  import Dialog, { Content, Header, Title } from '@smui/dialog';
  import type { UserData } from '$lib/models/api';
  import Switch from '@smui/switch';
  import FormField from '@smui/form-field';
  import { FORMSTATE_CONTEXT, type FormState } from '$lib/context/FormContext.svelte';
  import { toast } from 'svelte-french-toast';

  let { open = $bindable(false) } = $props();

  const formContext = getContext<FormState>(FORMSTATE_CONTEXT);
  const metadata = $derived(formContext.metadata);

  const token = getContext<Token>('user_token');
  const highestRole = $derived(getHighestRole(token));
  const myUserId = $derived(token?.sub);
  const assignedToMe = $derived(metadata?.assignedUserId === myUserId);
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
      toast.error(
        `Fehler beim Zuweisen der Metadaten an die Rolle "${role}". Bitte versuchen Sie es später erneut.`
      );
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
      toast.error(
        `Fehler beim Zuweisen der Metadaten an den User "${keycloakId}". Bitte versuchen Sie es später erneut.`
      );
      return Promise.reject('Failed to assign metadata to user');
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
      toast.error('Fehler beim Laden des Teams. Bitte versuchen Sie es später erneut.');
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
      toast.error(
        `Fehler beim ${approved ? 'Freigeben' : 'Zurückziehen der Freigabe'} der Metadaten. Bitte versuchen Sie es später erneut.`
      );
      return Promise.reject(`Failed to ${approved ? 'approve' : 'revoke approval'} metadata`);
    }
  };
</script>

{#snippet approve()}
  <fieldset class="approve">
    <legend>Prüfung</legend>
    <p>
      Wählen sie den Überprüfungsstatus der Metadaten aus. Wenn sie den Status ändern denken sie
      daran einen Kommentar zu hinterlassen.
    </p>
    <FormField align="end">
      {#snippet label()}
        <Label>Metadaten Prüfung erfolgreich?</Label>
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
    <h4>Redaktion</h4>
    <div class="actions">
      {#if users?.length > 0}
        {#each users as user}
          <Button variant="raised" onclick={() => assignToUser(user.keycloakId)}>
            <Label>An "{user.displayName}" übergeben</Label>
          </Button>
        {/each}
      {/if}
      <Button variant="outlined" onclick={() => assignToRole('MdeEditor')}>
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
      <Button variant="outlined" onclick={() => assignToRole('MdeQualityAssurance')}>
        <Label>An Qualitätssicherung übergeben</Label>
      </Button>
    </div>
  </div>
{/snippet}

<Dialog bind:open aria-labelledby="Zuweisung" aria-describedby="Zuweisung">
  <Header>
    <Title>Zuweisung</Title>
  </Header>
  <Content>
    <div class="assignment-panel">
      {#if !canAssignToEditor && !canAssignToDataOwner && !canAssignToQualityAssurance}
        <p>Sie haben keine Berechtigung um die Metadaten zuzuweisen.</p>
      {:else}
        {#if canApproveMetadata}
          {@render approve()}
        {/if}
        <p>Wählen Sie eine Rolle oder einen User an die Sie die Metadaten übergeben wollen.</p>
        {#await fetchTeamAndGroupByRole()}
          <p>Lade Team</p>
        {:then groups}
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
