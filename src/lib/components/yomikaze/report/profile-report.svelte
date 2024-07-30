<script lang="ts">
  import Picture from '$components/picture.svelte';
  import type Profile from '$models/Profile';
  import { type ReportReason } from '$models/Report';
  import { delay } from '$utils/common';
  import * as instance from '$utils/http';
  import type { AxiosInstance } from 'axios';
  import { createEventDispatcher, tick } from 'svelte';

  const dispatch = createEventDispatcher();

  export let target: Profile;
  export let http: AxiosInstance = instance.default;

  export const showModal = () => {
    modal.showModal();
  };

  export let modal: HTMLDialogElement;
  export let reasons: ReportReason[] = [];

  async function getReasons(): Promise<ReportReason[]> {
    if (reasons.length > 0) return reasons;
    const response = await http
      .get('/reports/profile/reasons')
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
      .post('/reports/profile/' + target.id, {
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
    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">Report Profile</h3>
    <h5 class="font-medium mb-2">Profile</h5>
    <div class="flex gap-4 items-center w-full bg-base-200 h-fit p-4 rounded">
      <div class="avatar">
        <div
          class="ring-2 ring-offset-2 ring-neutral ring-offset-base-100 w-12 h-12 aspect-square rounded-full bg-base-100"
        >
          {#if target.avatar}
            <Picture
              src={target.avatar}
              alt="Avatar"
              class="w-full h-full"
              imgClass="w-full h-full rounded-full"
              useCdn={true}
            />
          {:else}
            <div class="w-full h-full flex justify-center items-center bg-gray-100 rounded-full">
              <span class="iconify lucide--user text-4xl !text-base-content"></span>
            </div>
          {/if}
        </div>
      </div>
      <span class="text-base font-medium">{target.name}</span>
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
