<script>
  import { getContext } from "svelte";
  import Breadcrumbs from "./Breadcrumbs.svelte";
  import LoginButton from "./LoginButton.svelte";
  import LogoutButton from "./LogoutButton.svelte";

  let {
    text = 'Header'
  } = $props();

  const token = getContext('user_token');

</script>

<header>
  <div class="left-items">
    <Breadcrumbs />
  </div>
  <div class="center-items">
    {text}
  </div>
  <div class="right-items">
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

    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      display: flex;
      flex: 1;
    }

    .left-items {
      justify-content: left;
      padding-left: 1em;
    }

    .center-items {
      justify-content: center;
    }

    .right-items {
      justify-content: right;
      padding-right: 1em;
    }
  }
</style>
