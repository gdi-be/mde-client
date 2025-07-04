<script lang="ts">
  import Paper from '@smui/paper';
  import Button, { Icon, Label } from '@smui/button';
  import UserProfilePanel from './UserProfilePanel.svelte';
  import { fly } from 'svelte/transition';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';

  const token = $derived(getAccessToken());
  let visible = $state(false);
</script>

<div class="user-menu-wrapper">
  {#if token}
    <Button class="user-menu-button" onclick={() => (visible = !visible)}>
      <Icon class="material-icons">account_circle</Icon>
      <Label>Mein Account</Label>
    </Button>
    {#if visible}
      <div in:fly={{ y: -10, duration: 150 }} out:fly={{ y: -10, duration: 150 }}>
        <Paper class="user-menu">
          <UserProfilePanel {token} />
          <Button variant="outlined" href="/logout">
            <Label>Logout</Label>
          </Button>
        </Paper>
      </div>
    {/if}
  {:else}
    <Button variant="outlined" href="/login">
      <Label>Anmeldung</Label>
    </Button>
  {/if}
</div>

<style lang="scss">
  .user-menu-wrapper {
    position: relative;

    :global(.user-menu) {
      z-index: 1000;
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 1em;
      padding: 1em;
    }
  }
</style>
