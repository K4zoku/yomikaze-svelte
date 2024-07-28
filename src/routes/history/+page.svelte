<script lang="ts">
  import http from '$utils/http';
  import { onMount } from 'svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import HistoryManagement from '$utils/history-utils';

  export let data;
  let statOfDeleteButton : boolean;
  let { token } = data;
  const pageName = 'History';
  let historyData = [];
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
  async function deleteHistoryRecord(key: number) {
    await historyManagement.deleteHistory(key);
    alert('History record was deleted');
    await getHistory();
  }
  async function deleteAllHistoryRecord() {
    await historyManagement.deleteAllHistory();
    alert('All history record was deleted');
    await getHistory();
  }
  onMount(async () => {
    await getHistory();
   
  });
</script>

<svelte:head>
  <title>{pageName}</title>
</svelte:head>
<Sublayout {pageName}>
<div class="flex justify-end mr-6 mb-8">
  <dialog id="my_modal_1" class="modal">
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
  <button class="self-center btn btn-square btn-error" onclick="my_modal_1.showModal()">
    <span class="iconify lucide--trash-2 text-xl"></span>
    <p>Clear all history</p>  
  </button>
  {:else}
  <p>No data</p>
  {/if}
</div>
    <div class="container ml-20 mx-auto ">
      {#each historyData as data}
        <div class="bg-base-200 flex mb-4 p-2 rounded-lg shadow-md">
          <div class="img-c">
            <img
              class="rounded-md shadow w-full h-full object-contain"
              src={`https://i.yomikaze.org${data.comic.cover}`}
              alt={data.comic.name}
            />
          </div>
          <div class="flex-1 ml-4">
            <div class="grid grid-flow-col justify-stretch border-b border-black/30">
              <div class="flex flex-col gap-1">
                <p class="font-bold text">{data.comic.name}</p>
                <p class="text-xs">{data.comic.authors.join(', ')}</p>
              </div>
              <div class="flex justify-end gap-4">
                <p class="text-xs self-center">{data.comic.status}</p>
                <button
                  class="self-center btn btn-square btn-sm"
                  on:click={() => deleteHistoryRecord(data.id)}
                >
                  <span class="iconify lucide--trash-2 text-xl"></span>
                </button>
              </div>
            </div>
            <div class="bg-base-200">
              <div>
                <a href="">
                  <div class="flex mb-2 mt-2 h-14 hover:bg-neutral-300 p-1 justify-between">
                    <p class="text-xs font-bold">Ch.{data.chapter.number} - {data.chapter.name}</p>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="flex gap-2">
                        <span class="iconify lucide--clock text-xl"></span>
                        <p class="text-xs">Time</p>
                      </div>
                      <div class="flex w-16 ml-10 gap-2">
                        <span class="iconify lucide--eye text-xl"></span>
                        <p class="text-xs">{data.chapter.views}</p>
                      </div>
                      <div class="flex gap-2">
                        <span class="iconify lucide--user text-xl"></span>
                        <p class="text-xs">{data.comic.publisher.name}</p>
                      </div>
                      <div class="flex w-16 ml-10 gap-2">
                        <span class="iconify lucide--message-square text-xl"></span>
                        <p class="text-xs">{data.chapter.totalComments}</p>
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

<style>
  .img-c {
    height: 120px;
    width: 80px;
  }
</style>
