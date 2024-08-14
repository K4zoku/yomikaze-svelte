<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import LibraryModal from '$components/yomikaze/comic/library-modal.svelte';
  import CommentList from '$components/yomikaze/comment/comment-list.svelte';
  import ComicStatus from '$components/yomikaze/common/comic/comic-status.svelte';
  import ComicReport from '$components/yomikaze/report/comic-report.svelte';
  import type Comic from '$models/Comic.js';
  import type LibraryEntry from '$models/LibraryEntry';
  import type Profile from '$models/Profile';
  import { rateComic } from '$utils/comic-utils';
  import { ComicCommentManagement } from '$utils/comment-utils';
  import formatNumber from '$utils/common';
  import http from '$utils/http';
  import { getProfile } from '$utils/profile-utils.js';
  import { getContext, onMount, setContext, tick } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import { fly } from 'svelte/transition';

  export let data;
  let { comicId, comic, chapters, tagCategories, token, libraryManager } = data;
  $: ({ comicId, comic, chapters, tagCategories, token, libraryManager } = data);
  http.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined;
  function ratingInit(elem: HTMLDivElement) {
    const stars = elem.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    let rate = comic.isRated ? comic.myRating : comic.averageRating;
    rate = rate ? Math.round(rate) : 0;
    stars.forEach((star) => {
      const value = parseInt(star.value);
      if (value <= rate) {
        star.checked = true;
      }
      star.addEventListener('click', postRating);
    });
  }

  let comicToDelete: Comic | null = null;
  let comicName = '';
  let comicCover: string = '';
  let comicAuthor: string = '';
  let comicDescription: string = '';
  let deleteModal: HTMLDialogElement;
  let ratingAwait: Promise<void> = Promise.resolve();
  let totalRatings = 0;
  let averageRating = 0;
  const addSuccessToast: (message: string, duration?: number) => void =
    getContext('addSuccessToast');
  const addErrorToast: (message: string, duration?: number) => void = getContext('addErrorToast');
  setContext('addSuccessToast', addSuccessToast); // pass the function to the child components
  setContext('addErrorToast', addErrorToast); // pass the function to the child components
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
          c.averageRating = averageRating =
            (c.averageRating * (totalRatings - 1) + rating) / totalRatings;
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
        addErrorToast('Failed to rate the comic. Please try again later.');
      });
  }

  let reportModal: HTMLDialogElement;

  let libraryEntry: LibraryEntry | null;
  async function loadLibrary() {
    if (!libraryManager) return;
    libraryEntry = await libraryManager.getEntry(comic.id).catch(() => null);
    comic.isFollowing = !!libraryEntry;
  }

  let historyContinue: string;
  let isContinue = false;
  async function loadHistory() {
    const response = await http.get(`/history/comics/${comic.id}/continue`).catch((error) => {
      isContinue = false;
      historyContinue = '';
      return error.response;
    });
    if (response.status.toString().startsWith('2')) {
      const data = response.data;
      historyContinue = `/comics/${comic.id}/chapters/${data.chapter.number}`;
      isContinue = true;
    }
  }

  let showLibraryModal: () => void;

  let tab: boolean = true;
  let commentManager: ComicCommentManagement | undefined;
  let currentUser: Profile;
  onMount(async () => {
    if (token) {
      currentUser = await getProfile({ token });
      commentManager = new ComicCommentManagement(token);
    }
  });

  const deleteComic = async (key: string) => {
    try {
      await http.delete(`/comics/${key}`);
      addSuccessToast('Delete Comic Successfull.');
      goto('/');
    } catch (error) {
      console.log(error);
    } finally {
      comicToDelete = null;
      comicName = '';
      comicCover = '';
      comicAuthor = '';
      comicDescription = '';
      deleteModal.close();
    }
  };

  function openDeleteModal(comic: Comic) {
    comicToDelete = comic;
    comicName = comic.name;
    comicAuthor = comic.authors.join(', ');
    comicDescription = comic.description ?? '';
    comicCover = comic.cover ?? '';
    deleteModal.showModal();
  }
