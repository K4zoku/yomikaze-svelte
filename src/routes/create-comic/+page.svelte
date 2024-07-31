<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import http from '$lib/utils/http';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Swap from '$components/daisyui/actions/swap.svelte';
  import httpImage from '$lib/utils/httpImage.js';
  import { debounce } from '$utils/common';
  import type { TagCategoryExtended } from '$utils/tag-utils';
  import { groupByCategory } from '$utils/tag-utils';

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/'); // Navigate to homepage if no history available
    }
  }

  let imageUrl = '';
  let bannerImageUrl = '';
  let fileInputRef;
  let bannerFileInputRef;
  let names = writable([]);
  let showInput = writable(false);
  let newName = '';
  let title = '';
  let anotherTitle = '';
  let description = '';
  let selectedAuthors = writable([]);

  let tags = [];
  let categorizedTags: Record<string, TagCategoryExtended> = {};
  let selectedTags: Set<string> = new Set();
  let tagSearch: string = '';
  let filteredTags: Record<string, TagCategoryExtended> = {};

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('File', file);

        const response = await httpImage.post('/images', formData);
        if (response.status === 201) {
          imageUrl = response.data.images[0]; // Assuming imageUrl is returned from server as string URL
        } else {
          console.error('Failed to upload image:', response.data);
          alert('Failed to upload image. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('An error occurred while uploading image.');
      }
    }
  }

  async function handleBannerFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('File', file);

        const response = await httpImage.post('/images', formData);
        if (response.status === 201) {
          bannerImageUrl = response.data.images[0]; // Assuming bannerImageUrl is returned from server as string URL
        } else {
          console.error('Failed to upload banner:', response.data);
          alert('Failed to upload banner. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading banner:', error);
        alert('An error occurred while uploading banner.');
      }
    }
  }

  function triggerFileInput() {
    fileInputRef.click();
  }

  function triggerBannerFileInput() {
    bannerFileInputRef.click();
  }

  function handleAddName() {
    if (newName.trim()) {
      names.update((n) => [...n, newName.trim()]);
      newName = '';
      showInput.set(false);
    }
  }

  function toggleInput() {
    showInput.update((value) => !value);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleAddName();
    }
  }

  // Close the input when clicking outside
  onMount(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        showInput.set(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  async function createComic() {
    // Ensure imageUrl and bannerImageUrl are updated with string URLs from httpImage
    const payload = {
      name: title,
      aliases: anotherTitle ? [anotherTitle] : [],
      description: description,
      cover: imageUrl,
      banner: bannerImageUrl,
      publicationDate: new Date().toISOString(),
      authors: $names,
      status: 'OnGoing',
      tagIds: Array.from(selectedTags)
    };

    console.log('Payload:', payload);

    try {
      const response = await http.post('/comics', payload);
      console.log('Response:', response);

      title = '';
      anotherTitle = '';
      description = '';
      imageUrl = '';
      bannerImageUrl = '';
      $names = [];
      selectedTags = new Set();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the comic.');
    }
  }

  function loadComic() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/');
    }
    createComic();
  }

  onMount(async (size = 1000) => {
    const tagResponse = await http.get('/tags', {
      params: {
        Size: size
      }
    });
    tags = tagResponse.data.results;
    categorizedTags = groupByCategory(tags);
    filteredTags = categorizedTags;
  });

  function handleTagChange(tagId: string, isActive: boolean) {
    // console.log(`Tag ID: ${tagId}, New State: ${newState}`); , newState: boolean
    if (isActive) {
      selectedTags.add(tagId);
    } else {
      selectedTags.delete(tagId);
    }
    updateSelectedTagNames();
  }

  function updateSelectedTagNames() {
    selectedTagNames = Array.from(selectedTags)
      .map((tagId) => tags.find((tag) => tag.id === tagId)?.name)
      .filter(Boolean)
      .join(', ');
  }

  let selectedTagNames = '';

  $: selectedTagNames = Array.from(selectedTags)
    .map((tagId) => tags.find((tag) => tag.id === tagId)?.name)
    .filter(Boolean)
    .join(', ');

  function filterTags() {
    if (tagSearch.trim() === '') {
      filteredTags = categorizedTags;
      return;
    }
    const searchLower = tagSearch.toLowerCase();
    filteredTags = {};
    for (const [category, data] of Object.entries(categorizedTags)) {
      const filteredCategoryTags = data.tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchLower)
      );
      if (filteredCategoryTags.length > 0) {
        filteredTags[category] = { ...data, tags: filteredCategoryTags };
      }
    }
  }

  const debouncedFilterTags = debounce(() => {
    filterTags();
  }, 300);

  function handleInput(event: Event) {
    tagSearch = (event.target as HTMLInputElement).value;
    debouncedFilterTags();
  }

  // Reset selected tags
  function resetTags() {
    selectedTags = new Set();
    updateSelectedTagNames();
  }
</script>

