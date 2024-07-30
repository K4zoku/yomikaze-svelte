<script lang="ts">
  import Picture from '$components/picture.svelte';
  import type Chapter from '$models/Chapter';
  import type Comic from '$models/Comic';
  import { type ReportReason } from '$models/Report';
  import { delay } from '$utils/common';
  import * as instance from '$utils/http';
  import type { AxiosInstance } from 'axios';
  import { createEventDispatcher, tick } from 'svelte';

  const dispatch = createEventDispatcher();

  export let target: Chapter;
  export let comic: Comic;
  export let http: AxiosInstance = instance.default;

  export const showModal = () => {
    modal.showModal();
  };

  export let modal: HTMLDialogElement;
  export let reasons: ReportReason[] = [];

  async function getReasons(): Promise<ReportReason[]> {
    if (reasons.length > 0) return reasons;
    const response = await http
      .get('/reports/chapter/reasons')
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        return [];
      });
    reasons = response;
    selectedReason =
      reasons.find((reason) => reason.content.toLowerCase() === 'other') ?? reasons[0];
    return reasons;
  }

  let selectedReason: ReportReason;
  let description: string;

  let submitting = false;

  async function handleSubmit() {
    submitting = true;

    const response = await http
      .post('/reports/chapter/' + target.id, {
        reasonId: selectedReason.id,
        description
      })
      .catch((err) => err.response);

    if (response.status.toString().startsWith('2')) {
      dispatch('reported', response.data);
    } else {
      dispatch('error', response.data);
      console.error(response.data);
    }
    submitting = false;
    await tick();
    await delay(200);
    modal.close();
  }

  function handleOnClose() {
    selectedReason =
      reasons.find((reason) => reason.content.toLowerCase() === 'other') ?? reasons[0];
    description = '';
    submitting = false;
  }
</script>

<dialog bind:this={modal} class="modal" on:close={handleOnClose}>
  <div class="modal-box">
    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">Report chapter</h3>
    <h5 class="font-medium mb-2">Chapter</h5>
    <div class="flex gap-4 items-center w-full bg-base-200 h-fit p-4 rounded">
      <Picture
        src={comic.cover}
        alt="Cover"
        class="w-16 h-24 aspect-cover shrink-0 rounded"
        imgClass="w-full h-full rounded"
        useCdn={true}
      />
      <div class="flex flex-col justify-start text-base font-medium">
        <span>{comic.name}</span>
        <span class="text-xs text-neutral">Ch. {target.number} - {target.name}</span>
      </div>
    </div>
    <hr class="border-1 my-4" />
    <form id="report" class="mb-4" on:submit|preventDefault={handleSubmit}>
      <label for="report-reason" class="block mb-2 font-medium">Reason</label>
      <select
        id="report-reason"
        class="select select-bordered w-2/3 select-sm mb-4"
        bind:value={selectedReason}
        class:select-disabled={submitting}
      >
        {#await getReasons()}
          <option disabled selected>Loading...</option>
        {:then reasons}
          {#each reasons as reason}
            <option value={reason}>{reason.content}</option>
          {/each}
        {/await}
      </select>
      <textarea
        id="report-description"
        class="textarea textarea-bordered w-full resize-none"
        class:textarea-disabled={submitting}
        placeholder="Please provide additional details"
        rows="3"
        bind:value={description}
      ></textarea>
    </form>
    <div class="modal-action">
      <button
        type="submit"
        form="report"
        class="btn btn-sm btn-accent"
        class:btn-disabled={submitting}
      >
        {#if submitting}
          <span class="loading"></span>
        {:else}
          Send Report
        {/if}
      </button>
      <form method="dialog" class="flex space-x-2">
        <button class="btn btn-sm">Close</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>Close</button>
  </form>
</dialog>
