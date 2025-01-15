<script>
  import * as m from '$lib/paraglide/messages';
  import LoginButton from './LoginButton.svelte';

  const { token } = $props();
</script>

<div class="welcome">
  {#if !token}
    <h2>
      Metadateneditor der GDI-Berlin
    </h2>
    <p>
      Anmelden, um Metadaten zu bearbeiten.
    </p>
    <LoginButton />
  {:else}
    <h1>{m.title({ name: token?.given_name || token?.preferred_username})}</h1>
    <p>
      {m.welcome()}
    </p>
    <p>
      <a href="/metadata">Zur Metadaten Übersicht</a>
    </p>
  {/if}
</div>

<style lang="scss">
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
