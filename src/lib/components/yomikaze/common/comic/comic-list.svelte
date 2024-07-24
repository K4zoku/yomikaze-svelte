<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import ComicCard from '$components/yomikaze/common/comic/comic-card.svelte';
  import Pagination from '$components/yomikaze/common/pagination.svelte';
  import type Comic from '$models/Comic';
  import { ComicStatus } from '$models/Comic';
  import type PagedResult from '$models/PagedResult';
  import type PaginationModel from '$models/Pagination';
  import { tick, type ComponentType } from 'svelte';
    import ComicCardDetails from './comic-card-details.svelte';

  export const initialData: PagedResult<Comic> | null = null;
  export let loadFn: (pagination: PaginationModel) => Promise<PagedResult<Comic>>;
  export let currentPage = 1;
  export let update: boolean = false;
  $: if (update) {
    task = loadFn({ page: currentPage }).then(middleware);
  }
  export let emptyMessage: string = 'No comics found';
  let totalPages = 0;
  let task: Promise<PagedResult<Comic>> = init().then(middleware);
  let comics: Comic[] = [];

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
    currentPage = paged.currentPage;
    return paged;
  }

  function handleOnPageChange(event: CustomEvent<number>) {
    currentPage = event.detail;
    task = loadFn({ page: currentPage }).then(middleware);
  }

  const layouts: { [key: string]: string } = {
    list: 'lucide--layout-list',
    col: 'lucide--columns-2',
    grid: 'lucide--layout-grid'
  };

  const containerClasses: { [key: string]: string } = {
    list: 'flex flex-col',
    col: 'grid grid-cols-1 md:grid-cols-2',
    grid: 'grid grid-cols-6 md:grid-cols-3'
  };

  let layout: string = 'list';

  let comicLayout: { [key: string]: { component: ComponentType, props: any } } = {
    list: {
      component: ComicCardDetails,
      props: {}
    },
    col: {
      component: ComicCardDetails,
      props: {}
    },
    grid: {
      component: ComicCard, 
      props: { size: 'full' }
    }
  };
</script>

<div class={$$props.class ? $$props.class : ''}>
  <div class="flex flex-row-reverse justify-between gap-2 my-4">
    <div class="join">
      {#each Object.keys(layouts) as key (key)}
        <button
          class="join-item btn-sm btn btn-outline"
          class:btn-active={layout == key}
          on:click={() => (layout = key)}
          data-layout={key}
        >
          <Icon icon={layouts[key]} class="text-xl" />
        </button>
      {/each}
    </div>
    <slot name="title"></slot>
  </div>
  {#await task}
    <div class="flex items-center justify-center h-full w-full">
      <span class="loading loading-lg"></span>
    </div>
  {:then paged}
    <div
      class="min-h-128 h-fit gap-4 flex-col"
      class:flex={paged.totals == 0 || layout === 'list'}
      class:grid={paged.totals > 0 && (layout === 'grid' || layout === 'col')}
      class:grid-cols-2={layout === 'col'}
      class:grid-cols-6={layout === 'grid'}
    >
      {#each paged.results as comic (comic.id)}
        <svelte:component this={comicLayout[layout].component} {...comicLayout[layout].props} comic={comic} />
      {:else}
        <div class="flex items-center justify-center h-full w-full bg-base-200 py-4">
          <span class="text-lg">
            {emptyMessage}
          </span>
        </div>
      {/each}
    </div>
  {/await}
  <div class="flex w-full items-center justify-center mt-4 py-2">
    <Pagination
      class="bg-base-200/50 rounded shadow-inner p-2"
      bind:currentPage
      bind:totalPages
      on:page={handleOnPageChange}
    />
  </div>
</div>
