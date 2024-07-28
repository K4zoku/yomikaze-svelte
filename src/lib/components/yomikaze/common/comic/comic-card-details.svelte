<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import type Comic from '$models/Comic';
  import ComicStatus from './comic-status.svelte';
  export let comic: Comic;

</script>

<a href="/comics/{comic.id}" class="flex items-center gap-4 rounded-lg shadow-md p-3 h-56">
  <Picture
    src={comic.cover}
    class="h-full aspect-cover rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-100 shrink-0"
    imgClass="rounded-md shadow w-full h-full object-cover object-center"
  />
  <div class="grow flex flex-col gap-2 h-full">
    <div class="flex justify-between shrink-0">
      <div class="flex flex-col items-start justify-between">
        <h4 class="text-xl font-bold mb-0 grow w-full line-clamp-2 text-ellipsis">
          {comic.name}
        </h4>
        <span class="text-sm mb-0 shrink-0">{comic.authors.join(', ')}</span>
      </div>
      <div class="flex items-center justify-center gap-2">
        <ComicStatus status={comic.status} />
        <slot name="actions" />
      </div>
    </div>
    <hr class="border-1 m-0" />
    <div class="flex justify-between">
      <div class="flex gap-2 mt-4 mb-3">
        {#each comic.tags as tag (tag.id)}
          <a class="badge badge-outline" href="/search?includes={tag.id}">{tag.name}</a>
        {/each}
      </div>
    </div>
    <div class="text-sm overflow-y-scroll h-full grow">
      <span class="text-base">{comic.description} </span>
    </div>
  </div>
</a>
