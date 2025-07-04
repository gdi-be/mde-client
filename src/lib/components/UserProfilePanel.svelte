<script lang="ts">
  import type { Role, Token } from '$lib/models/keycloak';
  import { getRefreshToken } from '$lib/context/TokenContext.svelte';

  type UserProfilePanelProps = {
    token: Token;
  };

  let { token }: UserProfilePanelProps = $props();

  const hiddenRoles = ['offline_access', 'uma_authorization', 'default-roles-metadata-editor'];

  const refreshToken = $derived(getRefreshToken());

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

  let remainingSessionTime: number | undefined = $state();

  let interval: ReturnType<typeof setInterval>;

  $effect(() => {
    remainingSessionTime = getRemainingSessionTime();

    interval = setInterval(() => {
      remainingSessionTime = getRemainingSessionTime();
    }, 1000);

    return () => clearInterval(interval);
  });

  const getRemainingSessionTime = () => {
    if (!refreshToken || !refreshToken.exp) {
      return undefined;
    }
    return Math.max(0, Math.floor((refreshToken.exp * 1000 - Date.now()) / 1000));
  };

  function formatTime(seconds: number): string {
    const hh = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const mm = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const ss = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
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
  {#if typeof remainingSessionTime === 'number'}
    <div class="session-idle-time">
      <p>Sitzung läuft ab in: {formatTime(remainingSessionTime)}</p>
    </div>
  {/if}
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

    .session-idle-time {
      margin-top: 1em;
      padding: 0.5em;
      background-color: var(--mdc-theme-background);
      border: 1px solid var(--mdc-outlined-button-outline-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      font-size: 0.9em;
      text-align: center;
      color: var(--mdc-theme-on-background);
    }
  }
</style>
