<script>
  import { page } from '$app/stores';

  const breadcrumbs = $derived.by(() => {
    const parts = $page.url.pathname.split('/').filter(a => a !== '');
    return parts.map((part, i) => {
      return {
        name: part,
        url: '/' + parts.slice(0, i + 1).join('/')
      };
    });
  });

</script>

<nav>
  <ul>
    <li>
      <a href="/">home</a>
    </li>
    {#each breadcrumbs as {name, url}}
      <li>
        {#if url === $page.url.pathname}
          <i>/</i>{name}
        {:else}
          <i>/</i><a href={url}>{name}</a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
  ul {
    display: flex;
    list-style: none;
    padding: 0;

    i {
      color: gray;
      margin: 0 0.25em;
    }
  }

</style>
