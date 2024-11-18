<script>
  import keycloak from '$lib/auth/keycloak';

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
  };

  let authenticated = $derived(keycloak.authenticated || false);
</script>

{#if authenticated}
  <button onclick={logout}>Logout</button>
{:else}
  <button onclick={login}>Login</button>
{/if}
