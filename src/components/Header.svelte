<script>
  import LoginButton from "./LoginButton.svelte";
  import LogoutButton from "./LogoutButton.svelte";

  let {
    text = 'Header',
    token
  } = $props();
</script>

<header>
  <div></div>
  <div>
    {text}
  </div>
  <div>
    {#if token}
      <div>
        <LogoutButton />
      </div>
    {:else}
      <div>
        <LoginButton />
      </div>
    {/if}
  </div>
</header>

<style>
  header {
    background-color: #f8f9fa;
    height: 3em;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
    align-self: stretch;

    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      align-items: center;
      flex: 1;
    }
  }
</style>
