<script lang="ts">
  import { onMount } from 'svelte';
  import Sortable from 'sortablejs';

  import type LibraryCategory from '$models/LibraryCategory.js';
  import type { PageData } from './$types';

  export let data: PageData;
  let { libraryEntries } = data;
  let createCategoryModal: HTMLDialogElement;
  let categoryManagementModal: HTMLDialogElement;
  let deleteCategoryModal: HTMLDialogElement;

  let categories: Array<LibraryCategory> = [
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    },
    {
      id: '1',
      name: 'Comics3',
      userId: '1',
      creationTime: ''
    }
  ];

  let activeTab: string;
  let total = '3';
  let comics = [
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      name: 'Naruto',
      chapter: '1',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      status: 'Completed',
      timeAgo: '22 days ago'
    },
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      chapter: '1',
      name: 'Naruto',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      status: 'Completed',
      timeAgo: '22 days ago'
    },
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      chapter: '1',
      name: 'Naruto',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      status: 'Completed',
      timeAgo: '22 days ago'
    },
    {
      cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
      chapter: '1',
      name: 'Naruto',
      author: 'Kishimoto Masashi',
      description:
        "Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
      tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
      status: 'Completed',
      timeAgo: '22 days ago'
    },
  ];


  let activeCategories = 'category1';

  function showCategory(category) {
    activeCategories = category;
  }

  let activeContent = 'content1';

  function showContent(content) {
    activeContent = content;
  }

  onMount(() => {
    const sortable = new Sortable(document.getElementById('sortable-list'), {
      animation: 150,
      ghostClass: 'sortable-ghost'
    });
  });
</script>

