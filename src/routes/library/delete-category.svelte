<script lang="ts">
  import Icon from '$components/icon.svelte';
  import type LibraryCategory from '$models/LibraryCategory';
  import type Problem from '$models/ProblemResponse';
  import type { LibraryManagement } from '$utils/library-utils';
  import type { AxiosError } from 'axios';
  import { createEventDispatcher, tick } from 'svelte';

  const dispatch = createEventDispatcher();

  let modal: HTMLDialogElement;

  export function open() {
    modal.showModal();
  }

  export function close() {
    modal.close();
  }

  export let model: LibraryCategory | undefined;

  export let libraryManagement: LibraryManagement;

  let sumitting = false;
  let error = '';
  async function submit() {
    if (sumitting) return;
    if (!model) return;
    sumitting = true;
    try {
      await libraryManagement.deleteCategory(model.id);
      dispatch('success', model);
    } catch (e) {
      const { response } = e as AxiosError;
      if (response) {
        if (response.status === 400) {
          let errorData: Problem = response.data as Problem;
          console.error('Invalid data', response.data);
          error = Object.values(errorData.errors)
            .flatMap((e) => e)
            .join(', ');
          sumitting = false;
          await tick();
          return;
        } else {
          console.error(response);
        }
      } else {
        console.error(e);
      }
      error = 'An unknown error occurred';
      sumitting = false;
      await tick();
      return;
    }
    sumitting = false;
    await tick();
    close();
  }
</script>

<dialog bind:this={modal} class="modal">
  <div class="modal-box flex flex-col">
    {#if !!error}
      <div class="bg-error text-error-content rounded py-2 px-4 flex items-center gap-2 mt-2 mb-4">
        <Icon icon="lucide--alert-circle" class="text-lg" />
        Test error
      </div>
    {/if}
    <span class="iconify lucide--alert-circle text-4xl text-error"></span>
    <h3 class="text-lg font-bold">
      Are you sure you want to delete category
      <span class="italic font-bold">
        `{model?.name ?? 'Unknown'}`
      </span>
      ?
    </h3>
    <div class="modal-action">
      <button type="button" class="btn btn-sm btn-error" on:click={submit} >
        Confirm
        </button>
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
