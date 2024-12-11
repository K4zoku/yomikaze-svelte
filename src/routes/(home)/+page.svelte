<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import PopularComics from '$components/yomikaze/home/popular/popular-comics.svelte';
  import RecentComicsCarosel from '$components/yomikaze/home/recent-comics.svelte';
  import Time from 'svelte-time/Time.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let { popular, latest, recent } = data;
</script>

<svelte:head>
  <title>Yomikaze</title>
  <meta name="description" content="Yomikaze is a free webtoon reader" />
</svelte:head>

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
                {#each { length: 4 } as _}
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
  {:then comics}
    <PopularComics {comics} />
  {/await}
</section>
<div class="container mt-4 flex flex-col gap-12 pb-8">
  <section id="latest">
    <div class="flex justify-between items-center">
      <h2 class="font-bold text-2xl">Latest Updates</h2>
      <div class="tooltip" data-tip="View all">
        <a href="/updates" class="btn btn-circle btn-ghost" aria-label="View all updates">
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
                  <div class="shrink-0 h-24 aspect-cover">
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
                  class="bg-base-100/80 hover:bg-base-100 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-2 gap-2 w-full max-w-full"
                >
                  <div class="flex gap-2 w-full max-w-full h-24">
                    <div class="shrink-0 h-24 aspect-cover">
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
                      {#await comic.chapter}
                        <span class="loading loading-xs loading-bars"></span>
                      {:then chapter}
                        <a
                          href="/comics/{comic.id}/chapters/{chapter.number}"
                          class="justify-start text-sm">Chapter {chapter.number + 1}</a
                        >
                      {:catch}
                        <span class="justify-start text-sm italic">No chapters yet</span>
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
                              <a href="/search?authors={author}" class="font-normal italic"
                                >{author}</a
                              >
                            {:else}
                              <span class="font-normal italic">Unknown author</span>
                            {/each}
                          </span>
                        </span>
                        <span
                          class="inline-flex gap-1 items-center flex-none"
                          data-last-modified={comic.lastModified}
                        >
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
        <a href="/recents" class="btn btn-circle btn-ghost" aria-label="View all recents">
          <Icon icon="lucide--arrow-right" class="text-2xl" />
        </a>
      </div>
    </div>
    {#await recent}
      <div class="px-6 flex justify-evenly gap-4">
        {#each { length: 9 } as _, i (i)}
          <div class="flex flex-col gap-2 items-center">
            <div class="h-48 w-32 aspect-cover">
              <div class="h-full w-full skeleton shadow-md"></div>
            </div>
            <span class="font-bold flex flex-col gap-2 w-full">
              <div class="h-4 w-3/4 skeleton"></div>
              <div class="h-4 w-1/2 skeleton"></div>
            </span>
          </div>
        {/each}
      </div>
    {:then comics}
      <RecentComicsCarosel {comics} />
    {/await}
  </section>
</div>
