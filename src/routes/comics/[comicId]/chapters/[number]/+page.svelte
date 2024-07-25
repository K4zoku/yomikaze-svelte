<script lang="ts">
  import Carousel from 'svelte-carousel';
  export let data;
  let { chapter, chapters, comic } = data;
  let active = false;
  let currentIndex = 0;
  interface CarouselData {
    goToPrev: () => void;
    goToNext: () => void;
    currentPageIndex: number;
  }
  let carousel: CarouselData = {
    goToNext: () => {},
    goToPrev: () => {},
    currentPageIndex: 0
  };

  let progressBar;

  function toggleSidebar() {
    active = !active;
  }
  let buttonText = 'Single Page';
  function toggleButtonState() {
    buttonText = buttonText === 'Single Page' ? 'Long Strip' : 'Single Page';
    if (buttonText === 'Single Page') {
      //startSplide();
    }
  }
  // Hàm xử lý sự kiện khi người dùng chọn ảnh
  const handleSelectChange = (event) => {};

  const goToPrevPage = () => {};

  const goToNextPage = () => {};
</script>

<div class="h-16"></div>
<div class="flex justify-center h-screen relative">
  <button class="fixed top-15 right-0 btn btn-circle btn-ghost" on:click={toggleSidebar}>
    <span class="duration-500 iconify lucide--bar-chart text-2xl transform rotate-90 scale-flip"
    ></span>
  </button>
  <aside class:active class="pt-2">
    <div class="flex justify-between pr-2">
      <button class="btn btn-circle btn-ghost" on:click={toggleSidebar}>
        {#if active}
          <span class="duration-500 iconify lucide--x text-2xl"></span>
        {/if}
      </button>
      <button class="btn btn-circle btn-ghost">
        <span class="duration-500 iconify lucide--flag text-2xl"></span>
      </button>
    </div>
    <div class="pl-4 pr-4">
      <div class="flex gap-5 mt-5">
        <span class="iconify lucide--book-open text-2xl self-center"></span>
        <a class="self-center" href={`/comics/${comic.id}`}>
          {comic.name}
        </a>
      </div>
      <div class="flex gap-5 mt-5">
        <span class="iconify lucide--file-image text-2xl self-center"></span>
        <p class="self-center">{chapter.name}</p>
      </div>

      <div class="flex gap-3 mt-5">
        <div class="flex w-8 h-14 bg-base-200 justify-center rounded-md btn btn-ghost">
          <button class="flex" on:click={goToPrevPage}>
            <span class="iconify lucide--chevron-left text-2xl self-center"></span>
          </button>
        </div>
        <div class="grow h-14 flex rounded-md">
          <select
            class="bg-base-200 select select-bordered h-full w-full max-w-xs select-page self-center"
            on:change={handleSelectChange}
          >
            {#each chapter.pages as image, index}
              <option class="bg-base-200" value={index}>Pg.{index + 1}</option>
            {/each}
          </select>
        </div>
        <div class="flex w-8 h-14 bg-base-200 justify-center rounded-md btn btn-ghost">
          <button class="flex" on:click={goToNextPage}>
            <span class="iconify lucide--chevron-right text-2xl self-center"></span>
          </button>
        </div>
      </div>
      <div class="flex gap-3 mt-3">
        <div class="w-8 h-14 bg-base-200 rounded-md btn btn-ghost">
          <button class="flex" on:click={goToPrevPage}>
            <span class="iconify lucide--chevron-left text-2xl self-center"></span>
          </button>
        </div>
        <div class="grow h-14 flex rounded-md">
          <select
            class="bg-base-200 select select-bordered h-full w-full max-w-xs select-page self-center"
          >
            {#each chapters as listChapter, index}
              <option>Chapter {index + 1}</option>
            {/each}
          </select>
        </div>
        <div class="w-8 h-14 bg-base-200 rounded-md btn btn-ghost">
          <button class="flex" on:click={goToNextPage}>
            <span class="iconify lucide--chevron-right text-2xl self-center"></span>
          </button>
        </div>
      </div>
      <div class="flex gap-5 mt-5">
        <div><p class="font-bold my-auto text-lg">Reading Mode</p></div>
        <div>
          <button class="flex gap-3" on:click={toggleButtonState}>
            {#if buttonText == 'Single Page'}
              <span class="iconify lucide--file text-2xl"></span>
              <p class="text-sm font-bold self-center">{buttonText}</p>
            {:else}
              <span class="iconify lucide--gallery-vertical text-2xl"></span>
              <p class="text-sm font-bold self-center">{buttonText}</p>
            {/if}
          </button>
        </div>
      </div>
      <div class="flex gap-5 mt-5">
        <div class="flex"><p class="font-bold my-auto text-lg self-center">Language</p></div>
        <select class="select select-bordered w-full max-w-xs">
          <option>Viet Nam</option>
          <option>England</option>
          <option value=""></option>
        </select>
      </div>
    </div>
  </aside>
  <div class="h-screen">
    {#if buttonText === 'Long Strip'}
      <div class="flex flex-col gap-5 transition-all duration-500 h-3/5" class:shifted={active}>
        {#each chapter.pages as image, index}
          <div class="max-h-full lg:max-w-2xl max-w-full">
            <img class="" src={image} alt={`${index + 1}`} />
          </div>
        {/each}
      </div>
    {/if}
    {#if buttonText === 'Single Page'}
      <div class="transition-all duration-500 h-3/5" class:shifted={active}>
          {#each chapter.pages as image, index (index)}
            <div class="max-h-full lg:max-w-2xl max-w-full">
              <img class="" src={image} alt={`${index + 1}`} />
            </div>
          {/each}
        <!-- <div class="my-carousel-progress-bar absolute"></div> -->
      </div>
    {/if}
  </div>
</div>

<style>
  aside {
    position: fixed;
    right: -300px;
    transition: all 0.5s;
    height: 100%;
    width: 300px;
    border: 1px solid #ddd;
    background-color: #ffffff;
  }
  .active {
    right: 0px;
  }
  .shifted {
    transition: all 0.5s;
    margin-right: 300px;
  }
  .my-carousel-progress-bar {
    margin-top: 19px;
    height: 5px; /* Chiều cao của thanh tiến trình */
    background-color: #ff5900ef; /* Màu sắc của thanh tiến trình */
    transition: width 0.3s; /* Hiệu ứng chuyển động khi thay đổi chiều rộng */
  }
</style>
