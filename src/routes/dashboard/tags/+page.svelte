<script lang="ts">
  import http from '$lib/utils/http';
  import { goto } from '$app/navigation';
  import { getContext, onMount, tick } from 'svelte';
  import type Tag from '$models/Tag';
  import type TagCategory from '$models/TagCategory';

  import type { AxiosError } from 'axios';
  import type Problem from '$models/ProblemResponse.js';
    import type { Writable } from 'svelte/store';
    import type { ToastProps } from '~/routes/+layout.svelte';

  let tags: Array<Tag> = [];
  let tagToDelete: Tag | null = null;
  let tagToEdit: Tag | null = null;
  let tagName = '';
  let deleteModal;
  let addModal;
  let editModal;
  let categories: Array<TagCategory> = [];
  let categoryId: string = '';
  let tagNameInput: string = '';
  let tagDescription: string = '';
  let tagEditNameInput: string = '';
  let tagEditDescription: string = '';

  let tagNameErr = '';
  let categoryErr = '';
  let descriptionErr = '';
  let error = '';
  let message = '';

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/'); // Điều hướng về trang chủ nếu không có lịch sử
    }
  }

  async function getCategory() {
    try {
      const response = await http.get('/tags/categories');
      categories = response.data.results;
      categoryName = response.data.results.name;
    } catch {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  async function fetchTags(size = 100) {
    try {
      const response = await http.get('/tags', {
        params: {
          Size: size
        }
      });

      tags = response.data.results; // Lưu tags vào biến
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  async function deleteTag(key: string | bigint) {
    try {
      const response = await http.delete(`/tags/${key}`);

      tags = tags.filter((tag) => tag.id !== key);

      message = 'Tag deleted successfully'
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      }
    } finally {
      tagToDelete = null;
      tagName = '';
      deleteModal.close();
    }
  }

  const createTag = async () => {
    const payload = {
      categoryId: categoryId,
      name: tagNameInput,
      description: tagDescription
    };
    console.log('Payload:', payload);

    try {
      const response = await http.post('/tags', payload);
      console.log('Response:', response);

      tags.push(response.data);

      message = 'Tag created successfully';
      tagNameInput = '';
      tagDescription = '';
      categoryId = '';
      addModal.close();
    } catch (error) {
      const axiosError = error as AxiosError;
      const { response } = axiosError;
      if (response && response.status === 400) {
        let data = response.data as Problem;
        for (let key of Object.keys(data.errors)) {
          switch (key) {
            case 'Name':
              tagNameErr = data.errors[key].at(0) ?? '';
              break;
            case 'CategoryId':
              categoryErr = data.errors[key].at(0) ?? '';
              break;
            case 'Description':
              descriptionErr = data.errors[key].at(0) ?? '';
              break;
            default:
              error = 'An unknown error occurred';
              alert(error);
              tick();
              break;
          }
        }
      } else {
        error = 'An unknown error occurred';
      }
    }
  };

  const updateTag = async () => {
    if (!tagToEdit) return;

    const payload = [
      { op: 'replace', path: '/name', value: tagEditNameInput },
      { op: 'replace', path: '/description', value: tagEditDescription }
    ];
    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await http.patch(`/tags/${tagToEdit.id}`, payload);
      console.log('Response:', response);

      const index = tags.findIndex((tag) => tag.id === tagToEdit.id);
      if (index !== -1) {
        tags[index] = response.data;
      }

      addToast('Tag updated successfully')
      // message = 'Tag updated successfully'
      tagToEdit = null;
      tagEditNameInput = '';
      tagEditDescription = '';
      editModal.close();
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      }
    }
  };

  function openDeleteModal(tag) {
    tagToDelete = tag.id;
    tagName = tag.name;
    deleteModal.showModal();
  }

  function openAddModal() {
    addModal.showModal();
  }

  function openEditModal(tag) {
    tagToEdit = tag;
    tagEditNameInput = tag.name;
    tagEditDescription = tag.description;
    editModal.showModal();
  }

  const toasts = getContext<Writable<ToastProps[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [...toasts, { message, color: 'alert-success', icon: 'lucide--circle-check-big' }]);
  }

  onMount(() => {
    fetchTags();
    getCategory();
  });
</script>

