<script lang="ts">
  import Picture from '$components/picture.svelte';
  import type Comment from '$models/Comment';
  import { type ReportReason } from '$models/Report';
  import { delay } from '$utils/common';
  import * as instance from '$utils/http';
  import type { AxiosInstance } from 'axios';
    import insane from 'insane';
    import { marked } from 'marked';
  import { createEventDispatcher, tick } from 'svelte';

  const dispatch = createEventDispatcher();

  export let target: Comment;
  export let http: AxiosInstance = instance.default;

  let modal: HTMLDialogElement;

  export let open: boolean = false;

  $: if (modal) {
    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  }

  export let reasons: ReportReason[] = [];

  async function getReasons(): Promise<ReportReason[]> {
    if (reasons.length > 0) return reasons;
    const response = await http
      .get('/reports/comment/reasons')
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
      .post('/reports/comment/' + target.id, {
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
    open = false;
    modal.close();
    await tick();
    await delay(200);
  }

  function handleOnClose() {
    open = false;
    selectedReason =
      reasons.find((reason) => reason.content.toLowerCase() === 'other') ?? reasons[0];
    description = '';
    submitting = false;
  }

</script>

<dialog bind:this={modal} class="modal" on:close={handleOnClose} {open}>
  <div class="modal-box">
    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">Report Comment</h3>
    <h5 class="font-medium mb-2">Comment</h5>
    <div class="flex flex-col gap-3 bg-base-200 h-fit p-4 rounded">
      <div class="flex gap-4 items-center w-full">
        <div class="avatar">
          <div
            class="ring-2 ring-offset-2 ring-neutral ring-offset-base-100 w-12 h-12 aspect-square rounded-full bg-base-100"
          >
            {#if target.author.avatar}
              <Picture
                src={target.author.avatar}
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
        <span class="text-base font-medium">{target.author.name}</span>
      </div>
      <hr class="border mx-2">
      <div class="flex flex-col justify-start text-base font-medium">
        <div class="prose">
            {@html insane(marked(target.content))}
        </div>
      </div>
    </div>
    <hr class="border-1 my-4" />
    <form class="mb-4" on:submit|preventDefault={handleSubmit}>
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
      <button type="submit" class="hidden"></button>
    </form>
    <div class="modal-action">
      <button
        type="button"
        on:click={handleSubmit}
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
