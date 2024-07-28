<script lang="ts">
  import Icon from '$components/icon.svelte';
  import { createEventDispatcher } from 'svelte';
  import PaginationDots from './pagination-dots.svelte';

  const dispatch = createEventDispatcher();

  export let currentPage: number;
  export let totalPages: number;
  export let captureKeybindings: boolean = false;
  export let keys: { prev: string; next: string } = { prev: 'PageUp', next: 'PageDown' };

  let leftDots: boolean;
  let rightDots: boolean;
  let mid: number[];

  $: leftDots = currentPage > 4 && totalPages > 5;
  $: rightDots = currentPage < totalPages - 3 && totalPages > 5;
  $: mid =
    totalPages === 5
      ? [2, 3, 4]
      : [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2].filter(
          (page) => 1 < page && page < totalPages
        );

  function gotoPage(page: number) {
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    currentPage = page;
    dispatch('page', page);
  }

  function gotoPrev() {
    if (currentPage > 1) currentPage--;
    dispatch('page', currentPage);
  }

  function gotoNext() {
    if (currentPage < totalPages) currentPage++;
    dispatch('page', currentPage);
  }

  function handleOnDotsPage(event: CustomEvent<number>) {
    currentPage = event.detail;
    dispatch('page', currentPage);
  }

  function handleKeybindings(event: KeyboardEvent) {
    if (!captureKeybindings) return;
    if (event.key === keys.prev) {
      event.preventDefault();
      gotoPrev();
    }
    if (event.key === keys.next) {
      event.preventDefault();
      gotoNext();
    } 
  }
</script>

<svelte:window on:keydown={handleKeybindings} />

{#if totalPages > 0}
  <div class="flex gap-2 {$$props.class ? $$props.class : ''}">
    <button
      class="btn btn-sm btn-circle btn-ghost"
      class:btn-disabled={currentPage === 1}
      on:click={gotoPrev}
    >
      <Icon icon="lucide--chevron-left" class="text-lg" />
    </button>
    <button
      class="btn btn-sm {currentPage === 1 ? 'btn-accent' : 'btn-ghost'}"
      on:click={() => gotoPage(1)}
    >
      1
    </button>
    {#if leftDots}
      <PaginationDots max={totalPages} on:page={handleOnDotsPage} />
    {/if}
    {#each mid as page, i (i)}
      <button
        class="btn btn-sm {currentPage === page ? 'btn-accent' : 'btn-ghost'}"
        on:click={() => gotoPage(page)}
      >
        {page}
      </button>
    {/each}
    {#if rightDots}
      <PaginationDots max={totalPages} on:page={handleOnDotsPage} />
    {/if}
    {#if totalPages > 1}
      <button
        class="btn btn-sm {currentPage === totalPages ? 'btn-accent' : 'btn-ghost'}"
        on:click={() => gotoPage(totalPages)}
      >
        {totalPages}
      </button>
    {/if}
    <button
      class="btn btn-sm btn-circle btn-ghost"
      class:btn-disabled={currentPage === totalPages}
      on:click={gotoNext}
    >
      <Icon icon="lucide--chevron-right" class="text-lg" />
    </button>
  </div>
{/if}
