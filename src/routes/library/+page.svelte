<script lang="ts">
  import { goto } from '$app/navigation';
  import ComicList from '$components/yomikaze/common/comic/comic-list.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type Comic from '$models/Comic';
  import type LibraryCategory from '$models/LibraryCategory';
  import { LibraryEntrySearchOrderBy } from '$models/LibraryEntrySearch';
  import type PagedResult from '$models/PagedResult';
  import type PaginationModel from '$models/Pagination';
  import { normalizeComic } from '$utils/comic-utils';
  import { appendQueryParams } from '$utils/common';
  import { LibraryManagement } from '$utils/library-utils';
  import type { PageData } from './$types';
  import CategoryManage from './category-manage.svelte';

  export let data: PageData;
  const pageName = 'Library';

  let categories: LibraryCategory[] = data.categories;
  let { tab, entries, search } = data;
  const { token } = data;
  const libraryManagement = new LibraryManagement(token);

  let emptyMessage: string;
  $: {
    emptyMessage = search.name
      ? 'No comics found with the search term'
      : 'This feels empty... Try adding some comics!';
  }
  let update = false;
  $: update = !!search.name || !!search.orderBy ? !update : update;

  async function loadComics(pagination: PaginationModel): Promise<PagedResult<Comic>> {
    search.page = pagination.page;
    search.size = pagination.size ?? 18;
    switch (tab) {
      case 'default':
        entries = await libraryManagement.getEntriesByCategory(undefined, search);
        break;
      case 'all':
        entries = await libraryManagement.getAllEntries(search);
        break;
      default: {
        const categoryId = categories.find((c) => c.name === tab)?.id;
        if (!categoryId) {
          goto('/library');
          throw new Error('Category not found');
        }
        entries = await libraryManagement.getEntriesByCategory(categoryId, search);
        break;
      }
    }
    const result: PagedResult<Comic> = {
      ...entries,
      results: entries.results.map((entry) => entry.comic).map(normalizeComic)
    };
    return result;
  }

  let searchInput: HTMLInputElement;
  function updateSearch() {
    search.name = searchInput.value === '' ? undefined : searchInput.value;

    const url = new URL(window.location.href);
    appendQueryParams(url, search);
    goto(url.toString());
  }
  function handleOnEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      updateSearch();
    }
  }
  function handleOnSearchClick() {
    updateSearch();
  }

  let openCategoryManagementModal: () => void;
</script>

<Sublayout {pageName}>
  <div class="flex gap-2 w-full">
    <div class="w-full grow overflow-x-scroll">
      <div class="tabs tabs-boxed gap-2 p-2 shadow-inner" data-sveltekit-reload>
        <a
          href="?tab=all"
          class="tab flex items-center justify-center gap-1 snap-start min-w-28"
          class:tab-active={tab === 'all'}
        >
          All
        </a>
        <a
          href="?tab=default"
          class="tab flex items-center justify-center gap-1 snap-start min-w-28"
          class:tab-active={tab === 'default'}
        >
          Default
        </a>
        {#key categories}
          {#each categories as category (category.id)}
            <a
              href="?tab={category.name}"
              class="tab snap-start min-w-28 text-ellipsis overflow-hidden line-clamp-1"
              class:tab-active={tab === category.name || tab === category.id}
            >
              {category.name}
            </a>
          {/each}
        {/key}
      </div>
    </div>
    <button class="shrink-0 btn" on:click={() => openCategoryManagementModal()}>
      <span class="iconify lucide--settings text-2xl"></span>
    </button>
  </div>

  <ComicList loadFn={loadComics} bind:update bind:emptyMessage>
    <div class="flex grow w-full justify-between gap-2" slot="title">
      <div class="text-xl font-semibold">
        {entries.totals
          ? `${entries.totals} ${entries.totals > 1 ? 'titles' : 'title'}`
          : 'No title'}
      </div>
      <div class="flex items-center justify-center gap-2">
        <div class="join">
          <label
            class="join-item input input-bordered input-sm flex items-center gap-2 pr-4 w-73 border"
          >
            <input
              type="text"
              class="grow-0"
              placeholder="Search"
              bind:this={searchInput}
              on:keypress={handleOnEnterPress}
            />
          </label>
          <button class="join-item btn btn-sm" on:click={handleOnSearchClick}>
            <span class="iconify lucide--search text-2xl"></span>
          </button>
        </div>
        <div class="join">
          <label for="order" class="join-item btn btn-sm no-animation text-sm">Sort by:</label>
          <select
            id="order"
            class="join-item select select-sm select-bordered"
            bind:value={search.orderBy}
          >
            <option value="">---</option>
            <option value={LibraryEntrySearchOrderBy.Name}>Name (A-Z)</option>
            <option value={LibraryEntrySearchOrderBy.NameDesc}>Name (Z-A)</option>
            <option value={LibraryEntrySearchOrderBy.CreationTime}>Date Added (Newest)</option>
            <option value={LibraryEntrySearchOrderBy.CreationTimeDesc}>Date Added (Oldest)</option>
          </select>
        </div>
      </div>
    </div>
  </ComicList>
</Sublayout>
<CategoryManage bind:open={openCategoryManagementModal} bind:categories {libraryManagement} />
<!-- DIALOG DELETE COMIC -->
<dialog class="modal">
  <div class="modal-box flex flex-col items-center text-center">
    <span class="iconify lucide--alert-circle text-4xl text-error"></span>
    <h3 class="text-lg font-bold">Are you sure you want to Delete Comic?</h3>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-outline btn-error">Delete</button>
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
