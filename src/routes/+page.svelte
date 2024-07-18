<script lang="ts">
  import Carousel from 'svelte-carousel';
  import { browser } from '$app/environment';
  import type Comic from '$models/Comic';
  import { getPopularComics } from '$utils/comic-utils';
  import CarouselItem from '$components/carousel-item.svelte';

  let goToPrev:() => void;
  let goToNext:() => void;
  let currentPageIndex: number = 0;
</script>

{#if browser}
  {#await getPopularComics() then popComics}
    <Carousel swiping={false} autoplay autoplayDuration={3000} pauseOnFocus dots={false} bind:goToPrev bind:goToNext on:pageChange={event => currentPageIndex = event.detail}>
      {#each popComics as comic (comic.id)}
        <CarouselItem {comic}></CarouselItem>
      {/each}
      <div slot="prev">
      </div>
      <div slot="next" class="absolute bottom-0 right-0 z-10 flex gap-8 items-center justify-center mb-[4%] mr-[10%]">
        <span class="shrink-0 font-bold text-lg">No.{currentPageIndex + 1}</span>
        <div class="flex gap-2">
          <button class="btn btn-circle btn-sm btn-ghost" on:click={() => goToPrev()}>
            <span class="iconify lucide--chevron-left font-extrabold text-2xl"></span>
          </button>
          <button class="btn btn-circle btn-sm btn-ghost" on:click={() => goToNext()}>
            <span class="iconify lucide--chevron-right font-extrabold text-2xl"></span>
          </button>
        </div>
      </div>
    </Carousel>
  {/await}
{/if}
