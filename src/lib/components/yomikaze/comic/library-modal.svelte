<script lang="ts">
  import Picture from '$components/picture.svelte';
  import type Comic from '$models/Comic';
  import type LibraryCategory from '$models/LibraryCategory';
  import type { LibraryEntryCreate } from '$models/LibraryEntry';
  import type LibraryEntry from '$models/LibraryEntry';
  import { delay } from '$utils/common';
  import type { LibraryManagement } from '$utils/library-utils';
  import { createEventDispatcher, onMount, tick } from 'svelte';

  const dispatch = createEventDispatcher();

  export let target: Comic;

  export const showModal = () => {
    onLoad().then(() => {
      modal.showModal();
    });
  };

  let modal: HTMLDialogElement;
  let confirmUnfollowModal: HTMLDialogElement;
  export let libraryManager: LibraryManagement;
  let libraryEntry: LibraryEntry;
  let isInLibrary: boolean = false;
  export let categories: LibraryCategory[] = [];

  async function getCategories(): Promise<LibraryCategory[]> {
    if (categories.length > 0) return categories;
    const response = await libraryManager.getCategories();
    categories = response.results;
    selectedCategories = [];
    return categories;
  }

  let selectedCategories: string[] = [];
  let description: string;

  let submitting = false;

  async function onLoad() {
    await libraryManager
      .getEntry(target.id)
      .then((entry) => {
        libraryEntry = entry;
        isInLibrary = true;
        selectedCategories = entry.categories.map((category) => category.id);
      })
      .catch(() => {
        isInLibrary = false;
      });
  }

  async function handleSubmit() {
    submitting = true;

    if (isInLibrary) {
      libraryEntry.categories.filter((category) => {
        if (!selectedCategories.includes(category.id)) {
          libraryManager
            .removeEntryFromCategory(target.id, category.id)
            .then(() => {
              dispatch('update');
            })
            .catch(() => {
              submitting = false;
            });
        }
      });
      await libraryManager
        .addEntryToCategories(target.id, selectedCategories)
        .then(() => {
          dispatch('update');
        })
        .catch(() => {
          submitting = false;
        });
    } else {
      let entry: LibraryEntryCreate = {
        comicId: target.id,
        categoryIds: selectedCategories,
      };
      await libraryManager
        .createEntry(entry)
        .then(() => {
          target.isFollowing = true;
          target.totalFollows = target.totalFollows ?? 0 + 1;
          target = target;
          dispatch('update');
        })
        .catch(() => {
          submitting = false;
        });
    }

    await tick();
    await delay(200);
    modal.close();
  }

  function handleOnClose() {
    description = '';
    submitting = false;
  }

  const handleButtonUnfollowClick = async () => {
    submitting = true;
    await libraryManager
      .deleteEntry(target.id)
      .then(() => {
        target.isFollowing = false;
        target.totalFollows = target.totalFollows ?? 1 - 1;
        target = target;
        dispatch('update');
      })
      .catch(() => {
        submitting = false;
      });
    await tick();
    await delay(200);
    confirmUnfollowModal.close();
    modal.close();
  };

  onMount(async () => {
    await onLoad();
  });
</script>

<dialog bind:this={modal} class="modal" on:close={handleOnClose}>
  <div class="modal-box">
    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">Add to library</h3>
    <h5 class="font-medium mb-2">Comic</h5>
    <div class="flex gap-4 items-center w-full bg-base-200 h-fit p-2 rounded">
      <Picture
        src={target.cover}
        alt="Cover"
        class="w-16 h-24 aspect-cover shrink-0 rounded"
        imgClass="w-full h-full rounded"
        useCdn={true}
      />
      <div class="flex flex-col h-full self-start items-start justify-start text-base font-medium">
        <span>{target.name}</span>
      </div>
    </div>
    <hr class="border-1 my-4" />
    <form id="library" class="mb-4" on:submit|preventDefault={handleSubmit}>
      <label for="library-category" class="block mb-2 font-medium">Library category</label>
      <select
        id="library-category"
        class="select select-bordered w-2/3 select-sm mb-4 focus:select-accent"
        multiple
        bind:value={selectedCategories}
        class:select-disabled={submitting}
      >
        {#await getCategories()}
          <option disabled selected>Loading...</option>
        {:then categories}
          <option disabled selected>Uncategorized</option>
          {#each categories as category (category.id)}
            <option value={category.id}>{category.name}</option>
          {/each}
        {/await}
      </select>
    </form>
    <div class="modal-action">
      <button
        type="submit"
        form="library"
        class="btn btn-sm btn-accent"
        class:btn-disabled={submitting}
      >
        {#if submitting}
          <span class="loading"></span>
        {:else}
          Save
        {/if}
      </button>
      {#if isInLibrary}
        <button
          type="button"
          class="btn btn-sm btn-error"
          class:btn-disabled={submitting}
          on:click={() => confirmUnfollowModal.showModal()}
        >
          {#if submitting}
            <span class="loading"></span>
          {:else}
            Unfollow
          {/if}
        </button>
      {/if}
      <form method="dialog" class="flex space-x-2">
        <button class="btn btn-sm">Close</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>Close</button>
  </form>
</dialog>

<dialog bind:this={confirmUnfollowModal} class="modal" on:close={handleOnClose}>
  <div class="modal-box">
    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">Unfollow comic</h3>
    <p class="text-base font-medium">Are you sure you want to unfollow this comic?</p>
    <div class="modal-action">
      <button
        type="button"
        class="btn btn-sm btn-error"
        class:btn-disabled={submitting}
        on:click={handleButtonUnfollowClick}
      >
        {#if submitting}
          <span class="loading"></span>
        {:else}
          Unfollow
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