<div class="container mx-auto mt-16">
  <div class="flex my-3 gap-2 pb-10 border-b border-accent-content">
    <button on:click={goBack}>
      <span class="iconify lucide--arrow-left text-5xl"></span>
    </button>
    <div>
      <span class="text-3xl font-semibold">Tags Management</span>
    </div>
    <hr />
  </div>

  <div>
    <div class="p-4">
      <div class="flex justify-between">
        <span class="text-2xl font-bold">List of tags</span>
        <button class="btn btn-success btn-sm" on:click={() => openAddModal()}
          ><span class="text-secondary-content">Create New Tag</span></button
        >
      </div>

      <div class="mt-6">
        <table class="table lg:table-lg sm:table-sm xs:table-xs md:table-md">
          <thead>
            <tr class="text-base font-medium">
              <th>Tag</th>
              <th class="flex my-auto gap-2">
                <span class="my-auto">Category</span>
              </th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {#each tags as tag (tag.id)}
              <tr>
                <td><span class="badge badge-outline text-base font-semibold">{tag.name}</span></td>
                <td><span class="font-semibold text-base">{tag.category.name}</span></td>
                <td class="text-lg min-w-20 max-w-96">{tag.description}</td>
                <td class="flex gap-4">
                  <div class="tooltip tooltip-top" data-tip="Edit">
                    <button class="btn btn-sm btn-circle" on:click={() => openEditModal(tag)}>
                      <span class="iconify lucide--square-pen text-xl"></span>
                    </button>
                  </div>

                  <div class="tooltip tooltip-top" data-tip="Delete">
                    <button class="btn btn-sm btn-circle" on:click={() => openDeleteModal(tag)}>
                      <span class="iconify lucide--trash-2 text-xl"></span>
                    </button>
                  </div>
                  
                  
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!--! modal delete tag -->
<dialog id="delete_modal" bind:this={deleteModal} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Confirm Deletion</h3>
    <p class="py-4">Are you sure you want to delete the tag "<strong>{tagName}</strong>"?</p>
    <div class="modal-action">
      <button class="btn btn-error btn-sm" on:click={() => deleteTag(tagToDelete)}>Confirm</button>
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>

<!--! modal create tag -->
<dialog id="delete_modal" bind:this={addModal} class="modal">
  <div class="modal-box">
    <div class="text-center">
      <h2 class="text-2xl mb-4 font-bold">Create Tag</h2>
    </div>
    <form on:submit|preventDefault={createTag}>
      {#if !!error}
        <div role="alert" class="alert alert-error text-sm p-2">
          <span class="iconify lucide--circle-x text-xl"></span>
          <span>{error}</span>
        </div>
      {/if}
      <div class="flex gap-5">
        <label class="form-control">
          <div class="label">
            <span class="label-text">Tag Name</span>
          </div>
          <div class="input input-bordered flex items-center">
            <input type="text" bind:value={tagNameInput} />
          </div>
          {#if !!tagNameErr}
            <div class="label">
              <span class="label-text text-error">{tagNameErr}</span>
            </div>
          {/if}
        </label>

        <label class=" form-control">
          <div class="label">
            <span class="label-text">Category</span>
          </div>

          <select bind:value={categoryId} class="select w-56 select-bordered">
            <option disabled selected>Select Category</option>
            {#each categories as category (category.id)}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>

          {#if !!categoryErr}
            <div class="label">
              <span class="label-text text-error">{categoryErr}</span>
            </div>
          {/if}
        </label>
      </div>
      <label class="flex flex-col mb-4 gap-3 form-control">
        <div class="label">
          <span class="label-text">Description</span>
        </div>

        <div>
          <textarea
            placeholder="Add description here ..."
            class="textarea textarea-bordered w-full h-28"
            bind:value={tagDescription}
          ></textarea>
        </div>

        {#if !!descriptionErr}
          <div class="label">
            <span class="label-text text-error">{descriptionErr}</span>
          </div>
        {/if}
      </label>
    </form>

    <div class="modal-action">
      <form on:submit|preventDefault={createTag}>
        <button type="submit" class="btn btn-success btn-sm">Add</button>
      </form>

      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>

<!--! modal edit tag -->
<dialog id="edit_modal" bind:this={editModal} class="modal">
  <div class="modal-box">
    <div class="text-center">
      <h2 class="text-2xl mb-4 font-bold">Edit Tag</h2>
    </div>
    <form on:submit|preventDefault={updateTag}>
      <label class=" form-control">
        <div class="label">
          <span class="label-text">Tag Name</span>
        </div>
        <div class="input input-bordered flex items-center w-full">
          <input id="tag-name" type="text" bind:value={tagEditNameInput} />
        </div>
      </label>

      <label class=" form-control">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <textarea
          placeholder="Add description here ..."
          class="textarea textarea-bordered w-full h-28"
          bind:value={tagEditDescription}
        ></textarea>
      </label>
    </form>

    <div class="modal-action">
      <form on:submit|preventDefault={updateTag}>
        <button type="submit" class="btn btn-success btn-sm">Update</button>
      </form>

      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>

<!-- {#if !!message}
<div class="toast toast-end">
  <div class="alert alert-success">
    <span>{message}</span>
  </div>
</div>
{/if} -->