<script lang="ts">
  import Carousel from 'svelte-carousel';
  import { browser } from '$app/environment';
  import type Comic from '$models/Comic';
  import { getPopularComics } from '$utils/comic-utils';
  import CarouselItem from '$components/carousel-item.svelte';

  let goToPrev: () => void;
  let goToNext: () => void;
  let currentPageIndex: number = 0;
</script>

{#if browser}
  {#await getPopularComics()}
    <div class="w-full aspect-[20/6] min-h-80 select-none relative z-0">
      <div class="w-full aspect-[20/6] bg-base-300"></div>
      <div
        class="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100 backdrop-blur"
      >
        <div class="h-[70%] max-w-screen-xl w-full mx-auto mt-16 lg:mt-[6%]">
          <div class="flex gap-6 h-[70%] py-2 px-4">
            <div class="h-full aspect-[7/10] shrink-0">
              <div class="h-full aspect-[7/10] skeleton"></div>
            </div>
            <div class="flex flex-col gap-4 max-h-full w-full">
              <div class="h-8 w-2/3 skeleton "></div>
              <div class="flex gap-2 py-2 max-w-screen-lg overflow-x-hidden shrink-0">
                {#each {length: 4} as _, i}
                  <span class="flex-shrink-0 h-4 w-16 skeleton"></span>
                {/each}
              </div>
              <div class="max-w-full w-full max-h-48 overflow-y-scroll grow hidden md:flex md:flex-col gap-2">
                <div class="w-full h-4 skeleton"></div>
                <div class="w-full h-4 skeleton"></div>
                <div class="w-1/2 h-4 skeleton"></div>
              </div>
              <div class="w-full italic max-w-screen-lg overflow-hidden shrink-0">
                <div class="h-4 w-24 skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:then popComics}
    <Carousel
      swiping={false}
      autoplay
      autoplayDuration={3000}
      pauseOnFocus
      dots={false}
      bind:goToPrev
      bind:goToNext
      let:currentPageIndex={index}
      on:pageChange={(event) => (currentPageIndex = event.detail)}
    >
      {#each popComics as comic (comic.id)}
        <CarouselItem {index} {comic}></CarouselItem>
      {/each}
      <div slot="prev"></div>
      <div
        slot="next"
        class="absolute bottom-0 right-0 z-10 flex gap-8 items-center justify-center mb-[4%] mr-[10%]"
      >
        <span class="shrink-0 font-bold text-lg" class:text-accent={!currentPageIndex}>No.{currentPageIndex + 1}</span>
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

<div class="container mt-4">
</div>