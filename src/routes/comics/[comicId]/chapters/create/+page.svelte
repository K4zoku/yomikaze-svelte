<script lang="ts">
  import { SortableList } from '@jhubbardsf/svelte-sortablejs';
  import httpImage from '$utils/httpImage';
  import type Chapter from '$models/Chapter';
  import chapterManagement from '$utils/chapter-utils';
  import { getComic, normalizeComic } from '$utils/comic-utils.js';
  import { onMount } from 'svelte';
  import Picture from '$components/picture.svelte';
  import ComicStatus from '$components/yomikaze/common/comic/comic-status.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  export let data;
  let { token, comicId, comic } = data;
  let pageName='Create Chapter'
  let postChapter = new chapterManagement(token, comicId);
  let images: Array<string> = [];
  let imageUrl: string;
  let chapterData: Chapter = {
    number: null,
    name: '',
    pages: [],
    price : null
  };
  function handleChange(event) {
    chapterData.price = event.target.value;
  }
  function scrollToGuide() {
    const element = document.getElementById('guide-element');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // async function getComicInfor() {
  //   comicInformation = getComic(comicId,token);
  //   console.log(comicInformation)
  // }
  async function uploadImage(file, comicId: string) {
    if (typeof comicId !== 'string') {
      comicId = String(comicId);
    }
    let formData = new FormData();
    formData.set('File', file);
    formData.set('ComicId', comicId);
    let response = await httpImage.post('/images', formData);
    if (response.status === 201) {
      let imageUrl = response.data.images[0];
      return imageUrl;
    } else {
      console.log(response.status, response.data);
      console.log(comicId);
    }
  }
  async function createChapterFinal() {
    await postChapter
      .createChapter(chapterData)
      .then((response) => {
        alert('create successfully!');
      })
      .catch((error) => alert('Create fail!'));
  }
  // Xử lý sự kiện khi người dùng chọn tệp hình ảnh
  async function handleFileUpload(event: Event) {
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files.length
    ) {
      const files = event.target.files; // Lấy danh sách các tệp tin từ sự kiện

      if (files.length > 0) {
        for (const file of files) {
          let image = await uploadImage(file, comicId);

          // Đọc nội dung tệp hình ảnh dưới dạng URL
          const reader = new FileReader();
          reader.onload = function (event) {
            const imageUrl = image; // Lưu URL của hình ảnh vào biến imageUrl

            // Thêm hình ảnh vào mảng images
            images = [...images, imageUrl];
          };

          reader.readAsDataURL(file); // Đọc dữ liệu của tệp hình ảnh
        }
      }
      chapterData.pages = images;
    }
  }
  async function editFileUpload(event: Event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target.result; // Lưu URL của ảnh mới vào biến newImageUrl

        // Tìm và cập nhật URL của ảnh trong mảng images
        const indexToUpdate = images.findIndex((imgUrl) => imgUrl === imageUrl);
        if (indexToUpdate !== -1) {
          images[indexToUpdate] = newImageUrl;
        }

        imageUrl = newImageUrl; // Cập nhật imageUrl để hiển thị ảnh mới
      };
      reader.readAsDataURL(file); // Đọc và chuyển đổi dữ liệu hình ảnh sang dạng URL
    }
  }
  function removeImage(imageUrlToRemove: string) {
    images = images.filter((imageUrl) => imageUrl !== imageUrlToRemove);
  }
  onMount(async () => {
    console.log('thisis' + comic);
  });
</script>
<svelte:head>
  <title>{pageName}</title>