<div class="h-screen container mx-auto bg-white">
  <!-- <NavBar title={title} /> -->
  <div class="">
    <div class="label mt-12">
      <a class="btn btn-ghost">
        <span class="text-2xl mt-1 iconify lucide--arrow-left"></span>
        <span class="text-xl">Library</span>
      </a>
    </div>
    <div class="flex justify-between items-start overflow-x-auto p-4">
      <!-- Center part -->

      <div class=" flex flex-wrap gap-2 tabs tabs-boxed p-2">
        {#each categories as category}
          <button class="tab tab-active whitespace-nowrap" data-tab="plan-to-read"
            >{category.name}</button
          >
        {/each}
      </div>

      <button class="btn ms-2 me-2" on:click={() => categoryManagementModal.showModal()}>
        <span class="iconify lucide--settings text-2xl"></span>
      </button>
      <!-- Right part -->
      <div class="flex space-x-2">
        <div class="form-control">
          <label class="input input-bordered flex items-center gap-2 pr-4 w-73 border">
            <input type="text" class="grow-0" placeholder="Search" />
          </label>
        </div>
        <button class="btn">
          <!-- search -->
          <span class="iconify lucide--search text-2xl"></span>
        </button>

        <!-- 2 -->
        <dialog bind:this={categoryManagementModal} class="modal">
          <div class="modal-box w-11/12 max-w-5xl flex flex-col items-center text-center">
            <h3 class="text-lg font-bold">Category Management</h3>
            <div id="sortable-list" class="flex flex-col gap-2 w-full items-center">
              <div class="flex justify-between w-9/12 btn-ghost p-2 rounded bg-gray-200">
                <div class="flex gap-2">
                  <span class="flex iconify lucide--menu text-2xl"></span>
                  <span class="justify-center items-center">Menu 1</span>
                </div>
                <div class="flex gap-2">
                  <span
                    class="iconify lucide--edit text-xl"
                    on:click={() => {
                      createCategoryModal.showModal();
                    }}
                  ></span>
                  <span
                    class="iconify lucide--trash-2 text-xl"
                    on:click={() => deleteCategoryModal.showModal()}
                  ></span>
                </div>
              </div>
              <div class="flex justify-between w-9/12 btn-ghost p-2 rounded bg-gray-200">
                <div class="flex gap-2">
                  <span class="flex iconify lucide--menu text-2xl"></span>
                  <span class="justify-center items-center">Menu 2</span>
                </div>
                <div class="flex gap-2">
                  <span
                    class="iconify lucide--edit text-xl"
                    on:click={() => {
                      createCategoryModal.showModal();
                    }}
                  ></span>
                  <span
                    class="iconify lucide--trash-2 text-xl"
                    on:click={() => deleteCategoryModal.showModal()}
                  ></span>
                </div>
              </div>
              <div class="flex justify-between w-9/12 btn-ghost p-2 rounded bg-gray-200">
                <div class="flex gap-2">
                  <span class="flex iconify lucide--menu text-2xl"></span>
                  <span class="justify-center items-center">Menu 3</span>
                </div>
                <div class="flex gap-2">
                  <span
                    class="iconify lucide--edit text-xl"
                    on:click={() => {
                      createCategoryModal.showModal();
                    }}
                  ></span>
                  <span
                    class="iconify lucide--trash-2 text-xl"
                    on:click={() => deleteCategoryModal.showModal()}
                  ></span>
                </div>
              </div>
            </div>
            <div class="modal-action">
              <form method="dialog">
                <button class="btn">Close</button>
              </form>
              <button
                class="btn btn-outline btn-success"
                on:click={() => {
                  createCategoryModal.showModal();
                }}>Create</button
              >
            </div>
          </div>
        </dialog>
      </div>
    </div>
    <div class="flex justify-between items-center p-4">
      <div class=" flex flex-col space-x-2 p-4">
        <div class="flex" on:click={() => createCategoryModal.showModal()}>
          <h1 class=" text-xl font-semibold ms-1">Reading</h1>
          <span class="iconify lucide--edit text-l mt-2 ms-3"></span>

        </div>

        <h2 class="text-xl font-semibold">Total: {total}</h2>
      </div>
      <div class="flex justify-end items-end">
        <button
          on:click={() => showContent('content1')}
          class="rounded-l-lg p-2 btn-outline btn-warning border"
        >
          <span class="iconify lucide--list text-2xl mt-1"></span>
        </button>
        <button
          on:click={() => showContent('content2')}
          class="rounded-r-lg p-2 btn-outline btn-warning border"
        >
          <span class="iconify lucide--stretch-horizontal text-2xl mt-1"></span>
        </button>
      </div>
    </div>
    <div class="content {activeContent === 'content1' ? 'active' : ''}">
      <!-- <div class="flex flex-col gap-2.5 h-80"> -->
      {#each comics as comic}
        <div class="card p-2">
          <div class="card-body gird items-center rounded-lg shadow-md py-3 px-3">
            <div class="flex">
              <div class="flex items-center">
                <img src={comic.cover} alt={comic.name} class="w-42 h-56 rounded-lg object-cover" />

                <div class="flex-grow flex flex-col justify-evenly ml-4">
                  <div class="flex justify-between">
                    <div class="flex items-center space-x-2 mb-2">
                      <h2 class="text-l font-bold mb-0">{comic.name}</h2>
                      <span class="text-l text-gray-600 mb-0">{comic.author}</span>
                    </div>
                    <div class="flex">
                      <div class="flex gap-3 me-2 mb-3">
                        <div class="flex gap-1 my-auto bg-base-300 rounded px-2">
                          <svg
                            data-v-9ba4cb7e=""
                            data-v-6ebb56e1=""
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 6.35 6.35"
                            class="icon"
                            style="color: rgb(0,255,0);"
                            ><path
                              fill="currentColor"
                              d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"
                            ></path></svg
                          >
                          <span class="text-base font">{comic.status}</span>
                        </div>
                      </div>
                      <div class="flex mb-3" on:click={() => deleteCategoryModal.showModal()}>
                        <span class="iconify lucide--trash-2 text-2xl"></span>
                      </div>
                    </div>
                  </div>
                  <div class="divider custom-divider"></div>
                  <div class="flex justify-between">
                    <div class="flex gap-2 mt-4 mb-3">
                      <!-- {#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter} -->
                      {#each comic.tags as tag}
                        <a class="badge badge-outline">{tag}</a>
                      {/each}
                    </div>
                  </div>
                  <div class=" text-sm font-normal">
                    <span class="text-base">{comic.description} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="content {activeContent === 'content2' ? 'active' : ''}">
    <div class="grid grid-cols-2">
      {#each comics as comic}
        <div class="card p-2">
          <div class="card-body items-center rounded-lg shadow-md py-3 px-3">
            <div class="flex">
              <a href=""
                ><div class="w-40 h-56">
                  <img class="float-left rounded" src={comic.cover} alt={comic.name} />
                </div></a
              >
              <div class=" flex flex-col justify-evenly ml-2">
                <div class="flex justify-between gap-2">
                  <div class="flex gap-2">
                    <span class="font-semibold text-xl">{comic.name}</span>
                  </div>
                  <div class="flex">
                    <div class="flex gap-3 me-2 mb-3">
                      <div class="flex gap-1 my-auto bg-base-300 rounded px-2">
                        <svg
                          data-v-9ba4cb7e=""
                          data-v-6ebb56e1=""
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 6.35 6.35"
                          class="icon"
                          style="color: rgb(0,255,0);"
                          ><path
                            fill="currentColor"
                            d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"
                          ></path></svg
                        >
                        <span class="text-base font">{comic.status}</span>
                      </div>
                    </div>
                    <div
                      class="flex gap-1 my-auto me-2 mb-3"
                      on:click={() => deleteCategoryModal.showModal()}
                    >
                      <span class="iconify lucide--trash-2 text-2xl"></span>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between gap-2">
                  <div class="flex gap-2 mt-1">
                    <!-- {#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter} -->
                    {#each comic.tags.slice(0, 3) as tag}
                      <a class="badge badge-outline">{tag}</a>
                    {/each}
                  </div>
                </div>
                <div class="flex justify-between gap-3 mt-1">
                  <div class="flex gap-3">
                    <h4 class="font-semibold text-l">Chapter: {comic.chapter}</h4>
                  </div>
                </div>
                <div class=" text-sm font-normal">
                  <span class="block text-base overflow-hidden max-h-20" id="description">
                    {comic.description}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="flex justify-center pt-2 pb-2">
    <div class="join">
      <button class="join-item btn">
        <span class="iconify lucide--chevron-left text-2xl"></span>
      </button>
      <button class="join-item btn text-xl">1</button>
      <button class="join-item btn">
        <span class="iconify lucide--chevron-right text-2xl"></span>
      </button>
    </div>
  </div>
</div>

<!-- DIALOG CREATE PERSONAL CATEGORY -->
<dialog bind:this={createCategoryModal} class="modal">
  <div class="modal-box flex flex-col items-center text-center">
    <h3 class="text-lg font-bold">Create new personal category</h3>
    <h5 class="mb-2">Name for personal category</h5>
    <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-outline btn-success">Create</button>

        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

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
  .sortable-ghost {
    opacity: 0.5;
    background: #f0f0f0;
  }
</style>
