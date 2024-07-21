<script lang="ts">
  import Carousel from 'svelte-carousel';
  import type { PageData } from './$types';
  import PopularComicItem from '$components/popular-comic-item.svelte';
  import Picture from '$components/picture.svelte';
  import Time from 'svelte-time/Time.svelte';
  import Icon from '$components/icon.svelte';
  import svelteTilt from 'vanilla-tilt-svelte';
  import { getLatestChapter } from '$utils/comic-utils';
  import type Comic from '$models/Comic';

  export let data: PageData;
  let { popular, latest, recent } = data;

  interface CarouselData {
    goToPrev: () => void;
    goToNext: () => void;
    currentPageIndex: number;
  }

  let popularCarousel: CarouselData = {
    goToNext: () => {},
    goToPrev: () => {},
    currentPageIndex: 0
  };

  let recentlyCarousel: CarouselData = {
    goToNext: () => {},
    goToPrev: () => {},
    currentPageIndex: 0
  };
</script>

<section id="popular">
  {#await popular}
    <div class="w-full h-112 min-h-112 max-h-112 select-none relative z-0">
      <div class="w-full h-full bg-base-300"></div>
      <div
        class="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100 backdrop-blur"
      >
        <div class="w-full max-w-screen-xl mx-auto mt-28">
          <div class="flex flex-col items-center sm:flex-row gap-2 sm:gap-6 py-2 px-4 h-64">
            <div class="h-64 w-44 shrink-0">
              <div class="h-full w-full skeleton"></div>
            </div>
            <div class="flex flex-col grow w-full gap-4 justify-between max-h-full h-full">
              <div class="grow sm:grow-0">
                <div class="h-8 w-2/3 skeleton"></div>
              </div>
              <div
                class="hidden sm:flex grow md:grow-0 gap-2 py-2 max-w-screen-lg overflow-x-hidden shrink-0"
              >
                {#each { length: 4 } as _, i}
                  <span class="flex-shrink-0 h-4 w-16 skeleton"></span>
                {/each}
              </div>
              <div class="w-full max-h-full overflow-y-scroll grow hidden md:flex flex-col gap-1">
                <div class="w-full h-4 skeleton"></div>
                <div class="w-full h-4 skeleton"></div>
                <div class="w-1/2 h-4 skeleton"></div>
              </div>
              <div class="w-full italic max-w-screen-lg overflow-hidden shrink-0 hidden sm:block">
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
      bind:goToPrev={popularCarousel.goToPrev}
      bind:goToNext={popularCarousel.goToNext}
      on:pageChange={(event) => (popularCarousel.currentPageIndex = event.detail)}
    >
      {#each popComics as comic (comic.id)}
        <PopularComicItem {comic}></PopularComicItem>
      {/each}
      <div slot="prev" class="absolute z-10 w-full top-16">
        <div class="container">
          <h2 class="font-bold text-2xl">Popular Comics</h2>
        </div>
      </div>
      <div slot="next" class="absolute bottom-14 right-8 z-10">
        <div class="hidden md:flex gap-4 items-center justify-center">
          <span
            class="shrink-0 font-bold text-lg"
            class:text-accent={!popularCarousel.currentPageIndex}
            >No.{popularCarousel.currentPageIndex + 1}</span
          >
          <div class="flex gap-2">
            <button
              class="btn btn-circle btn-sm btn-ghost"
              on:click={() => popularCarousel.goToPrev()}
            >
              <span class="iconify lucide--chevron-left font-extrabold text-2xl"></span>
            </button>
            <button
              class="btn btn-circle btn-sm btn-ghost"
              on:click={() => popularCarousel.goToNext()}
            >
              <span class="iconify lucide--chevron-right font-extrabold text-2xl"></span>
            </button>
          </div>
        </div>
      </div>
    </Carousel>
    <div class="flex gap-2 md:hidden items-center justify-between p-2">
      <button class="btn btn-circle btn-sm" on:click={() => popularCarousel.goToPrev()}>
        <span class="iconify lucide--chevron-left font-extrabold text-2xl"></span>
      </button>
      <div class="grow btn btn-circle btn-sm no-animation">
        <span class="text-xs">
          <span class:text-accent={!popularCarousel.currentPageIndex}
            >{popularCarousel.currentPageIndex + 1}
          </span>/{popComics.length}
        </span>
      </div>
      <button class="btn btn-circle btn-sm" on:click={() => popularCarousel.goToNext()}>
        <span class="iconify lucide--chevron-right font-extrabold text-2xl"></span>
      </button>
    </div>
  {/await}
</section>
<div class="container mt-4 flex flex-col gap-12 pb-8">
  <section id="latest">
    <div class="flex justify-between items-center">
      <h2 class="font-bold text-2xl">Latest Updates</h2>
      <div class="tooltip" data-tip="View all">
        <a href="/comics" class="btn btn-circle btn-ghost">
          <Icon icon="lucide--arrow-right" class="text-2xl" />
        </a>
      </div>
    </div>
    <div class="flex gap-4 max-w-full w-full mt-2">
      {#await latest}
        {#each { length: 4 } as _, column (column)}
          <div class="bg-base-200 w-full p-4 flex flex-col gap-4 rounded-lg">
            {#each { length: 6 } as _, row (row)}
              <div
                class="bg-base-300/40 rounded-lg shadow-md hover:shadow-lg transition duration-200 p-2 gap-2 w-full max-w-full"
              >
                <div class="flex gap-2 w-full max-w-full h-24">
                  <div class="shrink-0 h-24 aspect-cover" use:svelteTilt={{ scale: 1.03, max: 10 }}>
                    <div class="h-24 w-full skeleton"></div>
                  </div>
                  <div class="flex flex-col h-full max-w-full w-full gap-2">
                    <div class="grow flex flex-col gap-1">
                      <div class="h-5 w-full skeleton"></div>
                      <div class="h-5 w-2/3 skeleton"></div>
                    </div>
                    <div class="h-3 w-1/2 skeleton"></div>
                    <div class="flex justify-between text-sm gap-1 font-normal max-w-full w-full">
                      <div class="h-3 w-2/3 flex gap-1">
                        <div class="h-3 w-1/3 skeleton"></div>
                        <div class="h-3 w-1/3 skeleton"></div>
                      </div>
                      <div class="h-3 w-1/3 skeleton"></div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/each}
      {:then comics}
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 resize-x">
          {#each { length: 4 } as _, column (column)}
            <div class="bg-base-200 p-4 flex flex-col gap-4 rounded-lg">
              {#each comics.slice(column * 6, (column + 1) * 6) as comic (comic.id)}
                <a
                  href="/comics/{comic.id}"
                  class="bg-base-300 hover:bg-base-300/50 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-2 gap-2 w-full max-w-full"
                >
                  <div class="flex gap-2 w-full max-w-full h-24">
                    <div
                      class="shrink-0 h-24 aspect-cover"
                      use:svelteTilt={{ scale: 1.03, max: 25, glare: true, maxGlare: 1 }}
                    >
                      <Picture
                        src={comic.cover}
                        class="h-24 aspect-cover shrink-0"
                        imgClass="rounded-md shadow w-full h-full object-cover object-center"
                      />
                    </div>
                    <div class="flex flex-col h-full max-w-full w-full gap-1 min-w-[0]">
                      <h3
                        class="font-semibold overflow-hidden line-clamp-2 text-lg grow max-w-full w-full"
                      >
                        {comic.name}
                      </h3>
                      {#await getLatestChapter(comic.id)}
                        <span class="loading loading-xs loading-bars"></span>
                      {:then chapter}
                        <a
                          href="/comics/{comic.id}/chapters/{chapter.number}"
                          class="justify-start text-sm">Chapter {chapter.number + 1}</a
                        >
                      {:catch}
                        <a href="/comics/{comic.id}/" class="justify-start text-sm"
                          >No chapters yet</a
                        >
                      {/await}
                      <div class="flex justify-between text-sm gap-2 font-normal max-w-full w-full">
                        <span class="flex gap-1 items-center w-full min-w-[0]">
                          {#if comic.authors.length > 1}
                            <Icon icon="lucide--users" />
                          {:else}
                            <Icon icon="lucide--user" />
                          {/if}
                          <span
                            class="text-nowrap text-ellipsis overflow-hidden align-middle w-full"
                          >
                            {#each comic.authors as author, i}
                              {#if i > 0},
                              {/if}
                              <a href="/search?Author={author}" class="font-normal italic"
                                >{author}</a
                              >
                            {/each}
                          </span>
                        </span>
                        <span class="inline-flex gap-1 items-center flex-none">
                          <Icon icon="lucide--clock" />
                          <Time timestamp={comic.lastModified ?? comic.creationTime} relative />
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {/each}
        </div>
      {/await}
    </div>
  </section>
  <section id="recently">
    <div class="flex justify-between items-center">
      <h2 class="font-bold text-2xl">Recently Added</h2>
      <div class="tooltip" data-tip="View all">
        <a href="/comics" class="btn btn-circle btn-ghost">
          <Icon icon="lucide--arrow-right" class="text-2xl" />
        </a>
      </div>
    </div>
    {#await recent}
      <div class="px-6 flex justify-evenly gap-4">
        {#each { length: 9 } as _, i (i)}
          <div class="flex flex-col gap-2 items-center">
            <div class="h-48 w-32 aspect-cover rounded-md shadow-md">
              <div class="h-full w-full skeleton"></div>
            </div>
            <span class="text-sm font-bold text-center max-w-full text-ellipsis line-clamp-2">
              <div class="h-4 w-24 skeleton"></div>
            </span>
          </div>
        {/each}
      </div>
    {:then comics}
      <Carousel
        swiping={true}
        autoplay
        autoplayDuration={5000}
        pauseOnFocus
        dots={true}
        particlesToShow={9}
        particlesToScroll={3}
        infinite={false}
        bind:goToPrev={recentlyCarousel.goToPrev}
        bind:goToNext={recentlyCarousel.goToNext}
        on:pageChange={(event) => (recentlyCarousel.currentPageIndex = event.detail)}
      >
        {#each comics as comic (comic.id)}
          <a href="/comics/{comic.id}" class="flex flex-col gap-2 items-center">
            <Picture
              src={comic.cover}
              class="h-48 w-32 aspect-cover rounded-md shadow-md"
              imgClass="rounded-md shadow w-full h-full object-cover object-center"
            />
            <span class="text-sm font-bold text-center max-w-full text-ellipsis line-clamp-2"
              >{comic.name}</span
            >
          </a>
        {/each}
        <div slot="dots" let:pagesCount let:currentPageIndex let:showPage class="flex gap-1">
          {#each { length: pagesCount } as _, i}
            <button
              class:badge-accent={currentPageIndex === i}
              class:badge-neutral={currentPageIndex !== i}
              class="badge badge-xs"
              on:click={() => showPage(i)}
            >
            </button>
          {/each}
        </div>
        <div slot="prev"></div>
        <div slot="next"></div>
      </Carousel>
    {/await}
  </section>
</div>
