<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import ComicCard from '$components/yomikaze/common/comic/comic-card.svelte';
  import Pagination from '$components/yomikaze/common/pagination.svelte';
  import type Comic from '$models/Comic';
  import { ComicStatus } from '$models/Comic';
  import type PagedResult from '$models/PagedResult';
  import type PaginationModel from '$models/Pagination';
  import { tick } from 'svelte';

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

  const statusIcon: { [key: string]: string } = {
    [ComicStatus.OnGoing]: 'fluent--presence-busy-16-filled',
    [ComicStatus.Completed]: 'fluent--presence-available-16-filled',
    [ComicStatus.Cancelled]: 'fluent--presence-dnd-16-filled',
    [ComicStatus.Hiatus]: 'fluent--presence-away-16-filled'
  };
  const statusIconColor: { [key: string]: string } = {
    [ComicStatus.OnGoing]: 'text-success',
    [ComicStatus.Completed]: 'text-success',
    [ComicStatus.Cancelled]: 'text-error',
    [ComicStatus.Hiatus]: 'text-warning'
  };

  const layouts: { [key: string]: string } = {
    list: 'lucide--layout-list',
    col: 'lucide--columns-2',
    grid: 'lucide--layout-grid'
  };

  let layout: string = 'list';
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
      class="min-h-128 h-fit gap-2 flex-col"
      class:flex={paged.totals == 0 || layout === 'list'}
      class:grid={paged.totals > 0 && (layout === 'grid' || layout === 'col')}
      class:grid-cols-2={layout === 'col'}
      class:grid-cols-8={layout === 'grid'}
    >
      {#each paged.results as comic (comic.id)}
        {#if layout === 'list' || layout === 'col'}
          <a
            href="/comics/{comic.id}"
            class="flex items-center gap-4 rounded-lg shadow-md p-3 h-56"
          >
            <Picture
              src={comic.cover}
              class="h-full aspect-cover rounded-md shadow-md hover:shadow-lg hover:scale-105 transition duration-300 shrink-0"
              imgClass="rounded-md shadow w-full h-full object-cover object-center"
            />
            <div class="grow flex flex-col gap-2 h-full">
              <div class="flex justify-between shrink-0">
                <div class="flex flex-col items-start justify-between">
                  <h4 class="text-xl font-bold mb-0 grow w-full line-clamp-2 text-ellipsis">
                    {comic.name}
                  </h4>
                  <span class="text-sm mb-0 shrink-0">{comic.authors.join(', ')}</span>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <div
                    class="flex items-center justify-center gap-1 bg-base-300 px-2 py-1 select-none"
                  >
                    <Icon
                      icon={statusIcon[comic.status]}
                      class="text-sm {statusIconColor[comic.status]}"
                    />
                    <span class="text-xs">{comic.status}</span>
                  </div>
                  <slot name="actions" />
                </div>
              </div>
              <hr class="border-1 m-0" />
              <div class="flex justify-between">
                <div class="flex gap-2 mt-4 mb-3">
                  {#each comic.tags as tag (tag.id)}
                    <a class="badge badge-outline" href="/search?includes={tag.id}">{tag.name}</a>
                  {/each}
                </div>
              </div>
              <div class="text-sm overflow-y-scroll h-full grow">
                <span class="text-base">{comic.description} </span>
              </div>
            </div>
          </a>
        {:else if layout === 'grid'}
          <ComicCard {comic} />
        {/if}
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