</script>

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
          <div
            class="text-nowrap text-ellipsis overflow-hidden align-middle w-full py-3 text-accent-content"
          >
            {#each comic.authors as author, i}
              {#if i > 0},
              {/if}
              <a href="/search?Author={author}" class="font-normal italic">{author}</a>
            {:else}
              <span class="font-normal text-accent-content italic">Unknown author</span>
            {/each}
          </div>
        </div>
        <div class="grow flex items-end">
          <div class="flex w-full gap-2">
            {#await loadLibrary()}
              <button class="btn btn-wide">
                <span class="loading"></span>
              </button>
            {:then}
              <button class="btn btn-accent" on:click={showLibraryModal}>
                {#if comic.isFollowing}
                  <Icon icon="lucide--bookmark" class="text-xl" />
                  Following
                {:else}
                  <Icon icon="lucide--bookmark-plus" class="text-xl" />
                  Follow
                {/if}
              </button>
              {#if libraryManager}
                <LibraryModal
                  bind:target={comic}
                  bind:showModal={showLibraryModal}
                  {libraryManager}
                />
              {/if}
            {/await}
            {#await loadHistory()}
              <button class="btn btn-wide">
                <span class="loading"></span>
              </button>
            {:then _}
              {#if isContinue}
                <a class="btn btn-wide" href={historyContinue}>
                  <Icon icon="lucide--play" class="text-xl" />
                  Continue Reading
                </a>
              {:else if chapters.totals > 0}
                <a
                  class="btn btn-wide"
                  href={`/comics/${comicId}/chapters/${chapters.results[0].number}`}
                >
                  <Icon icon="lucide--play" class="text-xl" />
                  Start Reading
                </a>
              {:else}
                <button class="btn btn-wide btn-disabled">
                  <Icon icon="lucide--play" class="text-xl" />
                  Start Reading
                </button>
              {/if}
            {/await}
            <button class="btn" on:click={() => reportModal.showModal()}>
              <Icon icon="lucide--flag" class="text-xl" />
              Report
            </button>
            <ComicReport target={comic} bind:modal={reportModal} {http} />
            {#if currentUser && (currentUser.roles.includes('Administrator') || (currentUser.roles.includes('Publisher') && currentUser.id === comic.publisher.id))}
              <details class="dropdown">
                <summary class="btn">
                  <Icon icon="lucide--settings" class="text-xl" />
                  Manage
                </summary>
                <ul class="dropdown-content z-[1] menu menu-sm p-2 shadow bg-base-100 rounded w-52">
                  {#if currentUser.id === comic.publisher.id}
                    <li>
                      <a href="/comics/{comicId}/chapters/create">
                        <Icon icon="lucide--file-plus" class="text-xl" />
                        Create Chapter
                      </a>
                    </li>
                  {/if}
                  <li>
                    <a href="/comics/{comicId}/edit">
                      <Icon icon="lucide--edit" class="text-xl" />
                      Edit Comic
                    </a>
                  </li>
                  <li>
                    <button on:click={() => openDeleteModal(comic)}>
                      <Icon icon="lucide--trash" class="text-xl" />
                      Delete Comic
                    </button>
                  </li>
                </ul>
              </details>
            {/if}
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
                <input
                  type="radio"
                  name="rating"
                  value="0"
                  class="rating-hidden hidden"
                  class:bg-accent={comic.isRated}
                />
                <input
                  type="radio"
                  name="rating"
                  value="1"
                  class="mask mask-star-2"
                  class:bg-accent={comic.isRated}
                />
                <input
                  type="radio"
                  name="rating"
                  value="2"
                  class="mask mask-star-2"
                  class:bg-accent={comic.isRated}
                />
                <input
                  type="radio"
                  name="rating"
                  value="3"
                  class="mask mask-star-2"
                  class:bg-accent={comic.isRated}
                />
                <input
                  type="radio"
                  name="rating"
                  value="4"
                  class="mask mask-star-2"
                  class:bg-accent={comic.isRated}
                />
                <input
                  type="radio"
                  name="rating"
                  value="5"
                  class="mask mask-star-2"
                  class:bg-accent={comic.isRated}
                />
              </div>
              <span>
                {averageRating
                  ? averageRating.toFixed(1)
                  : comic.averageRating
                    ? comic.averageRating.toFixed(1)
                    : '0.0'}
                ({totalRatings || comic.totalRatings?.toLocaleString()})
              </span>
            </div>
          {/await}
        </div>
      </div>
    </div>
  </div>
</div>
<div class="h-16"></div>
<div class="container-80 bg-base-100">
  <div class="whitespace-pre-wrap leading-6 py-2 mb-6">
    <p class="max-h-48 min-h-16 overflow-y-scroll">
      {comic.description}
    </p>
  </div>
</div>
<div class="container-80 bg-base-100 pb-8">
  <div class="flex gap-4 items-start">
    <div class="flex flex-wrap gap-4 shrink-0 w-1/4">
      {#if comic.authors?.length > 0}
        <div class="py-2">
          <div class="text-xl font-bold">Authors</div>
          <div class="flex flex-wrap gap-2">
            {#each comic.authors as author (author)}
              <a
                href="/search?authors={author}"
                class="btn btn-xs no-animation font-medium text-nowrap w-fit">{author}</a
              >
            {/each}
          </div>
        </div>
      {/if}
      <div class="py-2">
        <div class="text-xl font-bold">Publisher</div>
        <div class="flex flex-wrap gap-2">
          <span class="btn btn-xs no-animation font-medium text-nowrap w-fit">
            <a href="/profile/{comic.publisher.id}">{comic.publisher.name}</a>
          </span>
        </div>
      </div>
      {#each tagCategories as category}
        {#if comic.tags.some((tag) => tag.category.id == category.id)}
          <div class="py-2">
            <div class="text-xl font-bold">{category.name}</div>
            <div class="flex flex-wrap gap-2">
              {#each comic.tags.filter((tag) => tag.category.id == category.id) as tag}
                <a
                  href="/search?includeTags={tag.id}"
                  class="btn btn-xs no-animation font-medium text-nowrap w-fit">{tag.name}</a
                >
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
    <div class="flex flex-col grow">
      <div role="tablist" class="tabs tabs-boxed gap-1 w-fit p-2 shadow-inner mb-4">
        <button on:click={() => (tab = true)} class="tab" class:tab-active={tab}>
          Chapters ({comic.totalChapters})
        </button>
        <button on:click={() => (tab = false)} class="tab" class:tab-active={!tab}>
          Comments ({comic.totalComments})
        </button>
      </div>
      {#if tab}
        <div
          class="flex flex-col gap-2 max-h-64 overflow-x-auto"
          in:fly={{ x: 32, delay: 150, duration: 150 }}
          out:fly={{ x: 32, duration: 150 }}
        >
          {#each chapters.results as chapter}
            <a
              href="/comics/{chapter.comicId}/chapters/{chapter.number}"
              title="Read Chapter {chapter.number}"
              class="flex justify-start btn btn-block no-animation"
            >
              <span class="shrink-0">
                {#if chapter.hasLock}
                  {#if chapter.isUnlocked || currentUser?.id === comic.publisher.id}
                    <Icon icon="lucide--lock-open" class="text-xl text-success" />
                  {:else}
                    <Icon icon="lucide--lock" class="text-xl text-error" />
                  {/if}
                {:else}
                  <Icon icon="lucide--lock-open" class="text-xl text-neutral" />
                {/if}
              </span>
              <span class="flex gap-2 grow">
                #{chapter.number + 1} - {chapter.name}
              </span>
              <!-- Pricing -->
              {#if chapter.hasLock && !chapter.isUnlocked}
                <span class="flex gap-1 items-center badge text-warning">
                  <Icon icon="la--coins" class="text-lg" />
                  <span>{chapter.price} coin{chapter.price > 1 ? 's' : ''}</span>
                </span>
              {/if}
              <div class="flex gap-6 basis-3/12">
                <div class="flex gap-1 items-center basis-2/3">
                  <Icon icon="lucide--clock" class="text-lg" />
                  <Time timestamp={chapter.creationTime} relative />
                </div>
                <div class="flex flex-col justify-between basis-1/3">
                  <div class="flex gap-1 items-center">
                    <Icon icon="lucide--eye" class="text-lg" />
                    <span>{formatNumber(chapter.views)}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <Icon icon="lucide--message-square" class="text-lg" />
                    <span>{formatNumber(chapter.totalComments)}</span>
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>
      {:else}
        <div
          class="w-full"
          in:fly={{ x: -32, delay: 150, duration: 150 }}
          out:fly={{ x: -32, duration: 150 }}
        >
          {#if commentManager}
            <CommentList
              {currentUser}
              {comicId}
              {commentManager}
              on:comments={(e) => (comic.totalComments = e.detail)}
            />
          {:else}
            <div class="flex justify-center items-center h-10 w-full rounded bg-base-200">
              <span class="font-bold text-lg">You need to login to view comments.</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<dialog id="delete_modal" class="modal" bind:this={deleteModal}>
  <div class="modal-box">
    <h3 class="text-xl font-bold">Are you sure you want to delete this comic?</h3>
    <div class="flex gap-2 pt-3">
      <Picture
        src={comicCover}
        class="w-fit h-40 aspect-cover shrink-0"
        imgClass="w-fit h-40 aspect-cover boject-cover rounded-lg"
        useCdn={true}
      ></Picture>
      <div>
        <p>Comic: <strong>{comicName}</strong></p>
        <p>Author: {comicAuthor}</p>
        <p>Description:</p>
        <div class="h-20 max-h-20 overflow-auto">
          <p>{comicDescription}</p>
        </div>
      </div>
    </div>

    <div class="modal-action">
      <button
        class="btn btn-error btn-sm"
        on:click={() => {
          if (comicToDelete) deleteComic(comicToDelete.id);
        }}>Confirm</button
      >
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