</svelte:head>
<Sublayout {pageName}>
{#await comic then comic}
  <div class="flex justify-center">
    <div class="ml-10 w-9/12 aspect-[20/6]">
      <button on:click={scrollToGuide} class="btn btn-block bg-orange-500 hover:bg-orange-600">
        <p class="text-white">Make sure to read the guidelines!</p>
      </button>
      <div class="mt-10">
        <p class="text-xl font-bold">Details</p>
      </div>
      <div class="bg-base-200 flex items-center gap-3">
        <Picture
          src={comic.cover}
          useCdn={true}
          class="h-28 w-fit aspect-cover"
          imgClass="rounded-md shadow object-contain w-full h-full"
        ></Picture>
        <div class="">
          <p class="text-xl font-bold">{comic.name}</p>
          <p class="text-sm mb-2">{comic.authors}</p>
            <ComicStatus status={comic.status}></ComicStatus>
        </div>
      </div>

      <form on:submit|preventDefault={createChapterFinal}>
        <div class="mt-7">
          <div class="flex justify-between mt-7">
            <input
              bind:value={chapterData.number}
              type="number"
              placeholder="Chapter Number"
              class="border-orange-500 h-14 w-72 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-warning custom-input"
            />
            <select
              bind:value={chapterData.price}
              class="select h-14 w-72 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-warning"
            >
            <option disabled selected>Choose coin</option>
              {#each { length: 15 } as _, i}
                {#if i == 0}
                  <option value={i + 1}>{i + 1} coin</option>
                {/if}
                {#if i > 0}
                  <option value={i + 1}>{i + 1} coins</option>
                {/if}
              {/each}
            </select>
          </div>
          <input
            bind:value={chapterData.name}
            type="text"
            placeholder="Chapter Title"
            class="h-14 w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-warning mt-3 custom-input"
          />
        </div>
        <div class="mt-10 grid grid-cols-5 gap-4">
          <SortableList class="contents" animation={150}>
            <!-- Vòng lặp để hiển thị các hình ảnh đã tải lên -->
            {#each images as imgUrl}
              <div class=" indicator min-w-40 min-h-52 w-40 h-52 shadow bg-base-200">
                <span class=" indicator-item indicator-end">
                  <button
                    class="btn btn-xs btn-circle btn-error"
                    on:click={() => removeImage(imgUrl)}
                  >
                    <span class="iconify lucide--x"></span>
                  </button>
                </span>
                <span class="indicator-item indicator-start">
                  <button
                    class="btn btn-xs btn-circle btn-warning"
                    type="button"
                    on:click={() => document.getElementById('edit-image-' + imgUrl).click()}
                  >
                    <span class="iconify lucide--edit-3"></span>
                  </button>
                  <input
                    type="file"
                    id={'edit-image-' + imgUrl}
                    on:change={editFileUpload}
                    class="hidden"
                  />
                </span>
                <!-- Hiển thị hình
                ảnh -->
                <img
                  src={'https://i.yomikaze.org' + imgUrl}
                  alt="Uploaded Image"
                  class="w-full h-full object-contain"
                />
              </div>
            {/each}
          </SortableList>
          <div
            class="relative inline-block w-40 h-52 border-dotted border-2 border-neutral flex justify-center items-center self-center rounded-md"
          >
            <!-- Hiển thị hình ảnh -->
            <input
              type="file"
              id="file-input"
              class="absolute inset-0 opacity-0 cursor-pointer"
              on:change={handleFileUpload}
              multiple
            />
            <label for="file-input" class="btn btn-circle btn-neutral"
              ><span class="iconify lucide--plus text-2xl"></span></label
            >
          </div>
        </div>
        <div class="flex gap-5 mt-10 justify-end">
          <button class="btn btn-wide btn-ghost hover:bg-red-100"
            ><p class="text-orange-600 text-sm">Upload and add another chapter</p>
          </button>
          <button class="btn btn-wide bg-orange-600 hover:bg-orange-700" type="submit"
            ><p class="text-white text-lg">Upload</p>
          </button>
        </div>
      </form>
      <div id="guide-element" class="mt-10 ml-5 pb-12">
        <div class="prose">
          <h3 class="">Chapter Upload Guidelines</h3>
          <h4 class="text-orange-700 mt-7">Do not upload</h4>
          <ul>
            <li>Western comics (e.g. Marvel, DC, ...).</li>
            <li>
              Official releases, including raws, unless they fall under the exceptions in site rules
              section 1.2.1.
            </li>
            <li>Bulk chapters (e.g. Combining 10 chapters into 1).</li>
            <li><p>Images from aggregator websites if an original source is available.</p></li>
          </ul>
          <h4 class="font-bold">File requirements and limits:</h4>
          <ul>
            <li>An image can be at most (10000 x 10000) pixels.</li>
            <li>The maximum size per image file is 8MB.</li>
            <li>The only allowed image formats are JPEG, PNG, and GIF.</li>
            <li><p>The maximum total size of your chapter may not exceed 100MB.</p></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{/await}
</Sublayout>

<style>
  .custom-input::placeholder {
    color: #070707; /* Thay đổi màu chữ placeholder ở đây */
  }
</style>
