<script>
  import * as m from '$lib/paraglide/messages';
  import keycloak from '$lib/auth/keycloak';
  import LoginButton from './LoginButton.svelte';

  let user = $derived(keycloak.tokenParsed);
  let authenticated = $derived(keycloak.authenticated || false);
</script>

<div class="welcome">
  {#if !authenticated}
    <h2>
      Hallo Schönheit!
    </h2>
    <p>
      Melde dich an für Spaß mit Metadaten!
    </p>
    <LoginButton />
  {:else}
    <h1>{m.title({ name: user?.given_name || user?.preferred_username})}</h1>
    <p>
      {m.welcome()}
    </p>
    <p>
      <a href="/editor">Hier geht's zum Spaß!</a>
    </p>
    <p>
      Ausloggen kannst du dich oben rechts.
    </p>
  {/if}
</div>

<style lang="less">
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
    }
  }
</style>
