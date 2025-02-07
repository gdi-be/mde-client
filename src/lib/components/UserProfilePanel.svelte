<script lang="ts">
  import type { Token } from "$lib/models/keycloak";

  type UserProfilePanelProps = {
    token: Token;
  };

  let {
    token
  }: UserProfilePanelProps = $props();

  const hiddenRoles = [
    'offline_access',
    'uma_authorization',
    'default-roles-metadata-editor'
  ];

  const roleFilter = (role: string) => hiddenRoles.indexOf(role) === -1;
  const roleMap = (role: string) => {
    if (role === 'Administrator') return 'Administrator';
    if (role === 'DataOwner') return 'Datenhaltende Stelle';
    if (role === 'QualityAssurance') return 'Qualitätsmanagement';
    if (role === 'Editor') return 'Redakteur';
    return role;
  };

  const userName = $derived(
    token?.given_name && token?.family_name
      ? `${token?.given_name} ${token?.family_name}`
      : token?.preferred_username
  );
  const email = $derived(token?.email);
  const roles = $derived(token?.realm_access?.roles
    .filter(roleFilter)
    .map(roleMap)
    .join(', ')
  );

</script>

<div class="user-profile-panel">
  <div class="username">
    <span>{userName}</span>
  </div>
  <div class="email">
    <span>{email}</span>
  </div>
  <div class="roles">
    <span>{roles}</span>
  </div>
</div>

<style lang="scss">
  .user-profile-panel {
    display: flex;
    flex-direction: column;
    width: 15em;

    .username, .email {
      text-align: left;
    }

    .email {
      color: var(--mdc-theme-secondary);
      font-size: 0.8em;
    }

    .roles {
      color: var(--mdc-theme-secondary);
      font-style: italic;
      margin-top: 1em;
    }
  }
</style>
