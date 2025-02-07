<script>
  import Breadcrumbs from "./Breadcrumbs.svelte";
  import UserMenu from "./UserMenu.svelte";

  let {
    text = 'Metadaten Editor',
  } = $props();

</script>

<header>
  <div class="left-items">
    <Breadcrumbs />
  </div>
  <div class="center-items">
    {text}
  </div>
  <div class="right-items">
    <UserMenu />
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
