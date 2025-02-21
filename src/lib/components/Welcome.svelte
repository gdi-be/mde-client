<script>
  import Button, { Label } from '@smui/button';
  import { getContext } from 'svelte';

  const token = getContext('user_token');
</script>

<div class="welcome">
  {#if !token}
    <h2>Metadateneditor der GDI-Berlin</h2>
    <p>Anmelden, um Metadaten zu bearbeiten.</p>
    <Button variant="outlined" href="/login">
      <Label>Login</Label>
    </Button>
  {:else}
    <h1>{`Hallo ${token?.given_name || token?.preferred_username}`}</h1>
    <p>Willkommen beim Metadateneditor</p>
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
