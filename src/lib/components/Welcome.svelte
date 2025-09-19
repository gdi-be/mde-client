<script>
  import Button, { Label } from '@smui/button';
  import { getAccessToken } from '$lib/context/TokenContext.svelte';
  import { page } from '$app/state';

  const t = $derived(page.data.t);

  const token = $derived(getAccessToken());
</script>

<div class="welcome">
  {#if !token}
    <h2>{t('welcome.welcomeTitle')}</h2>
    <p>{t('welcome.loginText')}</p>
    <Button variant="outlined" href="/login" type="button">
      <Label>{t('welcome.loginButtonText')}</Label>
    </Button>
  {:else}
    <h1>{`Hallo ${token?.given_name || token?.preferred_username}`}</h1>
    <p>{t('welcome.welcomeText')}</p>
    <p>
      <a href="/metadata">{t('welcome.overviewLinkText')}</a>
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
