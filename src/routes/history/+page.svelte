<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  let clearHistoryModal: HTMLDialogElement;
  let deleteCategoryModal: HTMLDialogElement;
  let comics = [
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      name: 'Naruto',
      chapter: '1',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      rating: 8.31,
      bookmarks: '13k',
      views: 'N/A',
      comments: 39,
      votes: '5',
      status: 'Completed',
      timeAgo: '22 days ago',
      chapters: [
        {
          title: 'Ch. 5 - The King of the Pirates and the Master Swordsman',
          timeAgo: '10 days ago'
        }
      ]
    },
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      chapter: '1',
      name: 'Naruto',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      rating: 8.31,
      bookmarks: '13k',
      views: 'N/A',
      comments: 39,
      votes: '5',
      status: 'Completed',
      timeAgo: '22 days ago',
      chapters: [
        { title: 'Ch. 1 - Romance Dawn', timeAgo: '10 days ago', publisher: '123' },
        { title: 'Ch. 2 - Enter Zoro', timeAgo: '10 days ago', publisher: '123' },
        { title: 'Ch. 3 - Morgan vs Luffy', timeAgo: '10 days ago', publisher: '123' },
        { title: 'Ch. 4 - The Great Captain Morgan', timeAgo: '10 days ago', publisher: '123' },
        {
          title: 'Ch. 5 - The King of the Pirates and the Master Swordsman',
          timeAgo: '10 days ago'
        }
      ]
    },
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      chapter: '1',
      name: 'Naruto',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      rating: 8.31,
      bookmarks: '13k',
      views: 'N/A',
      comments: 39,
      votes: '5',
      status: 'Completed',
      timeAgo: '22 days ago',
      chapters: [
        { title: 'Ch. 4 - The Great Captain Morgan', timeAgo: '10 days ago', publisher: '123' },
        {
          title: 'Ch. 5 - The King of the Pirates and the Master Swordsman',
          timeAgo: '10 days ago'
        }
      ]
    },
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      name: 'Naruto',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      rating: 8.31,
      bookmarks: '13k',
      votes: '5',
      views: 'N/A',
      comments: 39,
      status: 'Completed',
      timeAgo: '22 days ago',
      chapters: [
        { title: 'Ch. 1 - Romance Dawn', timeAgo: '10 days ago', publisher: '123' },
        { title: 'Ch. 2 - Enter Zoro', timeAgo: '10 days ago', publisher: '123' },
        { title: 'Ch. 3 - Morgan vs Luffy', timeAgo: '10 days ago', publisher: '123' },
        { title: 'Ch. 4 - The Great Captain Morgan', timeAgo: '10 days ago', publisher: '123' },
        {
          title: 'Ch. 5 - The King of the Pirates and the Master Swordsman',
          timeAgo: '10 days ago'
        }
      ]
    }
  ];

  let showAllStatus = new Array(comics.length).fill(false);

  function toggleShowAll(index: number) {
    showAllStatus[index] = !showAllStatus[index];
  }

  function shouldShowShowAllButton(index: number): boolean {
    return comics[index].chapters.length > 3;
  }
  function showTags() {
    return tag.length >= 3;
  }

  let activeContent = 'content1';

  function showContent(content) {
    activeContent = content;
  }
</script>

