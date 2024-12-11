<script lang="ts">
  import Picture from '$components/picture.svelte';
  import type Comic from '$models/Comic';

  export let comic: Comic;
  export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  const sizes = {
    sm: 'w-24 hover:shadow-lg hover:scale-102 hover:translate-y-1 transition duration-100',
    md: 'w-32 hover:shadow-lg hover:scale-102 hover:translate-y-1 transition duration-150',
    lg: 'w-48',
    xl: 'w-56',
    full: 'w-full'
  };
</script>

<a href="/comics/{comic.id}" class="flex flex-col items-center gap-2 snap-start relative h-fit" title={comic.name} role="listitem">
  <Picture
    src={comic.cover}
    class="{sizes[size]} aspect-cover rounded-md shadow-md"
    imgClass="rounded-md shadow w-full aspect-cover object-cover object-center"
  />
  {#if size === 'full'}
    <div
      class="absolute rounded-md top-0 left-0 w-full aspect-cover bg-gradient-to-t from-neutral-900 via-neutral-900/50 hover:bg-transparent"
    >
      <div class="flex flex-col justify-end items-start h-full aspect-cover relative">
        <div
          class="overflow-y-scroll absolute rounded-md hover:backdrop-blur-sm hover:bg-neutral-900/80 bottom-0 left-0 max-h-full h-full aspect-cover transition-all duration-200 opacity-0 hover:opacity-100 grow text-white text-sm p-4"
        >
          <div class="overflow-y-scroll h-5/6 w-full mb-auto">
            {comic.description}
          </div>
        </div>
        <span
          class="px-4 my-2 text-white font-bold max-w-full text-ellipsis line-clamp-2 shrink-0 z-10 pointer-events-none"
        >
          {comic.name}
        </span>
      </div>
    </div>
  {:else}
    <span
      class="self-start text-sm font-semibold text-left max-w-full text-ellipsis line-clamp-2 h-fit shrink-0"
    >
      {comic.name}
    </span>
  {/if}
</a>
