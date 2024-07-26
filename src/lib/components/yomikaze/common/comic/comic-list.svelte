<script lang="ts">
  import Icon from '$components/icon.svelte';
  import ComicCard from '$components/yomikaze/common/comic/comic-card.svelte';
  import Pagination from '$components/yomikaze/common/pagination.svelte';
  import type Comic from '$models/Comic';
  import type PagedResult from '$models/PagedResult';
  import type PaginationModel from '$models/Pagination';
  import { tick, type ComponentType } from 'svelte';
  import ComicCardDetails from './comic-card-details.svelte';

  export let initialData: PagedResult<Comic> | null = null;
  export let loadFn: (pagination: PaginationModel) => Promise<PagedResult<Comic>>;
  export let currentPage = 1;

  export const reload = () => {
    task = loadFn({ page: currentPage }).then(middleware);
  };

  export let emptyMessage: string = 'No comics found';
  let totalPages = 0;
  let task: Promise<PagedResult<Comic>> = init().then(middleware);
  let comics: Comic[] = [];
  let totals = 0;

  async function init() {
    if (!initialData) {
      return await loadFn({ page: currentPage }).then(middleware);
    }
    return initialData;
  }

  async function middleware(paged: PagedResult<Comic>): Promise<PagedResult<Comic>> {
    await tick();
    comics = paged.results;
    totalPages = paged.totalPages;
    totals = paged.totals;
    currentPage = paged.currentPage;
    return paged;
  }

  function handleOnPageChange(event: CustomEvent<number>) {
    currentPage = event.detail;
    task = loadFn({ page: currentPage }).then(middleware);
  }

  interface Layout {
    component: ComponentType;
    props: any;
    icon: string;
  }

  let layouts: { [key: string]: Layout } = {
    list: {
      component: ComicCardDetails,
      props: {},
      icon: 'lucide--layout-list'
    },
    col: {
      component: ComicCardDetails,
      props: {},
      icon: 'lucide--columns-2'
    },
    grid: {
      component: ComicCard,
      props: { size: 'full' },
      icon: 'lucide--layout-grid'
    }
  };

  let currentLayout: string = 'list';
</script>

<div class={$$props.class ? $$props.class : ''}>
  <slot name="header">
    <div class="flex w-full py-1">
      <div class="text-xl font-semibold">
        {totals
          ? `${totals} ${totals > 1 ? 'comics' : 'comic'}`
          : 'No comics here...'}
      </div>
    </div>
  </slot>
  <div class="flex flex-row-reverse justify-between gap-2 py-1 mb-2">
    <div class="join">
      {#each Object.keys(layouts) as key (key)}
        <button
          class="join-item btn-sm btn btn-outline"
          class:btn-active={currentLayout == key}
          on:click={() => (currentLayout = key)}
          data-layout={key}
        >
          <Icon icon={layouts[key].icon} class="text-xl" />
        </button>
      {/each}
    </div>
    <slot name="controls" {currentLayout}></slot>
  </div>
  <div
    class="gap-4 flex-col"
    class:flex={comics.length == 0 || currentLayout === 'list'}
    class:grid={comics.length > 0 && (currentLayout === 'grid' || currentLayout === 'col')}
    class:grid-cols-2={currentLayout === 'col'}
    class:grid-cols-6={currentLayout === 'grid'}
  >
    {#await task}
      <slot name="loading" {currentLayout}>
        <div class="flex items-center justify-center my-20 w-full">
          <span class="loading loading-lg"></span>
        </div>
      </slot>
    {:then paged}
      {#each paged.results as comic (comic.id)}
        <svelte:component
          this={layouts[currentLayout].component}
          {...layouts[currentLayout].props}
          {comic}
        />
      {:else}
        <slot name="empty">
          <div class="flex items-center justify-center h-full w-full bg-base-200 py-4 rounded">
            <span class="text-lg">
              {emptyMessage}
            </span>
          </div>
        </slot>
      {/each}
    {:catch error}
      <slot name="error" {error}>
        <div class="flex items-center justify-center h-full w-full bg-error py-4">
          <span class="text-lg">
            {error.message}
          </span>
        </div>
      </slot>
    {/await}
  </div>
  <slot name="pagination" {currentPage} {totalPages}>
    {#if totalPages > 1}
      <div class="flex w-full items-center justify-center mt-4 py-2">
        <Pagination
          class="bg-base-200/50 rounded shadow-inner p-2"
          bind:currentPage
          bind:totalPages
          on:page={handleOnPageChange}
        />
      </div>
    {/if}
  </slot>
</div>
