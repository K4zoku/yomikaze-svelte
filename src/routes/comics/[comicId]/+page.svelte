<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import ComicStatus from '$components/yomikaze/common/comic/comic-status.svelte';
  import { rateComic } from '$utils/comic-utils';
  import formatNumber from '$utils/common';
  import { tick } from 'svelte';
  import Time from 'svelte-time/Time.svelte';

  export let data;
  let { comicId, comic, chapters, tagCategories, token, libraryManager } = data;
  $: ({ comicId, comic, chapters, tagCategories, token, libraryManager } = data)
  function ratingInit(elem: HTMLDivElement) {
    const stars = elem.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    comic.then((c) => {
      let rate = c.isRated ? c.myRating : c.averageRating;
      rate = rate ? Math.round(rate) : 0;
      stars.forEach((star) => {
        const value = parseInt(star.value);
        if (value <= rate) {
          star.checked = true;
        }
        star.addEventListener('click', postRating);
      });
    });
  }

  let ratingAwait: Promise<void> = Promise.resolve();
  let totalRatings = 0;
  let averageRating = 0;
  async function postRating(e: Event) {
    const target = e.target as HTMLInputElement;
    const rating = parseInt(target.value);
    if (!token) {
      setTimeout(() => {
        const result = confirm('You need to login to rate this comic.');
        if (result) {
          goto('/login?returnUrl=' + window.location.pathname);
        }
      }, 200);
      return;
    }
    ratingAwait = rateComic(comicId, rating, token)
      .then(async () => {
        const c = await comic;
        if (!c.isRated) {
          c.totalRatings = c.totalRatings || 0;
          c.averageRating = c.averageRating || 0;

          c.totalRatings = totalRatings = c.totalRatings + 1;
          c.averageRating = averageRating = (c.averageRating * (totalRatings - 1) + rating) / totalRatings;
        } else {
          c.totalRatings = c.totalRatings || 0;
          c.averageRating = c.averageRating || 0;
          c.myRating = c.myRating || 0;
          console.log('From comic data', c.totalRatings, c.averageRating, c.myRating);
          // read from the comic data
          totalRatings = c.totalRatings || 1;
          averageRating = c.averageRating;

          // update the comic data
          averageRating -= c.myRating / totalRatings;
          averageRating += rating / totalRatings;

          // save the new rating to the comic data
          c.totalRatings = totalRatings;
          c.averageRating = averageRating;
        }
        c.isRated = true;
        c.myRating = rating;
        await tick();
      })
      .catch((err) => {
        console.error(err);
        setTimeout(() => {
          alert('Failed to rate the comic. Please try again later.');
        }, 200);
      });
  }

  async function handleLibraryClick() {
    const c = await comic;
    if (!libraryManager) {
      setTimeout(() => {
        const result = confirm('You need to login to add this comic to your library.');
        if (result) {
          goto('/login?returnUrl=' + window.location.pathname);
        }
      }, 200);
      return;
    }
    if (c.isFollowing) {
      libraryManager.deleteEntry(c.id);
      c.isFollowing = false;
      alert('Comic removed from library.');
    } else {
      libraryManager.createEntry({ comicId: c.id });
      c.isFollowing = true;
      alert('Comic added to library.');
    }
  }
</script>

