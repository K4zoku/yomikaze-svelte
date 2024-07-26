<script lang="ts">
  import { goto } from '$app/navigation';
  import Swap from '$components/daisyui/actions/swap.svelte';
  import Icon from '$components/icon.svelte';
  import ComicList from '$components/yomikaze/common/comic/comic-list.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type Comic from '$models/Comic';
  import type LibraryCategory from '$models/LibraryCategory';
  import { LibraryEntrySearchOrderBy } from '$models/LibraryEntrySearch';
  import type PagedResult from '$models/PagedResult';
  import type PaginationModel from '$models/Pagination';
  import { normalizeComic } from '$utils/comic-utils';
  import { appendQueryParams, debounce } from '$utils/common';
  import { LibraryManagement } from '$utils/library-utils';
  import { tick } from 'svelte';
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
  let reload: () => void;

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

  function updateSearch() {
    search.name = search.name || null;
    const url = new URL(location.href);
    appendQueryParams(url.searchParams, search, true);
    goto(url.toString());
    tick().then(reload);
  }

  let [debouncedSearch, destroyDebounce] = debounce<void>(updateSearch, 500);

  function handleOnSearchClick() {
    updateSearch();
  }

  async function handleOnClickTab(event: MouseEvent) {
    if (event.target instanceof HTMLAnchorElement) {
      const target = event.target as HTMLAnchorElement;
      tab = target.dataset.tab ?? 'all';
      search.page = 1;
      search.name = null;
      search.orderBy = null;
      const url = new URL(location.href);
      appendQueryParams(url.searchParams, search, true);
      goto(url.toString());
      await tick();
      reload();
    }
  }

  let sortType: boolean = false;
  let sortOrder: boolean = false;

  const sortMapping = [
    LibraryEntrySearchOrderBy.Name,
    LibraryEntrySearchOrderBy.NameDesc,
    LibraryEntrySearchOrderBy.CreationTime,
    LibraryEntrySearchOrderBy.CreationTimeDesc
  ]

  function updateSort() {
    const sort = sortMapping[+sortType << 1 | +sortOrder];
    search.orderBy = sort;
    updateSearch();
  }

  let openCategoryManagementModal: () => void;
</script>

<Sublayout {pageName}>
  <div class="flex gap-2 w-full">
    <div class="w-full grow overflow-x-scroll">
      <div class="tabs tabs-boxed gap-2 p-2 shadow-inner">
        <a
          href="?tab=all"
          data-tab="all"
          class="tab flex items-center justify-center gap-1 snap-start min-w-28"
          class:tab-active={tab === 'all'}
          on:click={handleOnClickTab}
        >
          All
        </a>
        <a
          href="?tab=default"
          data-tab="default"
          class="tab flex items-center justify-center gap-1 snap-start min-w-28"
          class:tab-active={tab === 'default'}
          on:click={handleOnClickTab}
        >
          Default
        </a>
        {#key categories}
          {#each categories as category (category.id)}
            <a
              href="?tab={category.name}"
              data-tab={category.name}
              class="tab snap-start min-w-28 text-ellipsis overflow-hidden line-clamp-1"
              title={category.name}
              class:tab-active={tab === category.name || tab === category.id}
              on:click={handleOnClickTab}
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

  <ComicList loadFn={loadComics} bind:reload={reload} bind:emptyMessage>
    <div slot="loading"></div>
    <div class="flex grow w-full justify-between gap-2" slot="header">
      <div class="flex gap-2">
        <div class="text-xl font-semibold">
          {entries.totals
            ? `${entries.totals} ${entries.totals > 1 ? 'comics' : 'comic'}`
            : 'No comics here...'}
        </div>
        <div class="flex items-center gap-1">
          <Swap bind:active={sortType} on:change={() => updateSort()}>
            <span slot="off">
              <span class="text-accent">Name</span> | <span class="text-neutral">Date Added</span>
            </span>
            <span slot="on">
              <span class="text-neutral">Name</span> | <span class="text-accent">Date Added</span>
          </Swap>
          <Swap rotate={true} itemsClass="flex items-center" bind:active={sortOrder} on:change={() => updateSort()}>
            <Icon icon="lucide--sort-asc" class="text-xl" slot="off"/>
            <Icon icon="lucide--sort-desc" class="text-xl" slot="on"/>
          </Swap>
        </div>
      </div>
      <div class="flex items-center justify-center gap-2">
        <form on:submit|preventDefault={handleOnSearchClick}>
          <label
            class="join-item z-10 input input-bordered focus:input-accent input-sm flex items-center gap-2 pr-4 w-73"
          >
            <input
              type="text"
              class="grow-0"
              placeholder="Search"
              bind:value={search.name}
            />
            <span class="iconify lucide--search text-lg"></span>
          </label>
          <button class="hidden" type="submit">
          </button>
        </form>
      </div>
    </div>
  </ComicList>
</Sublayout>
<CategoryManage bind:open={openCategoryManagementModal} bind:categories {libraryManagement} />