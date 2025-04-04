<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import type { PageableResponse } from '$lib/models/api';
  import type { MetadataCollection } from '$lib/models/metadata';
  import IconButton from '@smui/icon-button';

  type PaginationProps = {
    pagingInfo: PageableResponse<MetadataCollection>;
  };

  let { pagingInfo }: PaginationProps = $props();

  const currentUrl = $derived(page.url);
  const maxPage = $derived(pagingInfo.totalPages - 1);
  const currentPage = $derived(Number(currentUrl.searchParams.get('page') || 1));
  const hasPrevious = $derived(currentPage > 1);
  const hasNext = $derived(maxPage > currentPage);
  const pageSize = $derived(currentUrl.searchParams.get('size')?.toString() || '20');

  const updatePage = (page: number) => {
    const newUrl = new URL(currentUrl);
    if (page < 0) page = 0;
    if (page >= maxPage) page = maxPage;
    newUrl.searchParams.set('page', page.toString());
    if (!currentUrl.searchParams.get('size')) {
      newUrl.searchParams.set('size', '20');
    }
    goto(newUrl, {
      keepFocus: true,
    });
  };

  const updatePageSize = (size: number) => {
    const newUrl = new URL(currentUrl);
    newUrl.searchParams.set('size', size.toString());
    newUrl.searchParams.set('page', '1');
    goto(newUrl);
  };

  const onPageInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    updatePage(Number(target.value));
  };
</script>

<div class="pagination">
  <IconButton
    disabled={!hasPrevious}
    class="material-icons"
    onclick={() => updatePage(currentPage - 1)}
    size="button"
  >
    chevron_left
  </IconButton>
  <span>
    <label for="page-input">Seite</label>
    <input
      id="page-input"
      class="page-input"
      type="number"
      min="1"
      max={maxPage}
      value={currentPage}
      onchange={onPageInputChange}
    />/{maxPage}
  </span>
  <IconButton
    disabled={!hasNext}
    class="material-icons"
    onclick={() => updatePage(currentPage + 1)}
    size="button"
  >
    chevron_right
  </IconButton>
  <div class="size">
    <label for="page-size">Datensätze pro Seite</label>
    <select
      id="page-size"
      class="page-size"
      value={pageSize}
      onchange={(e) => updatePageSize(Number((e.target as HTMLSelectElement).value))}
    >
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>
</div>

<style lang="scss">
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;

    input.page-input {
      width: 1.5em;
      font-size: 1.25em;
      text-align: right;
      appearance: textfield;
      -moz-appearance: textfield;
      border: none;
      font-family: 'Roboto', sans-serif;
    }

    input.page-input::-webkit-outer-spin-button,
    input.page-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    select {
      font-size: 1.1em;
    }
  }
</style>
