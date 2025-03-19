<script lang="ts">
  import { page } from '$app/state';

  type TranslatedParts = {
    metadata: string;
  };

  const m = {
    metadata: 'Metadaten',
    create: 'Neuerfassung'
  };

  const breadcrumbs = $derived.by(() => {
    const parts = page.url.pathname.split('/').filter((a) => a !== '');
    return parts.map((part, i) => {
      return {
        name: part,
        url: '/' + parts.slice(0, i + 1).join('/')
      };
    });
  });

  const getUrlPartName = (part: keyof TranslatedParts) => (m[part] ? m[part] : part);
</script>

<nav>
  <ul>
    <li>
      <a href="/">🏠</a>
    </li>
    {#each breadcrumbs as { name, url }}
      <li>
        {#if url === page.url.pathname}
          <i>/</i>{getUrlPartName(name as keyof TranslatedParts)}
        {:else}
          <i>/</i><a href={url}>{getUrlPartName(name as keyof TranslatedParts)}</a>
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
    margin: 0;

    i {
      color: gray;
      margin: 0 0.25em;
    }
  }
</style>
