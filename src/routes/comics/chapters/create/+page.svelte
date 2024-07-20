<script lang="ts">
  import { SortableList } from '@jhubbardsf/svelte-sortablejs';
  import httpImage from '$utils/http-image';
  import http from '$utils/http';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import type Chapter from '$models/Chapter';
  let images: Array<string | ArrayBuffer | null> = [
    '/images/comics/67466676832157697/chapters/1/001.jpeg',
    '/images/comics/67466676832157697/chapters/1/002.jpeg',
    '/images/comics/67466676832157697/chapters/1/003.jpeg',
    '/images/comics/67466676832157697/chapters/1/004.jpeg',
    '/images/comics/67466676832157697/chapters/1/005.jpeg',
    '/images/comics/67466676832157697/chapters/1/006.jpeg',
    '/images/comics/67466676832157697/chapters/1/007.jpeg',
    '/images/comics/67466676832157697/chapters/1/008.jpeg',
    '/images/comics/67466676832157697/chapters/1/009.jpeg',
    '/images/comics/67466676832157697/chapters/1/010.jpeg'
  ]; // Mảng để lưu trữ các URL của các hình ảnh đã tải lên
  let imageUrl: string;
  let imageData = {
    File: '',
    ComicId: '68638295025815553',
    ChapterIndex: ''
  };
  let chapterData: Chapter = {
    number: 0,
    originalLanguage: '',
    name: '',
    pages: [],
    price: 0
  };
  async function uploadImage(file, comicId) {
    let formData = new FormData();
    formData.set('File', file);
    formData.set('ComicId', comicId);
    let response = await httpImage.post('/images', formData);
    if (response.status === 201) {
      let imageUrl = response.data.images[0];
      return imageUrl;
    } else {
      console.log(response.status, response.data);
    }
  }
  async function createChapter(comicId, chapterData) {
    let response = await http.post(`/comics/68638295025815553/chapters`, chapterData);
    if (response.status === 201) {
      console.log(response.data);
    } else {
      console.log(response.status, response.data);
    }
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
          let image = await uploadImage(file, '68638295025815553');

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
  async function editFileUpload(event) {
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
  function removeImage(imageUrlToRemove) {
    images = images.filter((imageUrl) => imageUrl !== imageUrlToRemove);
  }
</script>

<div class="flex justify-center">
  <div class="ml-10 w-9/12 aspect-[20/6]">
    <div class="h-20"></div>
    <button class="btn btn-block bg-orange-500 hover:bg-orange-600"><p class="text-white">Make sure to read the guidelines!</p></button>
    <div class="">
      <p class="text-xl font-bold">Details</p>
    </div>
    <div class="bg-base-200 flex">
      <div class="h-24 w-16 self-center">
        <img
          class="object-cover"
          src="https://i.yomikaze.org/images/comics/67466676832157697/67468445754712064.webp"
          alt=""
        />
      </div>
      <div class="ml-3 self-center">
        <p class="text-xl font-bold">Oshinobi Dousei</p>
        <p class="text-sm">Ponto Gotanda</p>
        <div class="bg-gray-300 w-28 h-7 flex rounded-md mt-2">
          <span class="self-center ml-1 bg-sky-400 rounded-full w-2 h-2"></span>
          <p class="text-sm self-center ml-2">Completed</p>
        </div>
      </div>
    </div>
    <form on:submit|preventDefault={() => createChapter('68638295025815553', chapterData)}>
      <div class="mt-7">
        <div class="flex justify-between mt-7">
          <input
            bind:value={chapterData.number}
            type="text"
            placeholder="Chapter Number"
            class="border-orange-500 h-14 w-72 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-warning custom-input"
          />
          <select class="h-14 w-72 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-warning">
            <option disabled selected>Original Language</option>
            <option>Homer</option>
            <option>Marge</option>
            <option>Bart</option>
            <option>Lisa</option>
            <option>Maggie</option>
          </select>
          <select class="h-14 w-72 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-warning">
            <option disabled selected>Choose Coin</option>
            <option>Homer</option>
            <option>Marge</option>
            <option>Bart</option>
            <option>Lisa</option>
            <option>Maggie</option>
          </select>
        </div>
        <input
          bind:value={chapterData.name}
          type="text"
          placeholder="Chapter Title"
          class="h-14 w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-warning mt-3 custom-input"
        />
      </div>
      <div class="mt-10 grid grid-cols-4 gap-4">
        <SortableList class="contents" animation={150}>
          <!-- Vòng lặp để hiển thị các hình ảnh đã tải lên -->
          {#each images as imgUrl}
            <div
              class=" indicator min-w-40 min-h-52 w-40 h-52 shadow bg-base-200 flex justify-center"
            >
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
                class="max-w-full max-h-full object-contain"
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
          <!-- <button type="button" class="absolute inset-0 bg-blue-500 text-white rounded-full text-2xl cursor-pointer hover:bg-blue-700 w-12 h-12 flex justify-center items-center" on:click={() => document.getElementById('file-input').click()}>+</button> -->
        </div>
      </div>
      <div class="flex gap-5 mt-10 justify-end">
        <button class="btn btn-wide btn-ghost hover:bg-red-100"
          ><p class="text-orange-600 text-sm">Upload and add another chapter</p></button
        >
        <button class="btn btn-wide bg-orange-600 hover:bg-orange-700" type="submit"
          ><p class="text-white text-lg">Upload</p></button
        >
      </div>
    </form>
    <div class="mt-10 ml-5 pb-12">
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

<style>
  .custom-input::placeholder {
    color: #070707; /* Thay đổi màu chữ placeholder ở đây */
  }
</style>
