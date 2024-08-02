<script lang="ts">
  import { goto } from '$app/navigation';
  import Swap from '$components/daisyui/actions/swap.svelte';
  import Icon from '$components/icon.svelte';
  import http from '$utils/http';
  import { onMount, type ComponentType } from 'svelte';
  import LongStripMode from './long-strip-mode.svelte';
  import SinglePageMode from './single-page-mode.svelte';
  import ChapterReport from '$components/yomikaze/report/chapter-report.svelte';
  import ChapterCommentList from '$components/yomikaze/comment/chapter/chapter-comment-list.svelte';
  import type Profile from '$models/Profile';
  import { ChapterCommentManagement } from '$utils/chapter-comment-utils';

  export let data;
  let { chapter, chapters, comic, comicId, number, token } = data;
  $: ({ chapter, chapters, comic, comicId, number, token } = data);
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let currentUser: Profile;
  let commentManager = new ChapterCommentManagement(token as string);
  onMount(async () => {
    currentUser = await http.get('/profile').then((response) => response.data);
  });
  let active = true;

  let readingMode = 'Long Strip';
  function toggleReadingMode() {
    readingMode = readingMode === 'Single Page' ? 'Long Strip' : 'Single Page';
  }
  let currentPage: number = 0;

  function goToPrevPage() {
    if (currentPage > 0) {
      currentPage--;
    }
  }

  function goToNextPage() {
    if (chapter) {
      if (currentPage < chapter.pages.length - 1) {
        currentPage++;
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

  const readingModes: {
    [key: string | 'Single Page' | 'Long Strip']: { component: ComponentType };
  } = {
    'Single Page': {
      component: SinglePageMode
    },
    'Long Strip': {
      component: LongStripMode
    }
  };

  let unlockDialog: HTMLDialogElement;
  async function handleUnlockClose() {
    chapter = await http
      .get(`/comics/${comicId}/chapters/${number}`)
      .then((response) => response.data)
      .catch((error) => {
        goto(`/comics/${comicId}`);
        return false;
      });
  }

  function handleUnlock() {
    http
      .put(`/comics/${comicId}/chapters/${number}/unlock`)
      .then(() => {
        unlockDialog.close();
      })
      .catch((error) => {
        if (error.response.status === 402) {
          goto('/shop');
        }
        console.error('Failed to unlock chapter:', error);
      });
  }

  let chapterReportModal: HTMLDialogElement;
  let commentsModal: HTMLDialogElement;
</script>

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
        class="bg-base-200 rounded p-4 fixed shadow right-0 w-96 h-full top-16 transition-[right] duration-150 flex flex-col gap-4"
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
            >
              {#each chapter.pages as _, index}
                <option class="bg-base-200" value={index}>Pg.{index + 1}</option>
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
        <div class="flex items-center gap-4">
          <div class="font-bold shrink-0">Reading Mode</div>
          <button class="btn gap-2 grow items-center justify-start" on:click={toggleReadingMode}>
            {#if readingMode == 'Single Page'}
              <Icon icon="lucide--file" class="text-2xl" />
            {:else}
              <Icon icon="lucide--gallery-vertical" class="text-2xl" />
            {/if}
            {readingMode}
          </button>
        </div>
        <div class="flex flex-col gap-5 mt-5">
          <a
            href="/comics/{comic.id}/chapters/{chapter.number}/translations"
            class="btn btn-block btn-primary"
          >
            <Icon icon="lucide--languages" class="text-2xl" />
            Translate
          </a>
          <button class="btn btn-accent btn-block" on:click={() => commentsModal.showModal()}>
            <Icon icon="lucide--messages-square" class="text-2xl" />
            View Comments
          </button>
        </div>
      </aside>
      <div class="min-h-screen h-fit pb-1 transition-margin duration-150" class:mr-96={active}>
        <svelte:component
          this={readingModes[readingMode].component}
          bind:pages={chapter.pages}
          bind:currentPage
        />
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
  {:else if chapter && chapter.price}
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
        <div class="mt-4">
          <button class="btn btn-primary" on:click={handleUnlock}>Unlock</button>
        </div>
      </div>
    </dialog>
  {/if}
</div>
<!-- Chapter comment modal -->

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
