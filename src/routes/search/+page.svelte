<script lang="ts">
  import { goto } from '$app/navigation';
  import TriSwap from '$components/daisyui/actions/tri-swap.svelte';
  import Icon from '$components/icon.svelte';
  import ComicList from '$components/yomikaze/common/comic/comic-list.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type Pagination from '$models/Pagination.js';
    import type Tag from '$models/Tag.js';
  import { getComics, type GetComicsOptions } from '$utils/comic-utils';
  import { appendQueryParams, debounce } from '$utils/common';
    import type { CategorizedTags, TagCategoryExtended } from '$utils/tag-utils.js';
  import { onDestroy, onMount, tick } from 'svelte';
  import { expoInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  export let data;
  let { categories, tagMap } = data;

  let filtersOpen: boolean = true;
  let excludeTags: string[] = [];
  let includeTags: string[] = [];
  let orderBy: string = 'Name';
  let currentPage: number = 1;

  const DEFAULT_SEARCH: GetComicsOptions = {
    size: 12,
    orderBy: ['Name'],
    includeTags: [],
    excludeTags: [],
    inclusionMode: 'or',
    exclusionMode: 'and'
  };

  let search: GetComicsOptions = { ...DEFAULT_SEARCH };

  function loadSearchFromQuery() {
    let params = new URLSearchParams(location.search);
    search = {
      ...DEFAULT_SEARCH
    };
    for (let [key, value] of params) {
      if (key === 'includeTags') {
        if (search.includeTags) search.includeTags.push(value);
        else search.includeTags = [value];
      } else if (key === 'excludeTags') {
        if (search.excludeTags) search.excludeTags.push(value);
        else search.excludeTags = [value];
      } else {
        // @ts-ignore
        search[key] = value;
      }
    }
    includeTags = search.includeTags ?? [];
    excludeTags = search.excludeTags ?? [];
    for (let category of Object.values(categories)) {
      for (let tag of category.tags) {
        if (includeTags.includes(tag.id)) {
          tag.searchState = 1;
        } else if (excludeTags.includes(tag.id)) {
          tag.searchState = 2;
        } else {
          tag.searchState = 0;
        }
      }
    }
    orderBy = search.orderBy?.[0] ?? 'Name';
  }

  onMount(() => loadSearchFromQuery());

  function updateSearchParams() {
    let params = new URLSearchParams();
    appendQueryParams(params, search);
    goto(`/search/?${params.toString()}`, { replaceState: true });
  }

  async function loadComics(pagination: Pagination) {
    search.page = pagination.page;
    let result = await getComics({ ...search });
    return result;
  }

  let reloadSearchResults: () => void;

  function onSearch() {
    search.includeTags = includeTags;
    search.excludeTags = excludeTags;
    search.orderBy = [orderBy];
    search.page = currentPage = 1;
    updateSearchParams();
    reloadSearchResults();
  }

  async function onReset() {
    search = { ...DEFAULT_SEARCH };
    orderBy = 'Name';
    resetTagFilter();
    await tick();
  }

  function resetTagFilter() {
    includeTags = [];
    excludeTags = [];
    for (const key of Object.keys(categories)) {
      const category = categories[key];
      for (const tag of category.tags) {
        tag.searchState = 0;
      }
    }
    tagSearch = '';
    categories = categories; // Force update
  }

  function isDefault(): boolean {
    for (let key of Object.keys(DEFAULT_SEARCH)) {
      // @ts-ignore
      if (search[key] !== DEFAULT_SEARCH[key]) {
        return false;
      }
    }
    return true;
  }

  function initIncludeTag(_: HTMLInputElement, tagId: string) {
    includeTags.push(tagId);
    includeTags = [...new Set(includeTags)];
    return {
      destroy() {
        includeTags = includeTags.filter((id) => id !== tagId);
      }
    };
  }

  function initExcludeTag(_: HTMLInputElement, tagId: string) {
    excludeTags.push(tagId);
    return {
      destroy() {
        excludeTags = excludeTags.filter((id) => id !== tagId);
      }
    };
  }

  function getTagFiltersSummary(): string {
    let includeTagsSummary = '';
    let excludeTagsSummary = '';

    if (includeTags.length > 0) {
      includeTagsSummary =
        'Include ' +
        includeTags
          .slice(0, 2)
          .map((tagId) => tagMap.get(tagId)?.name ?? 'Unknown')
          .join(', ');
      if (includeTags.length > 2) {
        includeTagsSummary += ` +${includeTags.length - 2} more`;
      }
    } else if (excludeTags.length === 0) {
      includeTagsSummary = 'Include any';
    }

    if (excludeTags.length > 0) {
      excludeTagsSummary =
        'Exclude ' +
        excludeTags
          .slice(0, 2)
          .map((tagId) => tagMap.get(tagId)?.name ?? 'Unknown')
          .join(', ');
      if (excludeTags.length > 2) {
        excludeTagsSummary += ` +${excludeTags.length - 2} more`;
      }
    }

    return `${includeTagsSummary}${includeTagsSummary && excludeTagsSummary ? ' & ' : ''}${excludeTagsSummary}`;
  }

  let tagFiltersSummary: string = getTagFiltersSummary();

  $: includeTags.length, (tagFiltersSummary = getTagFiltersSummary());
  $: excludeTags.length, (tagFiltersSummary = getTagFiltersSummary());
  let tagFiltersOpen: boolean = false;

  let tagSearch: string = '';
  function getFilteredTagCategories(): CategorizedTags {
    let result: CategorizedTags = {};
    if (!tagSearch) return categories;
    for (let categoryId of Object.keys(categories)) {
      let category = categories[categoryId];
      let resultCategory: TagCategoryExtended = {...category, tags: [] as Tag[] };
      for (let tag of category.tags) {
        if (tag.name.toLowerCase().includes(tagSearch.toLowerCase())) {
          resultCategory.tags.push({...tag});
        }
      }
      if (resultCategory.tags.length > 0) {
        result[categoryId] = resultCategory;
      }
    }
    return result;
  }
  let categorizedTags: CategorizedTags = getFilteredTagCategories();

  const [debounceTagSearch, destroyTagSearch] = debounce(() => categorizedTags = getFilteredTagCategories(), 300);
  onDestroy(() => destroyTagSearch());
</script>

<Sublayout pageName="Advanced Search">
  <form
    class="hidden"
    on:submit|preventDefault={onSearch}
    on:reset|preventDefault={onReset}
    id="search-form"
  />
  <div class="flex items-center gap-2">
    <label
      class="input input-bordered focus-within:input-accent w-full grow flex items-center gap-2"
    >
      <Icon icon="lucide--search" class="text-xl" />
      <!-- svelte-ignore a11y-autofocus -->
      <input
        type="text"
        placeholder="Search"
        class="grow"
        form="search-form"
        autofocus={true}
        bind:value={search.name}
      />
    </label>
    <label
      class="btn flex items-center justify-start gap-2 shrink-0 w-40"
      class:btn-accent={filtersOpen}
    >
      <Icon icon="lucide--filter" class="text-xl" />
      <span>{filtersOpen ? 'Hide' : 'Show'} Filters</span>
      <input type="checkbox" bind:checked={filtersOpen} class="hidden" />
    </label>
  </div>
  {#if filtersOpen}
    <div
      class="w-full mt-2 bg-base-200 rounded p-6"
      in:slide={{ duration: 150, easing: expoInOut }}
      out:slide={{ duration: 150, easing: expoInOut }}
    >
      <div class="grid grid-cols-5 gap-8">
        <div class="flex flex-col gap-1 items-start">
          <label for="order" class="font-medium">Sort By</label>
          <select
            id="order"
            class="select select-bordered active:select-accent w-full"
            bind:value={orderBy}
            form="search-form"
          >
            <option selected value="Name">Name (A-Z)</option>
            <option value="NameDesc">Name (Z-A)</option>
            <option value="TotalViewsDesc">Most Popular</option>
            <option value="TotalViews">Unpopular</option>
            <option value="TotalFollowsDesc">Most Follows</option>
            <option value="TotalFollows">Least Follows</option>
            <option value="AverageRatingDesc">Highest Rating</option>
            <option value="AverageRating">Lowest Rating</option>
            <option value="TotalCommentsDesc">Most Comments</option>
            <option value="TotalComments">Least Comments</option>
            <option value="CreationTimeDesc">Latest</option>
            <option value="CreationTime">Oldest</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 items-start">
          <span class="font-medium">Filter Tags</span>
          <details class="dropdown w-full" bind:open={tagFiltersOpen}>
            <summary
              id="tags"
              class="flex input input-bordered focus:input-accent bg-base-100 font-normal justify-start tooltip select-none"
              class:input-accent={tagFiltersOpen}
              data-tip={tagFiltersSummary}
            >
              <div class="w-full h-full flex justify-start items-center">
                <span class="text-nowrap overflow-hidden text-ellipsis max-w-full select-none">
                  {tagFiltersSummary}
                </span>
              </div>
            </summary>
            <div
              class="dropdown-content z-50 bg-base-100 p-4 rounded shadow-lg mt-2 w-192 max-h-96 overflow-y-scroll overflow-x-hidden select-none"
            >
              <div class="flex items-center gap-2 w-full py-2">
                <label class="input input-bordered input-sm focus-within:input-accent flex items-center gap-1 grow">
                  <Icon icon="lucide--tag" class="text-xl shrink-0" />
                  <input class="grow" placeholder="Search tag" bind:value={tagSearch} on:input={debounceTagSearch}/>
                </label>
                <button class="btn btn-sm active:btn-accent shrink-0" on:click={resetTagFilter}>
                  Reset tag filter
                </button> 
              </div>
              <div class="flex flex-col gap-4">
                {#each Object.keys(categorizedTags).sort() as categoryId (categoryId)}
                  <div class="flex flex-col gap-1 w-full">
                    <div class="flex gap-2 items-center">
                      <h3 id="tc-{categoryId}" class="text-xl font-bold">
                        {categorizedTags[categoryId].name}
                      </h3>
                      <hr class="border-1 my-4 flex-grow" />
                    </div>
                    <div class="flex gap-1 flex-wrap">
                      {#each categorizedTags[categoryId].tags as tag (tag.id)}
                        <TriSwap bind:state={tag.searchState}>
                          <span slot="one" class="badge badge-outline badge-neutral">
                            {tag.name}
                          </span>
                          <span slot="two" class="badge badge-outline badge-success">
                            {tag.name}
                          </span>
                          <span slot="three" class="badge badge-outline badge-error">
                            {tag.name}
                          </span>
                          {#if tag.searchState === 1}
                            <input
                              type="checkbox"
                              class="hidden"
                              name="includeTags"
                              form="search-form"
                              value={tag.id}
                              use:initIncludeTag={tag.id}
                              bind:group={includeTags}
                            />
                          {/if}
                          {#if tag.searchState === 2}
                            <input
                              type="checkbox"
                              class="hidden"
                              name="excludeTags"
                              form="search-form"
                              value={tag.id}
                              use:initExcludeTag={tag.id}
                              bind:group={excludeTags}
                            />
                          {/if}
                        </TriSwap>
                      {/each}
                    </div>
                  </div>
                {:else}
                  <span class="italic py-2"> 
                    No tag matches the search criteria.
                  </span>
                {/each}
                <div class="flex flex-col gap-1">
                  <div class="flex gap-2 items-center">
                    <h3 class="text-xl font-bold">Other options</h3>
                    <hr class="border-1 my-4 flex-grow" />
                  </div>
                  <div class="grid grid-cols-4 gap-4">
                    <div class="flex flex-col gap-1 items-start">
                      <label for="inclusion-mode">Inclusion Mode</label>
                      <select
                        id="inclusion-mode"
                        class="select select-sm select-bordered active:select-accent w-full"
                        bind:value={search.inclusionMode}
                      >
                        <option value="or" selected>Include any</option>
                        <option value="and">Include all</option>
                      </select>
                    </div>
                    <div class="flex flex-col gap-1 items-start">
                      <label for="exclusion-mode">Exclusion Mode</label>
                      <select
                        id="exclusion-mode"
                        class="select select-sm select-bordered active:select-accent w-full"
                        bind:value={search.exclusionMode}
                      >
                        <option value="and" selected>Exclude all</option>
                        <option value="or">Exclude any</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
        <div class="flex flex-col gap-1 items-start">
          <label for="publisher" class="font-medium">Publisher</label>
          <input
            type="text"
            id="publisher"
            class="input input-bordered focus:input-accent w-full"
            placeholder="Any"
            form="search-form"
            bind:value={search.publisher}
          />
        </div>
        <div class="flex flex-col gap-1 items-start">
          <label for="author" class="font-medium">Author</label>
          <input
            type="text"
            id="author"
            class="input input-bordered focus:input-accent w-full"
            placeholder="Any"
            form="search-form"
            bind:value={search.authors}
          />
        </div>
        <div class="flex flex-col gap-1 items-start">
          <label for="status" class="font-medium">Status</label>
          <select
            id="status"
            class="select select-bordered focus:select-accent w-full"
            bind:value={search.status}
            form="search-form"
          >
            <option value={undefined}>Any</option>
            <option value="Completed">Completed</option>
            <option value="OnGoing">Ongoing</option>
            <option value="Hiatus">Hiatus</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  {/if}
  <div class="w-full mt-2 flex justify-end items-center gap-2">
    <button type="reset" form="search-form" class="btn">Reset filters</button>
    <a href="/comics/random" data-sveltekit-reload class="btn">I'm feeling lucky</a>
    <button type="submit" form="search-form" class="btn btn-accent flex items-center gap-2">
      <Icon icon="lucide--search" class="text-xl" />
      Search
    </button>
  </div>
  <div class="w-full mt-4">
    <ComicList loadFn={loadComics} bind:reload={reloadSearchResults} bind:currentPage={currentPage} />
  </div>
</Sublayout>
