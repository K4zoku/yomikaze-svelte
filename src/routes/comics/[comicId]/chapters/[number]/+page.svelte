<script lang="ts">
  import { goto } from '$app/navigation';
  import Swap from '$components/daisyui/actions/swap.svelte';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import ChapterCommentList from '$components/yomikaze/comment/chapter/chapter-comment-list.svelte';
  import ChapterReport from '$components/yomikaze/report/chapter-report.svelte';
  import type AuthDataStore from '$models/AuthDataStore.js';
  import type Profile from '$models/Profile';
  import { ChapterCommentManagement } from '$utils/chapter-comment-utils';
  import { delay } from '$utils/common';
  import http from '$utils/http';
  import { getContext, onMount, tick } from 'svelte';

  export let data;
  let { chapter, chapters, comic, comicId, number, token } = data;
  $: ({ chapter, chapters, comic, comicId, number, token } = data);
  $: http.defaults.headers.common.Authorization = `Bearer ${token}`;
  const { user } = getContext<AuthDataStore>('auth');
  const addSuccessToast: (message: string, duration?: number) => void =
    getContext('addSuccessToast');
  const addErrorToast: (message: string, duration?: number) => void = getContext('addErrorToast');
  let currentUser: Profile | null = $user;
  let commentManager = new ChapterCommentManagement(token as string);
  onMount(async () => {
    if (currentUser) return;
    currentUser = await http.get('/profile').then((response) => response.data);
  });
  let active = true;

  let currentPage: number = 0;

  function goToPrevPage() {
    if (currentPage > 0) {
      currentPage--;
      handleChange();
    }
  }

  function goToNextPage() {
    if (chapter) {
      if (currentPage < chapter.pages.length - 1) {
        currentPage++;
        handleChange();
      }
    }
  }

  function goToNextChapter() {
    if (chapter) {
      if (chapter.number < chapters.length - 1) {
        goto(`/comics/${comic.id}/chapters/${chapter.number + 1}`);
      }
    }
  }

  function goToPrevChapter() {
    if (chapter) {
      if (chapter.number > 0) {
        goto(`/comics/${comic.id}/chapters/${chapter.number - 1}`);
      }
    }
  }

  let unlockDialog: HTMLDialogElement;
  async function handleUnlockClose() {
    await tick();
  }

  function handleUnlock() {
    http
      .put(`/comics/${comicId}/chapters/${number}/unlock`)
      .then(async () => {
        addSuccessToast('Chapter unlocked successfully');
        unlockDialog.close();
        await goto(`/comics/${comicId}/chapters/${number}`, { invalidateAll: true });
      })
      .catch((error) => {
        if (error.response.status === 402) {
          addErrorToast('Insufficient balance. Please buy more coins.');
          goto('/shop');
        }
        addErrorToast('Failed to unlock chapter, please try again later');
        console.error('Failed to unlock chapter:', error);
      });
  }

  let chapterReportModal: HTMLDialogElement;
  let commentsModal: HTMLDialogElement;

  let elements: Array<HTMLElement> = Array(chapter ? chapter.pages.length : 0);
  let inputting: boolean = false;
  function handleScroll() {
    if (inputting) return; // ignore scroll event when user is inputting
    const limit = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    if (document.documentElement.scrollTop >= limit - 96) {
      currentPage = elements.length - 1;
    } else {
      currentPage = elements.findLastIndex((element) => {
        const { top } = element.getBoundingClientRect();
        return top <= 64;
      });
    }
  }

  async function handleChange() {
    await tick();
    inputting = true;
    const element = elements[currentPage];
    element.scrollIntoView();
    element.focus({ preventScroll: true });
    await delay(500);
    inputting = false;
  }
</script>

