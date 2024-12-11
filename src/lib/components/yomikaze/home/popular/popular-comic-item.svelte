<script lang="ts">
  import type Comic from '$models/Comic';
  import { onMount } from 'svelte';
  import Picture from '$components/picture.svelte';

  export let comic: Comic;

  let tagsContainer: HTMLDivElement;
  let accumulatedDelta = 0;
  function handleOnWheel(event: WheelEvent) {
    if (event.deltaY === 0) return;
    event.preventDefault();
    accumulatedDelta += event.deltaY / 2;
  }
  onMount(() => {
    setInterval(() => {
      if (accumulatedDelta === 0) return;
      tagsContainer.scrollBy({
        left: accumulatedDelta,
        behavior: 'smooth'
      });
      accumulatedDelta = 0;
    }, 100);
  });
</script>

<a
  href={`/comics/${comic.id}`}
  class="w-full h-112 min-h-112 max-h-112 select-none relative z-0"
  draggable="false"
>
  <Picture
    src={[comic.banner, comic.cover]}
    class="w-full h-112 min-h-112 max-h-112 object-cover object-top"
    imgClass="w-full h-full object-cover object-top"
    fetchpriority="high"
  />
  <div class="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100">
    <div class="w-full max-w-screen-xl mx-auto mt-28">
      <div class="flex flex-col items-center sm:flex-row gap-2 sm:gap-6 py-2 px-4 h-64">
        <figure class="h-64 w-44 shrink-0">
          <Picture
            src={comic.cover}
            class="h-full w-full"
            imgClass="w-full h-full rounded-lg shadow-md object-cover object-center shadow hover:shadow-lg hover:scale-105 transition duration-300"
            fetchpriority="high"
          />
        </figure>
        <div class="flex flex-col grow w-full gap-2 max-h-full h-full min-w-[0]">
          <div class="grow sm:grow-0">
            <h3
              class="text-2xl font-extrabold w-full line-clamp-1 sm:line-clamp-5 text-ellipsis text-center sm:text-left"
            >
              {comic.name}
            </h3>
          </div>
          <div
            bind:this={tagsContainer}
            on:wheel={handleOnWheel}
            class="hidden sm:flex grow md:grow-0 gap-2 py-2 max-w-full overflow-x-scroll shrink-0"
          >
            {#each comic.tags as tag}
              <span class="flex-shrink-0 badge badge-outline">{tag.name}</span>
            {:else}
              <span class="badge opacity-0 appearance-none">{'{tag}'}</span>
            {/each}
          </div>
          <div
            class="min-w-full max-w-full max-h-full h-full overflow-y-scroll scrollbar grow hidden md:block"
          >
            <p class="text-justify">
              {comic.description}
            </p>
          </div>
          <p
            class="italic w-full max-w-full text-nowrap overflow-hidden text-ellipsis shrink-0 hidden sm:block"
          >
            {#each comic.authors ?? [] as author, i}
              {#if i > 0}
                <span>, </span>
              {/if}
              <a class="no-underline" href={'/search/?Author=' + author}>{author}</a>
            {:else}
              <span class="appearance-none opacity-0">Author</span>
            {/each}
          </p>
        </div>
      </div>
    </div>
  </div>
</a>
