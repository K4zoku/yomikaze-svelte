<script lang="ts">
  import { type LibraryCategoryCreate } from '$models/LibraryCategory';
  import type LibraryCategory from '$models/LibraryCategory';
  import type { LibraryManagement } from '$utils/library-utils';
  import { onMount, tick } from 'svelte';
  import Sortable, { type SortableEvent } from 'sortablejs';

  import CreateOrUpdateCategory from './create-or-update-category.svelte';
  import DeleteCategory from './delete-category.svelte';
    import Icon from '$components/icon.svelte';

  export let libraryManagement: LibraryManagement;
  export let categories: LibraryCategory[]; // for live updating

  export function open() {
    categoryManagementModal.showModal();
  }

  let openCreateModal: () => Promise<void>;
  let model: LibraryCategory | LibraryCategoryCreate;
  let editMode: boolean;
  let handleOnModalSuccess = async (event: CustomEvent<LibraryCategory>) => {
    let model = event.detail;
    const index = categories.findIndex((c) => c.name === model.name);
    if (index !== -1) categories[index] = model as LibraryCategory;
    else categories.push(model as LibraryCategory);
    categories = [...categories]; // force update
    await tick();
  };

  let openDeleteModal: () => void;
  let deleteModel: LibraryCategory;
  let handleOnDeleteModalSuccess = async (event: CustomEvent<LibraryCategory>) => {
    if (event.detail) {
      const index = categories.findIndex((c) => c.id === event.detail.id);
      if (index !== -1) categories.splice(index, 1);
      categories = [...categories]; // force update
      await tick();
    }
  };

  let categoryManagementModal: HTMLDialogElement;
  let sortableList: HTMLDivElement;
  onMount(() => {
    new Sortable(sortableList, {
      animation: 150,
      ghostClass: 'bg-accent-100/50',
      dataIdAttr: 'data-id',
      onEnd: async ({oldIndex, newIndex}: SortableEvent) => {
        if (oldIndex === undefined || newIndex === undefined) return;
        const categoriesCopy = [...categories];
        const [removed] = categoriesCopy.splice(oldIndex, 1);
        categoriesCopy.splice(newIndex, 0, removed);
        await tick();
        categories = categoriesCopy;
      }
    });
  });
</script>

<!-- DIALOG CREATE PERSONAL CATEGORY -->
<CreateOrUpdateCategory
  {libraryManagement}
  bind:open={openCreateModal}
  bind:model
  bind:editMode
  on:success={handleOnModalSuccess}
/>
<DeleteCategory
  {libraryManagement}
  bind:open={openDeleteModal}
  bind:model={deleteModel}
  on:success={handleOnDeleteModalSuccess}
/>

<dialog bind:this={categoryManagementModal} class="modal">
  <div class="modal-box w-8/12 max-w-4xl">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold mb-2">Category Management</h3>
    <div class="flex justify-between items-center py-2">
      <p class="text-sm italic">
        Drag and drop to reorder
      </p>
      <button
        class="btn btn-sm"
        on:click={() => {
          editMode = false;
          model = {name: ''};
          openCreateModal();
        }}
      >
        <Icon icon="lucide--square-plus" class="text-xl" /> Create category
      </button>
    </div>
    <div bind:this={sortableList} class="flex flex-col gap-2 w-full items-center">
      {#each categories as category (category.id)}
        <div
          class="flex justify-between w-full btn-ghost p-2 rounded bg-base-200"
          data-id={category.id}
        >
          <div class="flex gap-2">
            <Icon icon="lucide--menu" class="handle flex text-2xl cursor-grab" />
            <span class="justify-center items-center">{category.name}</span>
          </div>
          <div class="flex gap-2">
            <button
              class="btn btn-sm btn-circle btn-ghost"
              on:click={() => {
                editMode = true;
                model = category;
                openCreateModal();
              }}
            >
              <Icon icon="lucide--edit" class="text-xl" />
            </button>
            <button
              class="btn btn-sm btn-circle btn-ghost hover:text-error transition-colors duration-100"
              on:click={() => {
                deleteModel = category;
                openDeleteModal();
              }}
            >
              <Icon icon="lucide--trash" class="text-xl" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</dialog>
