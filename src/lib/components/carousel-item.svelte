<script lang="ts">
  import type Comic from '$models/Comic';

  export let comic: Comic;
  export let index: number;
</script>

<a href={`/comics/${comic.id}`} class="w-full aspect-[20/6] min-h-80 select-none relative z-0" draggable="false" on:drag|preventDefault={() => {}}>
  <picture class="w-full aspect-[20/6]">
    <source
      class="w-full h-full object-cover object-center"
      srcset={comic.banner}
      type="image/webp"
    />
    <source
      class="w-full h-full object-cover object-center"
      srcset={comic.cover}
      type="image/webp"
    />
    <img
      class="w-full h-full object-cover object-center"
      src="/images/default.svg"
      alt=""
    />
  </picture>
  <div
    class="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100 backdrop-blur"
  >
    <div class="h-[70%] max-w-screen-xl w-full mx-auto mt-16 lg:mt-[6%]">
      <div class="flex gap-6 h-[70%] py-2 px-4">
        <figure class="h-full aspect-[7/10] shrink-0">
          <picture class="h-full aspect-[7/10]">
            <source
              class="object-cover object-center rounded-lg shadow-md"
              srcset={comic.cover}
              type="image/webp"
            />
            <img
              class="w-full h-full max-h-full object-cover object-center rounded-lg shadow-md"
              src="/images/default.svg"
              alt=""
            />
          </picture>
        </figure>
        <div class="flex flex-col gap-2 max-h-full">
          <h3 class="text-xl md:text-2xl lg:text-4xl font-extrabold">{comic.name}</h3>
          <div class="flex gap-2 py-2 max-w-screen-lg overflow-x-hidden shrink-0">
            {#if index === 0}
              <span class="flex-shrink-0 badge badge-outline badge-accent">Suggestive</span>
            {/if}
            {#each comic.tags as tag}
              <span class="flex-shrink-0 badge badge-outline">{tag.name}</span>
            {:else}
              <span class="badge opacity-0 appearance-none">{'{tag}'}</span>
            {/each}
          </div>
          <div class="max-w-full w-full max-h-48 overflow-y-scroll grow hidden md:block">
            <p class="text-justify">
              {comic.description}
            </p>
          </div>
          <div class="w-full italic max-w-screen-lg overflow-hidden shrink-0">
            {#each comic.authors ?? [] as author}
              <a href={'/search/?Author=' + author}>{author}</a>
            {:else}
              <span class="appearance-none opacity-0">Author</span>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</a>
