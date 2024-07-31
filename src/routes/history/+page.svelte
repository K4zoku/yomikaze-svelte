<script lang="ts">
  import http from '$utils/http';
  import { getContext, onMount } from 'svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import HistoryManagement from '$utils/history-utils';
  import Picture from '$components/picture.svelte';
  import ComicStatus from '$components/yomikaze/common/comic/comic-status.svelte';
  import Time from 'svelte-time/Time.svelte';
  import type HistoryRecord from '$models/HistoryRecord.js';
    import type { Writable } from 'svelte/store';
    import type { ToastProps } from '../+layout.svelte';

  export let data;
  let statOfDeleteButton: boolean;
  let { token } = data;
  const pageName = 'History';
  let historyData: HistoryRecord[] = [];
  let historyManagement = new HistoryManagement(token);
  async function getHistory() {
    const response = await historyManagement.getHistories();
    historyData = response.results;
    if (historyData.length > 0) {
      statOfDeleteButton = true;
    } else {
      statOfDeleteButton = false;
    }

    // await http.get(`/comics/${historyData.comic.id}/chapters/${number}`);
  }
  async function deleteHistoryRecord(key: string) {
    await historyManagement.deleteHistory(key);
    alert('History record was deleted');
    await getHistory();
  }
  async function deleteAllHistoryRecord() {
    await historyManagement.deleteAllHistory();
    addToast('All history record was deleted');
    await getHistory();
  }
  onMount(async () => {
    await getHistory();
  });

  let deleteModal: HTMLDialogElement;

  const toasts = getContext<Writable<ToastProps[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', icon: 'lucide--circle-check-big' }
    ]);
  }
</script>

<svelte:head>
  <title>{pageName}</title>
</svelte:head>
<Sublayout {pageName}>
  <div class="flex justify-end mr-6 mb-8">
    <dialog bind:this={deleteModal} class="modal">
      <div class="modal-box">
        <div class="flex gap-4">
          <span class="iconify lucide--circle-alert text-xl bg-red-500 self-center"></span>
          <p class="font-bold">Warning</p>
        </div>
        <p class="py-4 text-base">This action will be delete all your history record !</p>
        <div class="modal-action gap-2">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error" on:click={deleteAllHistoryRecord}>Delete</button>
            <button class="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
    {#if statOfDeleteButton}
      <button class="btn btn-error flex gap-2" on:click={() => deleteModal.showModal()}>
        <span class="iconify lucide--trash-2 text-xl"></span>
        <p>Clear all history</p>
      </button>
    {:else}
      <p>No data</p>
    {/if}
  </div>
  <div class="container ml-20 mx-auto">
    {#each historyData as data}
      <div class="bg-base-200 flex mb-4 p-2 rounded-lg shadow-md">
        <Picture
          src={data.comic.cover}
          useCdn={true}
          class="h-36 w-fit aspect-cover"
          imgClass="rounded-md shadow object-contain w-full h-full"
        ></Picture>
        <div class="flex-1 ml-4">
          <div class="flex flex-col gap">
            <div class="flex justify-between items-center w-full">
              <p class="font-bold text-xl">{data.comic.name}</p>

              <div class="flex">
                <ComicStatus status={data.comic.status}></ComicStatus>
                <button
                  class="self-center btn btn-square btn-sm"
                  on:click={() => deleteHistoryRecord(data.id)}
                >
                  <span class="iconify lucide--trash-2 text-xl"></span>
                </button>
              </div>
            </div>
            <div class="flex">
              <p class="text-sm">{data.comic.authors.join(', ')}</p>
            </div>
          </div>
          <hr class="border my-2" />
          <div class="bg-base-200">
            <div>
              <a href="/comics/{data.comic.id}/chapters/{data.chapter.number}">
                <div class="flex mb-2 mt-2 h-14 hover:bg-neutral-300 p-1 justify-between">
                  <p class="text-base font-bold">Ch.{data.chapter.number} - {data.chapter.name}</p>
                  <div class="flex gap-2 items-center">
                    <div class="flex flex-col gap-2">
                      <div class="flex gap-1 items-center">
                        <span class="iconify lucide--clock text-xl"></span>
                        <Time timestamp={data.creationTime} relative></Time>
                      </div>
                      <div class="flex gap-1 items-center">
                        <span class="iconify lucide--user text-xl"></span>
                        <p class="text-sm">{data.comic.publisher.name}</p>
                      </div>
                    </div>
                    <div class="flex flex-col items-start gap-2">
                      <div class="flex gap-1 items-center">
                        <span class="iconify lucide--eye text-xl"></span>
                        <p class="text-sm">{data.chapter.views}</p>
                      </div>
                      <div class="flex gap-1 items-center">
                        <span class="iconify lucide--message-square text-xl"></span>
                        <p class="text-sm">{data.chapter.totalComments}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Sublayout>
