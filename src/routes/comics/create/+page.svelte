<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type Comic from '$models/Comic';
  import { ComicStatus, type ComicCreate } from '$models/Comic';
  import type Tag from '$models/Tag';
  import { debounce } from '$utils/common';
  import http from '$utils/http';
  import { uploadImage } from '$utils/image-utils';
  import type { CategorizedTags } from '$utils/tag-utils';
  import { onDestroy } from 'svelte';

  export let data;
  let { token, categorizedTags } = data;
  http.defaults.headers.common.Authorization = `Bearer ${token}`;

  const DEFAULTS: ComicCreate = {
    name: '',
    aliases: [''],
    description: '',
    cover: '',
    banner: '',
    publicationDate: '',
    authors: [''],
    status: ComicStatus.Pending,
    tagIds: []
  };

  let comic: ComicCreate = { ...DEFAULTS };
  function reset() {
    comic = { ...DEFAULTS };
    bannerFile = null;
    bannerUrl = null;
    coverFile = null;
    coverUrl = null;
    aliases = [''];
    authors = [''];
    selectedTags = [];
  }

  async function createComic() {
    comic.banner = bannerUrl || undefined;
    comic.cover = coverUrl || '';
    const response = await http.post('/comics', comic);
    const createdComic: Comic = response.data;
    goto(`/comics/${createdComic.id}`);
  }

  let bannerFile: File | null = null;
  let bannerUrl: string | null = null;
  let bannerTask: Promise<void> = Promise.resolve();

  $: if (bannerFile) {
    bannerUrl = URL.createObjectURL(bannerFile);
    bannerTask = uploadImage(bannerFile).then((url) => {
      bannerUrl = url;
    });
  }

  let coverFile: File | null = null;
  let coverUrl: string | null = null;
  let coverTask: Promise<void> = Promise.resolve();

  $: if (coverFile) {
    coverUrl = URL.createObjectURL(coverFile);
    coverTask = uploadImage(coverFile).then((url) => {
      coverUrl = url;
    });
  }

  let aliases: string[] = [''];
  $: {
    comic.aliases = aliases.filter((alias) => alias.trim() !== '');
  }
  let aliasesDisplay: string;
  $: aliasesDisplay =
    comic.aliases.length === 0 ? 'Click to add aliases' : comic.aliases.join('; ');

  let authors: string[] = [''];
  $: {
    comic.authors = authors.filter((author) => author.trim() !== '');
  }
  let authorsDisplay: string;
  $: {
    const authors = comic.authors;
    if (authors.length === 0) {
      authorsDisplay = 'Click to add authors';
    } else if (authors.length === 1) {
      authorsDisplay = authors[0];
    } else if (authors.length === 2) {
      authorsDisplay = authors.join(' and ');
    } else if (authors.length === 3) {
      authorsDisplay = authors.slice(0, 2).join(', ') + ' and ' + authors[2];
    } else {
      authorsDisplay =
        authors.length <= 3
          ? authors.join(', ')
          : `${authors.slice(0, 3).join(', ')} and ${authors.length - 3} more`;
    }
  }

  let selectedTags: Tag[] = [];
  let selectedTagsDisplay: string;
  $: selectedTagsDisplay =
    selectedTags.length === 0
      ? 'Click to add tags'
      : selectedTags.map((tag) => tag.name).join(', ');
  $: comic.tagIds = selectedTags.map((tag) => tag.id);
  let tagSearch: string = '';
  let filteredTags: CategorizedTags = categorizedTags;
  function filterTags() {
    if (tagSearch.trim() === '') {
      filteredTags = categorizedTags;
      return;
    }
    filteredTags = {};
    for (const [category, data] of Object.entries(categorizedTags)) {
      const filteredCategoryTags = data.tags.filter((tag) =>
        tag.name.toLowerCase().includes(tagSearch.toLowerCase())
      );
      if (filteredCategoryTags.length > 0) {
        filteredTags[category] = { ...data, tags: filteredCategoryTags };
      }
    }
  }
  const [debouncedFilterTags, destroyFilterTags] = debounce<void>(filterTags, 300);
  onDestroy(() => destroyFilterTags());
</script>