<svelte:window on:scroll={handleScroll} />
<svelte:body style:scroll-behavior="smooth" />
<div class="container w-full h-screen mt-16">
  {#if chapter && chapter.pages && chapter.pages.length > 0}
    <div class="flex items-center gap-2 mb-6 mt-2">
      <a class="btn btn-circle btn-ghost" href="/comics/{comic.id}">
        <Icon icon="lucide--arrow-left" class="text-3xl" />
      </a>
      <h2 class="font-header text-2xl font-semibold">
        Reading Chapter {chapter.number + 1}
      </h2>
    </div>
    <div class="flex justify-center h-screen relative">
      <div class="fixed top-16 right-0 p-4 z-50">
        <Swap class="btn btn-circle {active ? 'btn-ghost' : 'shadow'}" bind:active rotate={true}>
          <span slot="off" class="iconify lucide--bar-chart text-2xl transform rotate-90 scale-flip"
          ></span>
          <span slot="on" class="iconify lucide--x text-2xl"></span>
        </Swap>
      </div>
      <aside
        class="bg-base-100 p-4 fixed shadow-inner right-0 w-96 h-full top-16 transition-[right] duration-150 flex flex-col gap-4"
        class:-right-96={!active}
        class:right-0={active}
      >
        <div class="flex items-center justify-start">
          <button class="btn btn-ghost btn-circle" on:click={() => chapterReportModal.showModal()}>
            <Icon icon="lucide--flag" class="text-2xl" />
          </button>
          <ChapterReport bind:target={chapter} bind:comic {http} bind:modal={chapterReportModal} />
        </div>
        <div class="flex flex-col gap-4 w-full">
          <a
            class="no-animation btn btn-ghost btn-block min-w-[0] max-w-full"
            href={`/comics/${comic.id}`}
          >
            <div class="flex gap-2 items-center max-w-full">
              <Icon icon="lucide--book-open" class="text-2xl shrink-0" />
              <span class="text-left text-wrap overflow-hidden text-ellipsis line-clamp-2">
                {comic.name}
              </span>
            </div>
          </a>
          <div class="no-animation btn btn-ghost btn-block min-w-[0] max-w-full justify-start">
            <Icon icon="lucide--file-image" class="text-2xl" />
            <span class="text-left text-wrap overflow-hidden text-ellipsis line-clamp-2"
              >{chapter.name}</span
            >
          </div>
          <div class="flex items-center gap-1">
            <button
              class="btn btn-square shrink-0"
              on:click={goToPrevPage}
              disabled={currentPage === 0}
            >
              <Icon icon="lucide--chevron-left" class="text-2xl" />
            </button>
            <select
              class="select select-bordered focus:select-accent grow"
              bind:value={currentPage}
              on:change={handleChange}
            >
              {#each chapter.pages as _, index}
                <option class="bg-base-200" value={index}>Page {index + 1}</option>
              {/each}
            </select>
            <button
              class="btn btn-square shrink-0"
              on:click={goToNextPage}
              disabled={currentPage === chapter.pages.length - 1}
            >
              <Icon icon="lucide--chevron-right" class="text-2xl" />
            </button>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button
            class="btn btn-square shrink-0"
            on:click={goToPrevChapter}
            disabled={chapter.number === 0}
          >
            <Icon icon="lucide--chevron-left" class="text-2xl" />
          </button>
          <select
            class="select select-bordered h-full w-full max-w-xs select-page self-center"
            on:change={(event) => {
              if (event.currentTarget && event.currentTarget instanceof HTMLSelectElement) {
                const target = event.currentTarget;
                goto(target.value, { state: { chapters } });
              }
            }}
          >
            {#each chapters as chapter (chapter.id)}
              <option
                value="/comics/{chapter.comicId}/chapters/{chapter.number}"
                selected={chapter.number === number}>#{chapter.number + 1} - {chapter.name}</option
              >
            {/each}
          </select>
          <button
            class="btn btn-square shrink-0"
            on:click={goToNextChapter}
            disabled={chapter.number === chapters.length - 1}
          >
            <Icon icon="lucide--chevron-right" class="text-2xl" />
          </button>
        </div>
        <div class="flex flex-col gap-5 mt-5">
          <div
            class="w-full tooltip"
            data-tip={currentUser ? undefined : 'Login to use translation editor'}
          >
            <a
              href="/comics/{comic.id}/chapters/{chapter.number}/translations"
              class="btn btn-block btn-primary"
              class:btn-disabled={!currentUser}
            >
              <Icon icon="lucide--languages" class="text-2xl" />
              Translation Editor
            </a>
          </div>
          <div class="w-full tooltip" data-tip={currentUser ? undefined : 'Login to use comments'}>
            <button
              class="btn btn-accent btn-block"
              on:click={() => commentsModal.showModal()}
              class:btn-disabled={!currentUser}
            >
              <Icon icon="lucide--messages-square" class="text-2xl" />
              View Comments
            </button>
          </div>
        </div>
      </aside>
      <div class="min-h-screen h-fit pb-1 transition-margin duration-150 px-2" class:mr-96={active}>
        <div class="w-full">
          {#each chapter.pages as page, index (page)}
            <div class="w-full" data-index={index} bind:this={elements[index]}>
              <Picture
                src={page}
                useCdn={true}
                class="w-full h-fit select-none"
                imgClass="w-full h-full object-contain"
              >
                <div class="flex justify-center items-center w-full aspect-cover" slot="loading">
                  <span class="loading loading-lg"></span>
                </div>
              </Picture>
            </div>
          {/each}
          <input
            type="range"
            min={0}
            max={chapter.pages.length - 1}
            bind:value={currentPage}
            on:input={handleChange}
            class="range range-accent opacity-50 hover:opacity-100 transition-opacity duration-300 sticky bottom-2 mt-2"
            step="1"
          />
        </div>

        <div class="flex w-full">
          <!-- check if has next chapter add next chap button -->
          {#if chapter && chapter.number < chapters.length - 1}
            <button
              class="btn btn-block"
              on:click={() => {
                if (chapter) goto(`/comics/${comic.id}/chapters/${chapter.number + 1}`);
                else goto(`/comics/${comic.id}`);
              }}
            >
              Next chapter
            </button>
          {:else}
            <button class="btn btn-block btn-disabled">No more chapters</button>
          {/if}
        </div>
      </div>
    </div>
  {:else if chapter && chapter.hasLock && !chapter.isUnlocked && currentUser}
    <dialog
      id="unlock_chapter"
      class="modal"
      open
      on:close={handleUnlockClose}
      bind:this={unlockDialog}
    >
      <div class="modal-box">
        <h3 class="text-lg font-bold">Unlock Chapter</h3>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost absolute right-2 top-2 text-xl">✕</button>
        </form>
        <p class="mt-4">This <strong>chapter</strong> is locked. Please unlock it to read.</p>
        <p><strong>Unlock</strong> this chapter for <strong>{chapter.price}</strong> coins.</p>
        <p>Your balance: <strong>{currentUser.balance}</strong></p>
        <div class="modal-action">
          <a class="btn btn-warning" href="/shop">Purchase more coins</a>
          <button
            class="btn btn-accent"
            on:click={handleUnlock}
            disabled={currentUser.balance < chapter.price}>Unlock</button
          >
        </div>
      </div>
    </dialog>
  {/if}
</div>
<!-- Chapter comment modal -->
{#if currentUser}
  <dialog class="modal" bind:this={commentsModal}>
    <div class="modal-box w-11/12 max-w-5xl">
      <!-- X -->
      <form method="dialog">
        <button class="btn btn-circle btn-ghost absolute right-2 top-2 text-xl">✕</button>
      </form>
      <h2 class="text-lg font-bold">Comments</h2>
      <ChapterCommentList {comicId} chapterNumber={number} {currentUser} {commentManager} />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
{/if}