<div class="mt-20 mx-auto w-11/12">
  <div class="flex my-3 gap-2">
    <button on:click={goBack}>
      <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m12 19l-7-7l7-7m7 7H5"
        />
      </svg>
    </button>
    <div>
      <span class="text-3xl font-semibold">Create Comic</span>
    </div>
  </div>

  <form on:submit|preventDefault={createComic}>
    <div class="flex flex-col gap-2 mt-10">
      <span class="text-2xl font-semibold ml-16">Banner of Comic</span>
      <div
        class="w-full h-96 border-2 border-accent border-dashed flex justify-center cursor-pointer"
        on:click={triggerBannerFileInput}
      >
        {#if bannerImageUrl}
          <img
            src={httpImage.defaults.baseURL + bannerImageUrl}
            alt="Selected Image"
            class="w-full h-full object-cover"
          />
        {:else}
          <svg
            class="place-self-center"
            xmlns="http://www.w3.org/2000/svg"
            width="3em"
            height="3em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14m-7-7v14"
            />
          </svg>
        {/if}
        <input
          type="file"
          class="hidden"
          bind:this={bannerFileInputRef}
          on:change={handleBannerFileChange}
          accept="image/*"
        />
      </div>
    </div>

    <div class="flex gap-40 mt-10 ml-16">
      <div class="flex flex-col gap-2">
        <div><span class="text-2xl font-semibold">Cover of Comic</span></div>
        <div class="flex gap-3">
          <div
            class="w-48 h-64 border-2 border-accent border-dashed flex justify-center cursor-pointer"
            on:click={triggerFileInput}
          >
            {#if imageUrl}
              <img
                src={httpImage.defaults.baseURL + imageUrl}
                alt="Selected Image"
                class="w-full h-full object-cover"
              />
            {:else}
              <svg
                class="place-self-center"
                xmlns="http://www.w3.org/2000/svg"
                width="3em"
                height="3em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14m-7-7v14"
                />
              </svg>
            {/if}
            <input
              type="file"
              class="file-input hidden"
              bind:this={fileInputRef}
              on:change={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-52">
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-2">
            <span class="text-xl font-semibold">Title</span>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-72 max-w-xs"
              bind:value={title}
            />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xl font-semibold">Tags</span>
            <!-- <Tags></Tags> -->

            <details class="dropdown">
              <summary
                id="tags"
                class="flex input input-bordered focus:input-accent bg-base-100 font-normal justify-start tooltip select-none"
                data-tip={selectedTagNames || 'Include any'}
              >
                <div class="w-full h-full flex justify-start items-center">
                  <span class="text-nowrap overflow-hidden text-ellipsis max-w-full select-none">
                    {selectedTagNames || 'Include any'}
                  </span>
                </div>
              </summary>

              <div
                class="dropdown-content z-50 bg-base-100 p-4 rounded shadow-lg mt-2 w-192 max-h-96 select-none flex flex-col gap-2 overflow-x-auto"
              >
                <div class="flex items-center gap-2 w-full py-2 h-fit shrink-0 justify-end">
                  <label
                    class="input input-bordered input-sm focus-within:input-accent flex items-center gap-1 grow"
                  >
                    <Icon icon="lucide--tag" class="text-xl shrink-0" />
                    <input
                      class="grow"
                      placeholder="Search tag"
                      bind:value={tagSearch}
                      on:input={handleInput}
                    />
                  </label>
                  <button class="btn btn-sm active:btn-accent shrink-0" on:click={resetTags}>
                    Reset tag filter
                  </button>
                </div>
                {#if Object.keys(filteredTags).length > 0}
                  {#each Object.entries(filteredTags) as [category, { name, tags }]}
                    <div class=" p-1 rounded-lg">
                      <div class="flex gap-2 items-center">
                        <h2 class="text-xl font-bold mb-2">{name}</h2>
                        <hr class="border-1 my-4 flex-grow" />
                      </div>

                      <ul class="list-disc pl-5 flex flex-wrap gap-2">
                        {#each tags as tag}
                          <Swap
                            on={selectedTags.has(tag.id)}
                            on:change={() => handleTagChange(tag.id, !selectedTags.has(tag.id))}
                          >
                            <span slot="on" class="badge badge-outline badge-success"
                              >{tag.name}</span
                            >
                            <span slot="off" class="badge badge-outline badge-neutral"
                              >{tag.name}</span
                            >
                          </Swap>
                        {/each}
                      </ul>
                    </div>
                  {/each}
                {/if}
              </div>
            </details>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div>
            <span class="text-xl font-semibold">Aliases</span>
            <span class="text-base text-neutral-content font-bold">(optional)</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            class="input input-bordered w-72 max-w-lg"
            bind:value={anotherTitle}
          />
          <div class="flex flex-col mt-8 gap-2">
            <span class="text-xl font-semibold">Author</span>
            <div class="dropdown relative w-full max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Any"
                class="input input-bordered w-72 max-w-xs"
                on:click={toggleInput}
                value={$names.join(', ')}
              />
              {#if $showInput}
                <div class="absolute mt-2 w-full z-10">
                  <input
                    type="text"
                    class="input input-bordered w-full"
                    bind:value={newName}
                    on:keypress={handleKeyPress}
                    placeholder="Enter a name and press Enter"
                    autofocus
                  />
                </div>
              {/if}
            </div>
          </div>
          <!-- <div class="flex flex-col mt-8 gap-2">
						<span class="text-base-content font-medium text-xl">Publication Date</span>
						<input type="date" placeholder="Any" class="input input-bordered w-full max-w-xs" />
					</div> -->
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-8 mt-10 ml-16">
      <span class="text-2xl font-semibold">Description</span>
      <div class="form-control">
        <textarea
          placeholder="Add Description Here ..."
          class="textarea textarea-bordered textarea-lg w-full max-w-full h-64"
          bind:value={description}
        ></textarea>
      </div>
      <div class="flex justify-end gap-3 mb-10">
        <button type="button" class="btn btn-wide text-lg font-semibold" on:click={goBack}
          >Cancel</button
        >
        <button
          type="submit"
          on:click={loadComic}
          class="btn btn-warning btn-wide text-lg font-semibold">Create Comic</button
        >
        <button type="submit" class="btn btn-warning btn-wide text-lg font-semibold"
          >Create Others Comic</button
        >
      </div>
    </div>
  </form>
</div>