{#await comic}
  <div class="w-full relative h-96 bg-base-100">
    <div class="absolute top-28 left-0 w-full">
      <div class="container-80 flex gap-6">
        <div class="w-fit h-72 aspect-cover skeleton"></div>
        <div class="grow flex flex-col gap-2 justify-start">
          <div class="max-h-52 h-52 flex flex-col gap-2">
            <div class="flex flex-col gap-2 grow">
              <div class="h-12 w-full skeleton"></div>
              <div class="h-12 w-4/5 skeleton"></div>
            </div>

            <div class="w-3/4 h-8 skeleton"></div>
            <div class="flex gap-2">
              {#each { length: 2 } as _}
                <span class="w-24 h-8 skeleton"></span>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="h-16"></div>
  <div class="container-80 bg-base-100">
    <div class="whitespace-pre-wrap leading-6 py-2 mb-6">
      <p class="max-h-48 min-h-16 overflow-y-scroll">
        {#each { length: 4 } as _}
          <span class="w-full h-4 skeleton"></span>
        {/each}
      </p>
    </div>
  </div>
{:then comic}
  <div class="w-full relative h-96 bg-base-100">
    <div class="absolute w-full h-fit">
      <div
        class="w-full top-0 left-0 h-80 bg-cover bg-fixed bg-top bg-no-repeat"
        style="background-image:url('{comic.banner ||
          comic.cover ||
          '/images/broken-image@2x.png'}');"
      >
        <div
          class="w-full absolute bottom-0 left-0 h-80 bg-gradient-to-t from-neutral-500 via-neutral-500/50 backdrop-blur"
        ></div>
      </div>
    </div>
    <div class="absolute top-28 left-0 w-full">
      <div class="container-80 flex gap-6">
        <Picture
          src={comic.cover}
          class="w-fit h-72 aspect-cover"
          imgClass="w-fit h-72 object-center object-cover aspect-cover rounded-lg"
          useCdn={true}
        />
        <div class="grow flex flex-col gap-2 justify-start">
          <div class="max-h-52 h-52 flex flex-col">
            <h2
              class="leading-tight break-words text-accent-content font-bold text-5xl w-full text-ellipsis line-clamp-2 max-h-32 h-32"
            >
              {comic.name}
            </h2>
            <h3
              class="text-accent-content font-semibold text-xl w-full text-ellipsis line-clamp-1 grow"
            >
              {comic.aliases && comic.aliases.length > 0 ? comic.aliases[0] : ''}
            </h3>
            <div class="text-nowrap text-ellipsis overflow-hidden align-middle w-full py-3">
              {#each comic.authors as author, i}
                {#if i > 0},
                {/if}
                <a href="/search?Author={author}" class="font-normal text-accent-content italic"
                  >{author}</a
                >
              {:else}
                <span class="font-normal text-accent-content italic">Unknown author</span>
              {/each}
            </div>
          </div>
          <div class="grow flex items-end">
            <div class="flex w-full gap-2">
              <button class="btn btn-accent" on:click={handleLibraryClick}>
                {#if comic.isFollowing}
                  <Icon icon="lucide--bookmark-minus" class="text-xl" />
                  Remove From Library
                {:else}
                  <Icon icon="lucide--bookmark-plus" class="text-xl" />
                  Add To Library
                {/if}
              </button>
              <button class="btn">
                <Icon icon="lucide--play" class="text-xl" />
                Start Reading
              </button>
              <button class="btn">
                <Icon icon="lucide--flag" class="text-xl" />
                Report
              </button>

              <details class="dropdown">
                <summary class="btn">
                  <Icon icon="lucide--settings" class="text-xl" />
                  Manage
                </summary>
                <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a href="/comics/{comicId}/chapters/create">
                      <Icon icon="lucide--file-plus" class="text-xl" />
                      Create Chapter
                    </a>
                  </li>
                  <li>
                    <a href="/comics/{comicId}">
                      <Icon icon="lucide--edit" class="text-xl" />
                      Edit Comic
                    </a>
                  </li>
                  <li>
                    <button>
                      <Icon icon="lucide--trash" class="text-xl" />
                      Delete Comic
                    </button>
                  </li>
                </ul>
              </details>
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex gap-1">
              {#each comic.tags
                .filter((tag) => tag.category.name === 'Genre')
                .slice(0, 4) as tag (tag.id)}
                <span class="bg-base-300 rounded px-2 py-1 font-semibold text-xs">{tag.name}</span>
              {/each}
            </div>
            <ComicStatus status={comic.status} />
            <div class="flex items-center gap-1">
              <span class="text-xs font-bold uppercase">
                PUBLICATION: <Time timestamp={comic.publicationDate} format="YYYY" />
              </span>
            </div>
          </div>
          <div class="flex font-semibold text-sm gap-2">
            <div
              class="flex gap-1 items-center min-w-[0] w-fit tooltip"
              data-tip="Total Follows: {comic.totalFollows?.toLocaleString()}"
            >
              <Icon icon="lucide--bookmark" class="text-md shrink-0" />
              {formatNumber(comic.totalFollows ?? 0)}
            </div>
            <div
              class="flex gap-1 items-center min-w-[0] w-fit tooltip"
              data-tip="Total Views: {comic.totalViews?.toLocaleString()}"
            >
              <Icon icon="lucide--eye" class="text-md shrink-0" />
              {formatNumber(comic.totalViews ?? 0)}
            </div>
            <div
              class="flex gap-1 items-center min-w-[0] w-fit tooltip"
              data-tip="Total Comments: {comic.totalComments?.toLocaleString()}"
            >
              <Icon icon="lucide--message-square" class="text-md shrink-0" />
              {formatNumber(comic.totalComments ?? 0)}
            </div>

            {#await ratingAwait}
              <div class="flex gap-1 items-center min-w-[0] w-fit">
                <span class="loading loading-xs loading-dots"></span>
              </div>
            {:then _}
              <div class="flex gap-1 items-center min-w-[0] w-fit" use:ratingInit>
                <div class="rating rating-sm">
                  <input type="radio" name="rating" value="1" class="mask mask-star-2" />
                  <input type="radio" name="rating" value="2" class="mask mask-star-2" />
                  <input type="radio" name="rating" value="3" class="mask mask-star-2" />
                  <input type="radio" name="rating" value="4" class="mask mask-star-2" />
                  <input type="radio" name="rating" value="5" class="mask mask-star-2" />
                </div>
                <span>
                  {averageRating ? averageRating.toFixed(1) : (comic.averageRating ? comic.averageRating.toFixed(1) : '0.0')} 
                  ({totalRatings || comic.totalRatings?.toLocaleString()})
                </span>
              </div>
            {/await}
          </div>
        </div>
      </div>
    </div>
  </div>
{/await}
<div class="h-16"></div>
<div class="container-80 bg-base-100">
  {#await comic}
    <div class="flex justify-center">
      <span class="loading loading-lg"></span>
    </div>
  {:then comic}
    <div class="whitespace-pre-wrap leading-6 py-2 mb-6">
      <p class="max-h-48 min-h-16 overflow-y-scroll">
        {comic.description}
      </p>
    </div>
  {/await}
</div>
<div class="container-80 bg-base-100">
  <div class="flex gap-4 items-start">
    {#await comic then comic}
      <div class="flex flex-wrap gap-4 shrink-0 w-1/4">
        <div class="py-2">
          <div class="text-xl font-bold">Authors</div>
          <div class="flex flex-wrap gap-2">
            {#each comic.authors as author}
              <span class="btn btn-xs no-animation font-medium text-nowrap w-fit">{author}</span>
            {/each}
          </div>
        </div>
        {#each tagCategories as category}
          {#if comic.tags.some((tag) => tag.category.id == category.id)}
            <div class="py-2">
              <div class="text-xl font-bold">{category.name}</div>
              <div class="flex flex-wrap gap-2">
                {#each comic.tags.filter((tag) => tag.category.id == category.id) as tag}
                  <span class="btn btn-xs no-animation font-medium text-nowrap w-fit"
                    >{tag.name}</span
                  >
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/await}
    <div class="flex flex-col grow">
      <div role="tablist" class="tabs tabs-boxed w-fit p-2 shadow-inner mb-4">
        <button class="tab" class:tab-active={true}> Chapters </button>
        <button on:click={() => {}} class="tab" class:tab-active={false}> Comments </button>
      </div>
      <span class="text-xl font-semibold">Totals:</span>
      <div class="flex flex-col gap-2 max-h-64 overflow-x-auto">
        {#await chapters}
          <div class="flex flex-col gap-2 max-h-64 overflow-x-auto">
            <div class="flex justify-center">
              <span class="loading loading-lg"></span>
            </div>
          </div>
        {:then chapters}
          {#each chapters.results as chapter}
            <a
              href="/comics/{chapter.comicId}/chapters/{chapter.number}"
              title="Read Chapter {chapter.number}"
              class="flex justify-start btn btn-block no-animation"
              class:btn-disabled={chapter.hasLock && !chapter.isUnlocked}
            >
              <span>
                {#if chapter.hasLock}
                  {#if chapter.isUnlocked}
                    <Icon icon="lucide--lock-open" class="text-xl" />
                  {:else}
                    <Icon icon="lucide--lock" class="text-xl" />
                  {/if}
                {:else}
                  <Icon icon="lucide--file-check" class="text-xl" />
                {/if}
              </span>
              <div class="flex gap-2 grow">
                Ch.{chapter.number}
                {chapter.name}
              </div>
              <div class="flex gap-6">
                <div class="flex gap-1 items-center">
                  <Icon icon="lucide--clock" class="text-lg" />
                  <Time timestamp={chapter.creationTime} relative />
                </div>
                <div class="flex flex-col justify-between">
                  <div class="flex gap-1 items-center">
                    <Icon icon="lucide--eye" class="text-lg" />
                    <span>{chapter.views}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <Icon icon="lucide--message-square" class="text-lg" />
                    <span>{chapter.totalComments}</span>
                  </div>
                </div>
              </div>
            </a>
          {/each}
        {/await}
      </div>
    </div>
  </div>
</div>
<!-- <div class="hidden">
            <div class="flex justify-end w-10/12">
              <div class="dropdown">
                <div tabindex="0" role="button" class="btn m-1">
                  <span class="iconify lucide--filter text-xl"></span>
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li><a on:click={() => sortComments('newest')}>Newest</a></li>
                  <li><a on:click={() => sortComments('oldest')}>Oldest</a></li>
                </ul>
              </div>
            </div>

            {#if comments.length > 0}
              <ul>
                {#each comments as comment}
                  <li class="mb-3 w-10/12">
                    <div class="flex flex-col border-2 rounded-lg border-accent-content p-4">
                      <div class="flex justify-between border-b-2 border-base-200 pb-2">
                        <div class="flex gap-4 items-center">
                          <div class="avatar">
                            <div class="w-8 ring-2 ring-offset-2 ring-neutral rounded-full">
                              <DefaultAvatar></DefaultAvatar>
                            </div>
                          </div>
                          <div class=" leading-none font-medium">{comment.author.name}</div>
                        </div>
                        <div class="my-auto">
                          {formatDate(comment.creationTime)}
                          <div class="dropdown dropdown-end">
                            <button tabindex="0" class="btn btn-sm btn-base-200">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.25em"
                                height="1.25em"
                                viewBox="0 0 24 24"
                                ><g
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  ><circle cx="12" cy="12" r="1" /><circle
                                    cx="19"
                                    cy="12"
                                    r="1"
                                  /><circle cx="5" cy="12" r="1" /></g
                                ></svg
                              >
                            </button>
                            <ul
                              tabindex="0"
                              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                              <li>
                                <button on:click={() => deleteComment(comment.id)}>Delete</button>
                              </li>
                              <li><button>Edit</button></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="mt-1 break-words">
                        <span class="text-balance">{comment.content}</span>
                      </div>
                      <div class="flex">
                        <button class="" on:click={() => loadReplies(comment.id)}
                          >Show Replies</button
                        >
                      </div>
                    </div>
                    {#if comment.replies}
                      <div class="ml-12 mt-4">
                        {#each comment.replies as reply (reply.id)}
                          <div
                            class="flex flex-col border-2 rounded-lg border-accent-content p-4 mt-3"
                          >
                            <div class="flex justify-between border-b-2 border-base-200 pb-2">
                              <div class="flex gap-4 items-center">
                                <div class="avatar">
                                  <div class="w-8 ring-2 ring-offset-2 ring-neutral rounded-full">
                                    <DefaultAvatar></DefaultAvatar>
                                  </div>
                                </div>
                                <div class=" leading-none font-medium">{reply.author.name}</div>
                              </div>
                              <div class="my-auto">
                                {formatDate(reply.creationTime)}
                              </div>
                            </div>
                            <div class="mt-1 break-words">
                              <span class="text-balance">{reply.content}</span>
                            </div>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </li>
                {/each}
              </ul>

              <div class="mt-4 flex justify-center">
                <button class="btn" on:click={goToFirstPage} disabled={currentPage === 1}
                  ><span class="iconify lucide--chevrons-left"></span></button
                >

                <div class="join">
                  <button
                    class="join-item btn"
                    on:click={goToPreviousPage}
                    disabled={currentPage === 1}
                    ><span class="iconify lucide--chevron-left"></span></button
                  >
                  <button class="join-item btn">Page {currentPage} of {totalPages}</button>
                  <button
                    class="join-item btn"
                    on:click={goToNextPage}
                    disabled={currentPage === totalPages}
                    ><span class="iconify lucide--chevron-right"></span></button
                  >
                </div>
                <button class="btn" on:click={goToLastPage} disabled={currentPage === totalPages}
                  ><span class="iconify lucide--chevrons-right"></span></button
                >
              </div>
            {:else}
              <p>No comments available.</p>
            {/if}
            <div class="flex flex-col justify-center gap-3 mt-3 w-10/12">
              <div class="text-xl font-bold">Comments</div>
              <div class="flex flex-col gap-3">
                <form on:submit|preventDefault={addComment} class="mt-2">
                  <div class="flex flex-col">
                    <textarea
                      class="comment-box textarea textarea-bordered rounded-2xl focus:border-accent-content focus:border-2 h-36 w-75"
                      bind:value={newComment}
                      placeholder="Write your comment here..."
                      on:keypress={handleKeyPress}
                      on:input={handleInput}
                      maxlength="1024"
                    ></textarea>
                    {#if error}
                      <p class="text-error font-semibold mt-2">{error}</p>
                    {/if}
                  </div>

                  <div class="flex justify-end mt-3">
                    <button
                      type="submit"
                      class=" flex gap-2 bg-base-300 font-semibold rounded-md px-4 py-2 w-fit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                        ><path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m22 2l-7 20l-4-9l-9-4Zm0 0L11 13"
                        /></svg
                      > <span class="font-bold">Post</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div> -->
