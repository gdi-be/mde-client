<script>
  import Breadcrumbs from './Breadcrumbs.svelte';
  import UserMenu from './UserMenu.svelte';
  import { page } from '$app/state';

  const t = $derived(page.data.t);
</script>

<header class="application-header">
  <div class="container left-container">
    <Breadcrumbs />
  </div>
  <div class="container center-container">
    {t('general.appTitle')}
  </div>
  <div class="container right-container">
    <UserMenu />
  </div>
</header>

<style>
  header.application-header {
    background-color: #f8f9fa;
    height: 3em;
    text-align: center;
    border-bottom: 1px solid #dee2e6;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .container {
      flex: 1;
      display: flex;
      padding: 0 1em;
      gap: 1em;

      &.left-container {
        justify-content: left;
      }

      &.center-container {
        justify-content: center;
      }

      &.right-container {
        justify-content: right;
      }
    }
  }
</style>
