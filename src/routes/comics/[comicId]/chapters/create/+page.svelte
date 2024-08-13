<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type Chapter from '$models/Chapter';
  import type { ChapterCreate } from '$models/Chapter';
  import http from '$utils/http';
  import { uploadImage } from '$utils/image-utils';
  import { SortableList } from '@jhubbardsf/svelte-sortablejs';
  import type { SortableEvent } from 'sortablejs';
  import { getContext, tick } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let { token, comicId, comic } = data;
  $: ({ comicId, comic, token } = data);
  $: http.defaults.headers.common.Authorization = `Bearer ${token}`;

  const DEFAULTS: ChapterCreate = {
    name: 'Chapter ',
    number: comic.totalChapters ?? 0,
    pages: [] as string[],
    price: 0
  };
  DEFAULTS.name = `Chapter ${DEFAULTS.number}`;

  let chapter: ChapterCreate = { ...DEFAULTS };

  let guideLines: HTMLDivElement;
  let pages: { url: string; uploading: boolean; input: HTMLInputElement }[] = [];

  async function onPageEditChangeFile(index: number) {
    const page = pages[index];
    if (!page.input.files || page.input.files.length === 0) return;
    const file = page.input.files[0];
    page.url = URL.createObjectURL(file);
    page.uploading = true;
    page.url = await uploadImage(file);
    page.uploading = false;
  }

  async function onChooseFiles(event: Event & { currentTarget: HTMLInputElement }) {
    const input = event.currentTarget;
    const files = input.files;
    if (!files || files.length === 0) return;
    const existing = [...pages];
    const promises: Promise<string | boolean>[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      pages.push({ url, uploading: true } as any);
      const promise = uploadImage(file).catch(() => false);
      promises.push(promise);
    }
    pages = pages; // trigger reactivity before upload completes
    await tick();
    const result = (await Promise.all(promises)).filter(x => !!x); // wait for all uploads to finish
    // append to pages array, update existing uploading & url properties
    pages = [...existing, ...result.map((url, index) => ({ url, uploading: false } as any))]; // update upload status and url, trigger reactivity
  }

  function onSortEnd(event: SortableEvent) {
    const { newIndex, oldIndex } = event;
    if (oldIndex === newIndex || oldIndex === undefined || newIndex === undefined) return;
    const [moved] = pages.splice(oldIndex, 1);
    pages.splice(newIndex, 0, moved);
    pages = pages; // trigger reactivity
  }

  const addSuccessToast = getContext<(message: string) => void>('addSuccessToast');
  const addErrorToast = getContext<(message: string) => void>('addErrorToast');

  async function createChapter() {
    chapter.pages = pages.map((page) => page.url);
    try {
      const response = await http.post(`/comics/${comicId}/chapters`, chapter);
      addSuccessToast('Chapter created successfully');
      return response.data as Chapter;
    } catch (error) {
      addErrorToast('Failed to create chapter');
      return false;
    }
  }

  async function handleSubmit() {
    if (pages.some((page) => page.uploading)) {
      addErrorToast('Please wait for all pages to finish uploading');
      return;
    }
    const createdChapter = await createChapter();
    if (!createdChapter) return;
    if (!continueAdding) {
      goto(`/comics/${comicId}/chapters/${createdChapter.number}`);
      return;
    }

    continueAdding = false;
    DEFAULTS.number = createdChapter.number + 1;
    DEFAULTS.name = `Chapter ${DEFAULTS.number}`;
    DEFAULTS.pages = [];
    console.log(DEFAULTS);
    chapter = { ...DEFAULTS };
    pages = [];
  }

  let continueAdding = false;
</script>