<div class="h-screen container mx-auto bg-white">
  <div class="label mt-12">
    <a class="btn btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m12 19l-7-7l7-7m7 7H5"
        />
      </svg>
      <span class="text-xl mb-1">Reading History</span>
    </a>
    <div class="flex justify-end items-end mt-4">
      <a
        on:click={() => {
          clearHistoryModal.showModal();
        }}
        class="btn btn-outline btn-warning btn-md"><span class="text-l">Clear All</span></a
      >
    </div>
    <dialog bind:this={clearHistoryModal} class="modal">
      <div class="modal-box flex flex-col items-center text-center">
        <span class="iconify lucide--alert-circle text-4xl text-error"></span>
        <h3 class="text-lg font-bold">Are you sure you want to clear all history?</h3>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-outline btn-error">Confirm</button>
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
  <!-- <div class="flex justify-end items-end mb-3">
    <a
      on:click={() => {
        clearHistoryModal.showModal();
      }}
      class="btn btn-outline btn-warning btn-md"><span class="text-l">Clear All</span></a
    >
  </div> -->
  <div class="flex justify-end items-end">
    <button
      on:click={() => showContent('content1')}
      class="rounded-l-lg p-2 btn-outline btn-warning border focus:bg-warning focus:text-white"
    >
      <span class="iconify lucide--list text-2xl mt-1"></span>
    </button>
    <button
      on:click={() => showContent('content2')}
      class="rounded-r-lg p-2 btn-outline btn-warning border focus:bg-warning focus:text-white"
    >
      <span class="iconify lucide--stretch-horizontal text-2xl mt-1"></span>
    </button>
  </div>
  <div class="content {activeContent === 'content1' ? 'active' : ''}">
    <div class="mt-5">
      <div class="space-y-4">
        {#each comics as comic, index}
          <div class="flex p-3 items-center bg-gray-100 rounded-lg shadow-md">
            <img
              src={comic.cover}
              alt={comic.name}
              class="w-42 h-56 rounded-lg object-cover mb-auto"
            />
            <div class="flex flex-col ml-4 flex-grow object-cover mb-auto">
              <div class="flex items-center">
                <div class="flex items-center space-x-2 mb-0">
                  <h2 class="text-l font-bold mb-0">{comic.name}</h2>
                  <span class="text-l text-gray-600 mb-0">{comic.author}</span>
                </div>
              </div>
              <div class="divider custom-divider"></div>
              {#each showAllStatus[index] ? comic.chapters.slice(0, 5) : comic.chapters.slice(0, 3) as chapter}
                <div>
                  <a
                    class="text-lg text-gray-600 mt-2 flex justify-between p-2 px-3 w-100 hover:bg-neutral-content rounded"
                  >
                    <div class="flex gap-2">
                      <span class="iconify lucide--eye mt-1"></span>
                      <span>{chapter.title}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex gap-3">
                        <span class="iconify lucide--clock mt-1"></span>
                        <span>{chapter.timeAgo}</span>
                      </div>
                    </div>
                  </a>
                </div>
              {/each}
              {#if shouldShowShowAllButton(index)}
                {#if !showAllStatus[index]}
                  <a
                    class="text-lg text-gray-600 mt-2 flex justify-center p-2 px-3 w-100 hover:bg-neutral-content rounded"
                    on:click={() => toggleShowAll(index)}
                  >
                    Show All
                  </a>
                {:else}
                  <a
                    class="text-lg text-gray-600 mt-2 flex justify-center p-2 px-3 w-100 hover:bg-neutral-content rounded"
                    on:click={() => toggleShowAll(index)}
                  >
                    Show Less
                  </a>
                {/if}
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="content {activeContent === 'content2' ? 'active' : ''}">
    <div class="mt-5">
      <div class="space-y-4">
        {#each comics as comic, index}
          <div class="flex p-3 items-center bg-gray-100 rounded-lg shadow-md">
            <div class="flex flex-col ml-4 flex-grow object-cover mb-auto">
              <div class="flex items-center">
                <div class="flex items-center space-x-2 mb-0">
                  <h2 class="text-l font-bold mb-0">{comic.name}</h2>
                  <span class="text-l text-gray-600 mb-0">{comic.author}</span>
                </div>
              </div>
              <div class="divider custom-divider"></div>
              {#each showAllStatus[index] ? comic.chapters.slice(0, 5) : comic.chapters.slice(0, 3) as chapter}
                <div>
                  <a
                    class="text-lg text-gray-600 mt-2 flex justify-between p-2 px-3 w-100 hover:bg-neutral-content rounded"
                  >
                    <div class="flex gap-2">
                      <span class="iconify lucide--eye mt-1"></span>
                      <span>{chapter.title}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex gap-3">
                        <span class="iconify lucide--clock mt-1"></span>
                        <span>{chapter.timeAgo}</span>
                      </div>
                    </div>
                  </a>
                </div>
              {/each}
              {#if shouldShowShowAllButton(index)}
                {#if !showAllStatus[index]}
                  <a
                    class="text-lg text-gray-600 mt-2 flex justify-center p-2 px-3 w-100 hover:bg-neutral-content rounded"
                    on:click={() => toggleShowAll(index)}
                  >
                    Show All
                  </a>
                {:else}
                  <a
                    class="text-lg text-gray-600 mt-2 flex justify-center p-2 px-3 w-100 hover:bg-neutral-content rounded"
                    on:click={() => toggleShowAll(index)}
                  >
                    Show Less
                  </a>
                {/if}
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="flex justify-center mt-4">
    <div class="join">
      <button class="join-item btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"
          ><path
            fill="none"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m15 18l-6-6l6-6"
          /></svg
        >
      </button>
      <button class="join-item btn">1</button>
      <button class="join-item btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"
          ><path
            fill="none"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m9 18l6-6l-6-6"
          /></svg
        >
      </button>
    </div>
  </div>
</div>

<!-- DIALOG DELETE COMIC -->
<dialog bind:this={deleteCategoryModal} class="modal">
  <div class="modal-box flex flex-col items-center text-center">
    <span class="iconify lucide--alert-circle text-4xl text-error"></span>
    <h3 class="text-lg font-bold">Are you sure you want to Delete Comic?</h3>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-outline btn-error">Delete</button>
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

<style>
  .custom-divider {
    height: 1px;
    width: calc(100% - 2rem);
    margin: 0 auto;
    background-color: #e2e8f0;
  }
  .content {
    display: none;
  }
  .content.active {
    display: block;
  }
</style>
