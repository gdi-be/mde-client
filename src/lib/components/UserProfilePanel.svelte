<script lang="ts">
  import type { Role, Token } from '$lib/models/keycloak';

  type UserProfilePanelProps = {
    token: Token;
  };

  let { token }: UserProfilePanelProps = $props();

  const hiddenRoles = ['offline_access', 'uma_authorization', 'default-roles-metadata-editor'];

  const roleFilter = (role: Role) => hiddenRoles.indexOf(role) === -1;
  const roleMap = (role: Role) => {
    if (role === 'MdeAdministrator') return 'Administrator';
    if (role === 'MdeDataOwner') return 'Datenhaltende Stelle';
    if (role === 'MdeQualityAssurance') return 'Qualitätsmanagement';
    if (role === 'MdeEditor') return 'Redakteur';
    return role;
  };

  const userName = $derived(
    token?.given_name && token?.family_name
      ? `${token?.given_name} ${token?.family_name}`
      : token?.preferred_username
  );
  const email = $derived(token?.email);
  const roles = $derived(
    (token?.realm_access?.roles as Role[]).filter(roleFilter).map(roleMap).join(', ')
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

    .username,
    .email {
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