<Sublayout pageName="Create new chapter">
  <div class="flex flex-col gap-6 container-80">
    <button
      on:click={() => guideLines.scrollIntoView({ behavior: 'smooth' })}
      class="btn btn-block btn-accent"
    >
      Make sure to read the guidelines!
    </button>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2 class="font-header text-2xl font-semibold">Comic</h2>
        <a
          href="/comics/{comicId}"
          class="flex items-start justify-start p-4 gap-4 bg-base-200 rounded h-40"
        >
          <Picture
            src={comic.cover}
            class="w-fit h-full aspect-cover rounded"
            imgClass="w-full h-full aspect-cover object-cover rounded"
          />
          <div class="flex flex-col grow h-full justify-between items-start gap-2">
            <h3
              class="font-header text-xl font-semibold h-16 max-w-full text-ellipsis overflow-hidden line-clamp-2"
            >
              {comic.name}
            </h3>
            <p class="italic">{comic.authors.join(', ')}</p>
          </div>
        </a>
      </div>
      <form class="flex flex-col gap-6" on:submit|preventDefault={handleSubmit}>
        <label class="form-control">
          <span class="label">
            <span>Chapter name <span class="text-error">*</span></span>
          </span>
          <div class="input input-bordered focus-within:input-accent flex items-center">
            <input type="text" bind:value={chapter.name} required />
          </div>
        </label>
        <div class="grid grid-cols-2 gap-8">
          <label class="form-control">
            <span class="label flex justify-start gap-2">
              Chapter number
              <span
                class="no-animation btn btn-xs btn-circle flex items-center tooltip"
                data-tip="Chapter number is automatically set to the next number in the series. You can reorder chapters in the comic settings."
              >
                <Icon icon="lucide--info" class="text-xl" />
              </span>
            </span>
            <div class="input input-bordered focus-within:input-accent flex items-center">
              <input type="number" bind:value={chapter.number} disabled />
            </div>
          </label>
          <label class="form-control">
            <span class="label">Price</span>
            <select class="select select-bordered focus:select-accent" bind:value={chapter.price}>
              <option value={0} selected>Free</option>
              {#each { length: 15 } as _, i (i)}
                <option value={i + 1}
                  >{i + 1} coin{#if i !== 0}s{/if}</option
                >
              {/each}
            </select>
          </label>
        </div>
        <div class="flex flex-col">
          <span class="label">
            <span>Chapter pages <span class="text-error">*</span></span>
          </span>
          <div class="grid grid-cols-5 gap-4 rounded bg-base-200 shadow-inner p-6">
            <SortableList class="contents" animation={150} onEnd={onSortEnd} handle=".cursor-move">
              {#each pages as page, index (page.url)}
                <div class="indicator w-fit h-56 aspect-cover m-2" data-index={index}>
                  <span class="indicator-item indicator-start">
                    <button
                      class="btn btn-sm btn-circle btn-warning shadow"
                      type="button"
                      on:click={() => page.input.click()}
                    >
                      <Icon icon="lucide--edit" class="text-lg" />
                    </button>
                    <input
                      type="file"
                      class="hidden"
                      bind:this={page.input}
                      on:change={() => onPageEditChangeFile(index)}
                    />
                  </span>
                  <span class="indicator-item indicator-end">
                    <button
                      class="btn btn-sm btn-circle btn-error shadow"
                      on:click={() =>
                        (pages = pages.slice(0, index).concat(pages.slice(index + 1)))}
                    >
                      <Icon icon="lucide--trash" class="text-lg" />
                    </button>
                  </span>
                  {#if page.uploading}
                    <span
                      class="indicator-item indicator-center indicator-middle loading loading-lg bg-base-100"
                    >
                    </span>
                  {:else}
                    <span
                      class="indicator-item indicator-center indicator-middle flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity duration-200"
                    >
                      <span class="btn btn-circle no-animation cursor-move">
                        <Icon icon="lucide--move" class="text-xl" />
                      </span>
                    </span>
                  {/if}
                  <Picture
                    src={page.url}
                    class="w-full h-full"
                    imgClass="w-full h-full object-cover shadow rounded{page.uploading
                      ? ' blur-sm'
                      : ''}"
                    useCdn={true}
                  />
                  <span
                    class="indicator-item indicator-bottom indicator-center bg-neutral-700/80 backdrop-blur-sm rounded w-full text-sm text-accent-content px-2 py-1"
                  >
                    Pg.{index + 1} - {page.uploading ? 'Uploading...' : 'Uploaded'}
                  </span>
                </div>
              {/each}
            </SortableList>
            <label
              class="w-fit h-56 m-2 aspect-cover border-dashed border-2 border-neutral hover:border-accent focus-within:border-accent flex transition-colors duration-500 bg-base-100 justify-center items-center self-center rounded"
            >
              <div class="btn btn-circle">
                <Icon icon="lucide--plus" class="text-2xl" />
              </div>
              <input type="file" class="hidden" on:change={onChooseFiles} multiple />
            </label>
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <button
            type="submit"
            class="btn text-accent hover:text-base-content"
            disabled={!pages.length || !chapter.name}
            on:click={() => (continueAdding = true)}
          >
            Create and add another chapter
          </button>
          <button
            type="submit"
            class="btn btn-accent"
            disabled={!pages.length || !chapter.name}
          >
            Create chapter
          </button>
        </div>
      </form>
    </div>
    <div class="px-16 py-8 prose text-base-content" bind:this={guideLines}>
      <h3>Chapter Upload Guidelines</h3>
      <h4 class="text-warning">Do not upload</h4>
      <ul>
        <li>Western comics (e.g. Marvel, DC, ...).</li>
        <li>
          Official releases, including raws, unless they fall under the exceptions in site rules
          section 1.2.1.
        </li>
        <li>Bulk chapters (e.g. Combining 10 chapters into 1).</li>
        <li><p>Images from aggregator websites if an original source is available.</p></li>
      </ul>
      <h4>File requirements and limits:</h4>
      <ul>
        <li>An image can be at most (10000 x 10000) pixels.</li>
        <li>The maximum size per image file is 8MB.</li>
        <li>The only allowed image formats are JPEG, PNG, and GIF.</li>
        <li>The maximum total size of your chapter may not exceed 100MB.</li>
      </ul>
    </div>
  </div>
</Sublayout>
