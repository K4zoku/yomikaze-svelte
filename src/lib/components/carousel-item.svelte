<script lang="ts">
  import type Comic from '$models/Comic';
  import Picture from './picture.svelte';

  export let comic: Comic;
</script>

<a href={`/comics/${comic.id}`} class="w-full max-w-screen-2xl h-96 min-h-96 max-h-96 select-none relative z-0" draggable="false">
  <Picture src={[comic.banner, comic.cover]} class="w-full max-w-screen-2xl h-96 min-h-96 max-h-96 object-cover object-top" imgClass="w-full h-full object-cover object-top"/>
  <div
    class="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100"
  >
    <div class="sm:h-5/6 w-full max-w-screen-xl mx-auto mt-16 lg:mt-16">
      <div class="flex flex-col items-center sm:flex-row gap-2 sm:gap-6 sm:h-5/6 py-2 px-4">
        <figure class="h-64 w-44 aspect-[7/10] shrink-0">
          <Picture src={comic.cover} class="h-full aspect-[7/10]" imgClass="w-full h-full rounded-lg shadow-md object-cover object-center"/>
        </figure>
        <div class="flex flex-col grow w-full gap-2 justify-between max-h-full ">
          <div class="grow sm:grow-0">
            <h3 class="text-2xl font-extrabold w-full line-clamp-1 sm:line-clamp-5 text-ellipsis text-center sm:text-left">{comic.name}</h3>
          </div>
          <div class="hidden sm:flex grow md:grow-0 gap-2 py-2 max-w-screen-lg overflow-x-hidden shrink-0">
            {#each comic.tags as tag}
              <span class="flex-shrink-0 badge badge-outline">{tag.name}</span>
            {:else}
              <span class="badge opacity-0 appearance-none">{'{tag}'}</span>
            {/each}
          </div>
          <div class="min-w-full max-w-full max-h-48 overflow-y-scroll grow hidden md:block">
            <p class="text-justify">
              {comic.description}
            </p>
          </div>
          <p class="italic w-full max-w-full text-nowrap overflow-hidden text-ellipsis shrink-0 hidden sm:block">
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