<Sublayout pageName="Create comic">
  <div class="flex flex-col gap-9 px-10 min-w-[0] pb-8 container-80">
    <!-- Banner -->
    <div class="flex flex-col gap-2 min-w-[0]">
      <label for="banner-input" class="font-medium">Banner image</label>
      <div class="indicator w-full h-fit">
        {#await bannerTask}
          <div class="indicator-item indicator-center indicator-middle">
            <span class="loading loading-lg bg-base-100"></span>
          </div>
        {/await}
        {#if bannerUrl}
          <div class="indicator-item indicator-top indicator-end">
            <button class="btn btn-error btn-circle btn-sm" on:click={() => (bannerUrl = null, comic ? comic.banner = undefined : null)}>
              <Icon icon="lucide--trash" class="text-lg" />
            </button>
          </div>
        {/if}
        <label
          class="w-full h-80 flex justify-center cursor-pointer
          border-2 border-dashed hover:border-accent 
          bg-base-200 hover:bg-base-300
          rounded transition-colors duration-500"
        >
          <input
            id="banner-input"
            type="file"
            class="hidden"
            on:change={(event) =>
              event.currentTarget.files?.length && (bannerFile = event.currentTarget.files[0])}
            accept="image/*"
          />
          {#if bannerUrl}
            <Picture
              src={bannerUrl}
              useCdn={true}
              class="w-full h-full"
              imgClass="w-full h-full object-cover object-top rounded"
            />
          {:else}
            <div class="flex w-full h-full items-center justify-center gap-2 flex-col">
              <Icon icon="lucide--cloud-upload" class="place-self-center text-5xl" />
              <div class="text-center">
                <span class="text-lg">Click to upload</span>
              </div>
            </div>
          {/if}
        </label>
      </div>
    </div>

    <div class="flex gap-9 w-full max-w-full min-w-[0]">
      <!-- Cover -->
      <div class="flex flex-col gap-2 shrink-0">
        <label for="cover-input" class="font-medium">
          Cover image
          <span class="text-error">*</span>
        </label>
        <div class="indicator w-full h-fit">
          {#await coverTask}
            <div class="indicator-item indicator-center indicator-middle">
              <span class="loading loading-lg bg-base-100"></span>
            </div>
          {/await}
          <label
            class="w-48 h-fit aspect-cover flex justify-center cursor-pointer
            border-2 border-dashed hover:border-accent 
            bg-base-200 hover:bg-base-300
            rounded transition-colors duration-500"
          >
            <input
              id="cover-input"
              type="file"
              class="hidden"
              on:change={(event) =>
                event.currentTarget.files?.length && (coverFile = event.currentTarget.files[0])}
              accept="image/*"
            />
            {#if coverUrl}
              <Picture
                src={coverUrl}
                useCdn={true}
                class="w-full h-full"
                imgClass="w-full h-full object-cover object-top rounded"
              />
            {:else}
              <div class="flex w-full h-full items-center justify-center gap-2 flex-col">
                <Icon icon="lucide--cloud-upload" class="place-self-center text-5xl" />
                <div class="text-center">
                  <span class="text-lg">Click to upload</span>
                </div>
              </div>
            {/if}
          </label>
        </div>
      </div>

      <!-- Comic Information -->
      <div class="flex flex-col gap-9 w-full max-w-full min-w-[0]">
        <!-- Name -->
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium">
            Name
            <span class="text-error">*</span>
          </label>
          <input
            id="name"
            type="text"
            class="input input-bordered focus:input-accent"
            placeholder="Enter comic name here"
            bind:value={comic.name}
          />
        </div>
        <!-- Aliases & Authors -->
        <div class="flex gap-9 min-w-[0] max-w-full">
          <!-- Aliases -->
          <div class="flex flex-col gap-2 basis-3/5 min-w-[0]">
            <label for="aliases" class="font-medium">Aliases</label>
            <details
              class="dropdown max-w-full"
              on:close={() => (aliases = [...aliases.filter((alias) => alias.trim() !== ''), ''])}
            >
              <summary
                class="flex input input-bordered focus:input-accent bg-base-100 justify-start tooltip select-none max-w-full min-w-[0]"
                class:text-neutral={comic.aliases.length === 0}
              >
                <div class="w-full max-w-full h-full flex justify-start items-center min-w-[0]">
                  <span
                    class="text-nowrap overflow-hidden text-ellipsis max-w-full grow-0 select-none"
                  >
                    {aliasesDisplay}
                  </span>
                </div>
              </summary>
              <div
                class="dropdown-content bg-base-100 rounded shadow w-full mt-2 flex flex-col gap-2 max-h-40 overflow-y-scroll p-2 z-20"
              >
                {#each aliases as _, index}
                  <div class="flex gap-2 w-full">
                    <input
                      type="text"
                      class="input input-bordered focus:input-accent input-sm grow"
                      placeholder="Enter alias here"
                      bind:value={aliases[index]}
                      on:paste={(event) => {
                        if (event.clipboardData) {
                          const text = event.clipboardData.getData('text/plain');
                          if (text.includes(';')) {
                            aliases = [
                              ...aliases.filter((alias) => alias.trim() !== ''),
                              ...text.split(';').filter((alias) => alias.trim() !== '')
                            ];
                            if (aliases.length === 0) aliases = [''];
                          }
                        }
                      }}
                      on:keydown={(event) => {
                        if (event.key === ',') {
                          event.preventDefault();
                          aliases = [...aliases, ''];
                        }
                      }}
                    />
                    <div class="join shrink-0">
                      <button
                        type="button"
                        class="btn btn-sm join-item"
                        class:btn-disabled={aliases.some((alias) => alias.trim() === '')}
                        class:text-neutral={aliases.some((alias) => alias.trim() === '')}
                        class:text-success={aliases.every((alias) => alias.trim() !== '')}
                        on:click={() =>
                          (aliases = [
                            ...aliases.slice(0, index + 1),
                            '',
                            ...aliases.slice(index + 1)
                          ])}
                      >
                        <Icon icon="lucide--plus" class="text-lg" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm join-item"
                        class:btn-disabled={aliases.length <= 1}
                        class:text-error={aliases.length > 1}
                        class:text-neutral={aliases.length <= 1}
                        on:click={() => (aliases = aliases.filter((_, i) => i !== index))}
                      >
                        <Icon icon="lucide--x" class="text-lg" />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </details>
          </div>
          <!-- Authors -->
          <div class="flex flex-col gap-2 basis-2/5 min-w-[0]">
            <label for="authors" class="font-medium">Authors</label>
            <details
              class="dropdown"
              on:close={() => (authors = [...authors.filter((author) => author.trim() !== ''), ''])}
            >
              <summary
                class="flex input input-bordered focus:input-accent bg-base-100 justify-start tooltip select-none min-w-[0]"
                class:text-neutral={comic.authors.length === 0}
              >
                <div class="w-full h-full flex justify-start items-center min-w-[0]">
                  <span class="text-nowrap overflow-hidden text-ellipsis max-w-full select-none">
                    {authorsDisplay}
                  </span>
                </div>
              </summary>
              <div
                class="dropdown-content bg-base-100 rounded shadow w-full mt-2 flex flex-col gap-2 max-h-40 overflow-y-scroll p-2 z-20"
              >
                {#each authors as _, index}
                  <div class="flex gap-2 w-full">
                    <input
                      type="text"
                      class="input input-bordered focus:input-accent input-sm grow"
                      placeholder="Enter author name here"
                      bind:value={authors[index]}
                      on:paste|preventDefault={(event) => {
                        if (event.clipboardData) {
                          const text = event.clipboardData.getData('text/plain');
                          if (text.includes(',')) {
                            authors = [
                              ...authors.filter((author) => author.trim() !== ''),
                              ...text.split(',').filter((author) => author.trim() !== '')
                            ];
                            if (authors.length === 0) authors = [''];
                          }
                        }
                      }}
                      on:keydown={(event) => {
                        if (event.key === ',') {
                          event.preventDefault();
                          authors = [...authors, ''];
                        }
                      }}
                    />
                    <div class="join shrink-0">
                      <button
                        type="button"
                        class="btn btn-sm join-item"
                        class:btn-disabled={authors.some((author) => author.trim() === '')}
                        class:text-neutral={authors.some((author) => author.trim() === '')}
                        class:text-success={authors.every((author) => author.trim() !== '')}
                        on:click={() =>
                          (authors = [
                            ...authors.slice(0, index + 1),
                            '',
                            ...authors.slice(index + 1)
                          ])}
                      >
                        <Icon icon="lucide--plus" class="text-lg" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm join-item"
                        class:btn-disabled={authors.length <= 1}
                        class:text-error={authors.length > 1}
                        class:text-neutral={authors.length <= 1}
                        on:click={() => (authors = authors.filter((_, i) => i !== index))}
                      >
                        <Icon icon="lucide--x" class="text-lg" />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </details>
          </div>
        </div>
        <!-- Tags & Status & Publication Date -->
        <div class="flex gap-9 min-w-[0] max-w-full">
          <!-- Tags -->
          <div class="flex flex-col gap-2 basis-2/4 min-w-[0]">
            <label for="tags" class="font-medium">Tags</label>
            <details class="dropdown">
              <summary
                id="tags"
                class="flex items-center input input-bordered focus:input-accent bg-base-100 font-normal justify-start tooltip select-none"
                data-tip={selectedTagsDisplay}
              >
                <div
                  class="text-nowrap overflow-hidden text-ellipsis max-w-full w-full select-none text-left flex gap-1"
                  class:text-neutral={selectedTags.length === 0}
                >
                  {#each selectedTags as tag, index}
                    <span class="badge badge-outline badge-accent">
                      {tag.name}
                    </span>
                  {:else}
                    {selectedTagsDisplay}
                  {/each}
                </div>
              </summary>

              <div
                class="dropdown-content z-50 bg-base-100 p-4 rounded
                shadow-lg mt-2 w-[140%] max-h-64 select-none flex flex-col gap-2"
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
                      on:input={() => debouncedFilterTags()}
                    />
                  </label>
                  <button
                    type="button"
                    class="btn btn-sm active:btn-accent shrink-0"
                    on:click={() => (selectedTags = [])}
                  >
                    Reset tags
                  </button>
                </div>
                <div class="flex flex-col gap-4 overflow-y-scroll overflow-x-hidden max-h-full">
                  {#each Object.entries(categorizedTags) as [category, { name, tags }]}
                      <div class=" p-1 rounded-lg" class:hidden={!(category in filteredTags)}>
                        <div class="flex gap-2 items-center">
                          <h2 class="text-xl font-bold mb-2">{name}</h2>
                          <hr class="border-1 my-4 flex-grow" />
                        </div>

                        <div class="flex flex-wrap gap-2">
                          {#each tags as tag (tag.id)}
                            <label class="swap" class:hidden={!(tag.name.toLowerCase().includes(tagSearch.toLowerCase()))}>
                              <input type="checkbox" bind:group={selectedTags} value={tag} />
                              <span class="swap-off badge badge-outline badge-neutral"
                                >{tag.name}</span
                              >
                              <span class="swap-on badge badge-outline badge-accent"
                                >{tag.name}</span
                              >
                            </label>
                          {/each}
                        </div>
                      </div>
                  {/each}
                </div>
              </div>
            </details>
          </div>
          <!-- Status -->
          <div class="flex flex-col gap-2 basis-1/4 min-w-[0]">
            <label for="status" class="font-medium">Status</label>
            <div class="tooltip w-full" data-tip="The status automatically set to Pending, you can change it after approval">
              <select
                id="status"
                class="select select-bordered focus:select-accent w-full"
                bind:value={comic.status}
                disabled
              >
                <option value={ComicStatus.Pending}>Pending</option>
                <option value={ComicStatus.OnGoing} disabled>On Going</option>
                <option value={ComicStatus.Completed} disabled>Completed</option>
                <option value={ComicStatus.Hiatus} disabled>Hiatus</option>
                <option value={ComicStatus.Cancelled} disabled>Cancelled</option>
              </select>
            </div>
          </div>
          <!-- Publication Date -->
          <div class="flex flex-col gap-2 basis-1/4 min-w-[0]">
            <label for="publication-date" class="font-medium">Publication Date</label>
            <input
              id="publication-date"
              type="date"
              class="input input-bordered focus:input-accent"
              bind:value={comic.publicationDate}
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Description -->
    <div class="flex flex-col gap-2 min-w-[0]">
      <label for="description" class="font-medium">Description</label>
      <textarea
        id="description"
        class="textarea textarea-bordered focus:textarea-accent resize-none"
        placeholder="Enter comic description here"
        rows="3"
        bind:value={comic.description}
      ></textarea>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 items-center justify-end w-full max-w-full min-w-[0]">
      <button type="button" class="btn" on:click={reset}> Reset </button>
      <button
        type="button"
        class="btn btn-accent"
        class:btn-disabled={!comic.name || !coverUrl}
        on:click={createComic}
      >
        Create comic
      </button>
    </div>
  </div>
</Sublayout>
