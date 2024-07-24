<script lang="ts">
  import Icon from '$components/icon.svelte';
  import type LibraryCategory from '$models/LibraryCategory';
  import type { LibraryCategoryCreate } from '$models/LibraryCategory';
  import type Problem from '$models/ProblemResponse';
  import type { LibraryManagement } from '$utils/library-utils';
  import type { AxiosError } from 'axios';
  import { tick } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let modal: HTMLDialogElement;

  export let model: LibraryCategory | LibraryCategoryCreate = { name: '' };

  export let editMode: boolean = false;

  export let libraryManagement: LibraryManagement;

  export function open() {
    modal.showModal();
  }

  export function close() {
    modal.close();
  }

  let sumitting = false;
  let error = '';
  let unknownError = '';
  async function submit() {
    if (sumitting) return;
    sumitting = true;
    try {
      if (editMode) {
        await libraryManagement.updateCategory(model as LibraryCategory);
      } else {
        model = await libraryManagement.createCategory(model as LibraryCategoryCreate);
      }
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
      unknownError = 'An unknown error occurred';
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
  <div class="modal-box">
    <h3 class="text-lg font-bold">
      {editMode ? 'Edit Category' : 'Create Category'}
    </h3>
    {#if !!unknownError}
      <div class="bg-error text-error-content rounded py-2 px-4 flex items-center gap-2 mt-2 mb-4">
        <Icon icon="lucide--alert-circle" class="text-lg" />
        {unknownError}
      </div>
    {/if}
    <label
      class="mt-2 input input-bordered input-sm w-full flex items-center gap-2"
      class:input-error={!!error}
      class:input-disabled={sumitting}
    >
      <Icon icon="lucide--tag" class="text-lg" />
      <input type="text" placeholder="Type here" bind:value={model.name} />
      {#if !!error}
        <div class="label">
          <span class="label-text-alt text-sm text-error">{error}</span>
        </div>
      {/if}
    </label>
    <div class="modal-action">
      <button
        type="button"
        class="btn btn-accent btn-sm"
        class:btn-disabled={sumitting}
        on:click={submit}
      >
        {editMode ? 'Save' : 'Create'}
      </button>
      <form method="dialog">
        <button class="btn btn-sm">Close</button>
      </form>
    </div>
  </div>
</dialog>
