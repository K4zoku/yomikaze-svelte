<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import type Comic from '$models/Comic';
  import formatNumber from '$utils/common';
  import ComicStatus from './comic-status.svelte';
  export let comic: Comic;
</script>

<div class="flex items-center gap-4 rounded-lg shadow-md p-3 h-64 min-w-[0]">
  <a href="/comics/{comic.id}" class="h-full w-fit aspect-cover shrink-0">
    <Picture
      useCdn={true}
      src={comic.cover}
      class="h-full w-fit aspect-cover"
      imgClass="rounded-md shadow w-full h-full object-cover object-center"
    />
  </a>
  <div class="grow flex flex-col gap-2 h-full min-w-[0]">
    <div class="flex justify-between shrink-0 min-w-[0]">
      <div class="flex flex-col items-start justify-between min-w-[0] basis-9/12">
        <h4 class="text-xl font-bold mb-0 grow w-full line-clamp-2 text-ellipsis">
          <a href="/comics/{comic.id}">
            {comic.name}
          </a>
        </h4>
        <span class="text-sm mb-0 shrink-0">
          {#each comic.authors as author, index (author)}
            {#if index > 0},
            {/if}
            <a href="/search?authors={author}">{author}</a>
          {/each}
        </span>
        <a
          href="/profile/{comic.publisher.id}"
          class="flex gap-1 items-center min-w-[0] text-sm"
        >
          <Icon icon="lucide--user" class="shrink-0" />
          {comic.publisher.name}
        </a>
      </div>
      <div class="flex flex-col-reverse items-end justify-center gap-2 min-w-[0] basis-3/12">
        <div class="flex gap-2 min-w-[0] flex-wrap justify-end">
          <ComicStatus status={comic.status} />
          <div class="flex gap-2 min-w-[0] flex-wrap justify-end">
            <div
              class="flex gap-1 items-center min-w-[0] w-fit tooltip"
              data-tip="Total Follows: {comic.totalFollows?.toLocaleString()}"
            >
              <Icon icon="lucide--bookmark" class="text-lg shrink-0" />
              {formatNumber(comic.totalFollows ?? 0)}
            </div>
            <div
              class="flex gap-1 items-center min-w-[0] w-fit tooltip"
              data-tip="Total Views: {comic.totalViews?.toLocaleString()}"
            >
              <Icon icon="lucide--eye" class="text-lg shrink-0" />
              {formatNumber(comic.totalViews ?? 0)}
            </div>
            <div
              class="flex gap-1 items-center min-w-[0] w-fit tooltip"
              data-tip="Total Comments: {comic.totalComments?.toLocaleString()}"
            >
              <Icon icon="lucide--message-square" class="text-lg shrink-0" />
              {formatNumber(comic.totalComments ?? 0)}
            </div>
          </div>
        </div>
        <div class="self-end">
          <slot name="actions" />
        </div>
      </div>
    </div>
    <hr class="border-1 m-0" />
    <div class="flex justify-between min-w-[0]">
      <div class="flex gap-2 mt-4 mb-3 min-w-[0] max-w-full overflow-x-scroll">
        {#each comic.tags as tag (tag.id)}
          <a class="badge badge-outline text-nowrap" href="/search?includeTags={tag.id}" data-sveltekit-reload>{tag.name}</a>
        {/each}
      </div>
    </div>
    <div class="text-sm overflow-y-scroll h-full grow">
      <span class="text-base">{comic.description} </span>
    </div>
  </div>
</div>
