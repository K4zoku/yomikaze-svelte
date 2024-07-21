<script lang="ts">
  import Carousel from 'svelte-carousel';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import CarouselItem from '$components/carousel-item.svelte';

  interface CarouselData {
    goToPrev: () => void;
    goToNext: () => void;
    currentPageIndex: number;
  }
  let carousel: CarouselData = {
    goToNext: () => {},
    goToPrev: () => {},
    currentPageIndex: 0
  };
  export let data: PageData;
  let { popular } = data;
</script>
{#if browser}
  {#await popular}
    <div class="w-full h-96 min-h-96 max-h-96 select-none relative z-0">
      <div class="w-full h-full bg-base-300"></div>
      <div
        class="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100 backdrop-blur"
      >
        <div class="h-5/6 w-full max-w-screen-xl mx-auto mt-16 lg:mt-16">
          <div class="flex gap-6 h-5/6 py-2 px-4">
            <div class="h-full aspect-[7/10] shrink-0">
              <div class="h-full aspect-[7/10] skeleton"></div>
            </div>
            <div class="flex flex-col grow gap-4 max-h-full w-full">
              <div class="h-8 w-2/3 skeleton"></div>
              <div class="flex gap-2 py-2 max-w-screen-lg overflow-x-hidden shrink-0">
                {#each { length: 4 } as _, i}
                  <span class="flex-shrink-0 h-4 w-16 skeleton"></span>
                {/each}
              </div>
              <div
                class="max-w-full w-full max-h-48 overflow-y-scroll grow hidden md:flex md:flex-col gap-2"
              >
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
      swiping={true}
      autoplay
      autoplayDuration={5000}
      pauseOnFocus
      dots={false}
      bind:goToPrev={carousel.goToPrev}
      bind:goToNext={carousel.goToNext}
      on:pageChange={(event) => (carousel.currentPageIndex = event.detail)}
    >
      {#each popComics as comic (comic.id)}
        <CarouselItem {comic}></CarouselItem>
      {/each}
      <div slot="prev"></div>
      <div
        slot="next"
        class="absolute bottom-14 right-8 z-10"
      >
        <div class="hidden md:flex gap-4 items-center justify-center">
          <span class="shrink-0 font-bold text-lg" class:text-accent={!carousel.currentPageIndex}
            >No.{carousel.currentPageIndex + 1}</span
          >
          <div class="flex gap-2">
            <button class="btn btn-circle btn-sm btn-ghost" on:click={() => carousel.goToPrev()}>
              <span class="iconify lucide--chevron-left font-extrabold text-2xl"></span>
            </button>
            <button class="btn btn-circle btn-sm btn-ghost" on:click={() => carousel.goToNext()}>
              <span class="iconify lucide--chevron-right font-extrabold text-2xl"></span>
            </button>
          </div>
        </div>
      </div>
    </Carousel>
    <div class="flex gap-2 md:hidden items-center justify-between p-2">
      <button class="btn btn-circle btn-sm" on:click={() => carousel.goToPrev()}>
        <span class="iconify lucide--chevron-left font-extrabold text-2xl"></span>
      </button>
      <div class="grow btn btn-circle btn-sm no-animation">
        <span class="text-xs">
          <span class:text-accent={!carousel.currentPageIndex}>{carousel.currentPageIndex + 1} </span>/{popComics.length}
        </span>
      </div>
      <button class="btn btn-circle btn-sm" on:click={() => carousel.goToNext()}>
        <span class="iconify lucide--chevron-right font-extrabold text-2xl"></span>
      </button>
    </div>
  {/await}
{/if}

<div class="container mt-4 prose">
  <h2>Latest Update:</h2>
</div>
