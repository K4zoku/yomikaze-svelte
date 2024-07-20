<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  let { libraryEntries } = data;
  let content: HTMLDialogElement;
  let create_personal: HTMLDialogElement;
  let edit_personal: HTMLDialogElement;
  let delete_personal: HTMLDialogElement;
  let delete_comic1: HTMLDialogElement;
  let delete_comic2: HTMLDialogElement;

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
    }
    // Các comic khác...
  ];

  let activeContent = 'content1';

  function showContent(content) {
    activeContent = content;
  }
</script>

<div class="h-screen container mx-auto p-6 bg-white">
  <!-- <NavBar title={title} /> -->
  <div class="">
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
        <span class="text-xl mb-1">Library</span>
      </a>
    </div>
    <div class="flex justify-between items-center p-4">
      <!-- Center part -->
      <div class="flex justify-between items-center bg-base-200 p-2 rounded">
        <div class="flex space-x-2">
          <div class="relative">
            <button class="tab tab-active btn-outline rounded relative group" data-tab="reading"
              >Reading
              <svg
                class="absolute mb-8 ms-8 hidden group-hover:block text-error"
                on:click={() => delete_personal.showModal()}
                xmlns="http://www.w3.org/2000/svg"
                width="1.4em"
                height="1.4em"
                viewBox="0 0 24 24"
              >
                <g
                  fill="red"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </g>
              </svg>
            </button>
            <dialog id="delete_personal" bind:this={delete_personal} class="modal">
              <div class="modal-box flex flex-col items-center text-center">
                <svg
                  class="mx-auto mb-4 w-12 h-12 text-error"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.4em"
                  height="1.4em"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                  </g>
                </svg>
                <h3 class="text-lg font-bold">Are you sure you want to Delete Personal?</h3>
                <div class="modal-action">
                  <form method="dialog">
                    <button class="btn btn-outline btn-error">Confirm</button>
                    <button class="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          <button class="tab btn-outline rounded" data-tab="plan-to-read">Plan to read</button>
          <button class="tab btn-outline rounded" data-tab="completed">Completed</button>
          <button class="tab btn-outline rounded" data-tab="on-hold">On hold</button>
          <button class="tab btn-outline rounded" data-tab="re-reading">Re-reading</button>
          <button class="tab btn-outline rounded" data-tab="dropped">Dropped</button>
        </div>
        <button class="tab btn-outline rounded" on:click={() => create_personal.showModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8m-4-4v8" />
            </g>
          </svg>
        </button>
      </div>

      <!-- Right part -->
      <div class="flex space-x-2">
        <div class="form-control">
          <label class="input input-bordered flex items-center gap-2 pr-4 w-73 border">
            <input type="text" class="grow-0" placeholder="Search" />
          </label>
        </div>
        <button class="btn">
          <!-- search -->
          <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"
            ><g
              fill="none"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21l-4.3-4.3" /></g
            ></svg
          >
        </button>
        <!-- DIALOG CREATE PERSONAL CATEGORY -->
        <dialog id="create_personal" bind:this={create_personal} class="modal">
          <div class="modal-box flex flex-col items-center text-center">
            <h3 class="text-lg font-bold">Create new personal category</h3>
            <h5 class="mb-2">Name for personal category</h5>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
            />
            <div class="modal-action">
              <form method="dialog">
                <button class="btn btn-outline btn-success">Create</button>
                <button class="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
    <div class="flex justify-between items-center p-4">
      <div class=" flex flex-col space-x-2 p-4">
        <div class="flex" on:click={() => edit_personal.showModal()}>
          <h1 class=" text-xl font-semibold">Reading</h1>
          <svg
            class="mt-1 ml-4"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1.4em"
            viewBox="0 0 24 24"
            ><path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 20h9M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
            /></svg
          >
        </div>
        <!-- DIALOG EDIT PERSONAL CATEGORY -->
        <dialog id="edit_personal" bind:this={edit_personal} class="modal">
          <div class="modal-box flex flex-col items-center text-center gap-2">
            <h3 class="text-lg font-bold">Edit personal category</h3>
            <!-- <h5 class="mb-2">Name</h5> -->
            <input
              type="text"
              placeholder="Enter Name"
              class="input input-bordered w-full max-w-xs mb-0"
            />
            <div class="modal-action">
              <form method="dialog">
                <button class="btn btn-outline btn-success">Edit</button>
                <button class="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
		<h2 class="text-xl font-semibold">Total: {total}</h2>
	</div>
      <div class="flex justify-end items-end">
        <button
          on:click={() => showContent('content1')}
          class="rounded-l-lg px-3 py-3 btn-outline btn-warning border"
          ><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
            ><path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
            /></svg
          ></button
        >
        <button
          on:click={() => showContent('content2')}
          class="rounded-r-lg px-3 py-3 btn-outline btn-warning border"
          ><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
            ><g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              ><rect width="20" height="6" x="2" y="4" rx="2" /><rect
                width="20"
                height="6"
                x="2"
                y="14"
                rx="2"
              /></g
            ></svg
          ></button
        >
      </div>
    </div>
    <div class="content {activeContent === 'content1' ? 'active' : ''}">
      <!-- <div class="flex flex-col gap-2.5 h-80"> -->
        {#each comics as comic}
          <div class="card p-2">
            <div class="card-body gird items-center rounded-lg shadow-md py-3 px-3">
              <div class="flex">
                <div class="flex items-center">
                  <img
                    src={comic.cover}
                    alt={comic.name}
                    class="w-42 h-56 rounded-lg object-cover"
                  />

                  <div class="flex-grow flex flex-col justify-evenly ml-4">
                    <div class="flex justify-between">
                      <div class="flex items-center space-x-2 mb-2">
                        <h2 class="text-l font-bold mb-0">{comic.name}</h2>
                        <span class="text-l text-gray-600 mb-0">{comic.author}</span>
                      </div>
                      <div class="flex mb-3" on:click={() => delete_comic1.showModal()}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.4em"
                          height="1.4em"
                          viewBox="0 0 24 24"
                          ><path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"
                          /></svg
                        >
                      </div>
                    </div>
                    <!-- DIALOG DELETE COMIC -->
                    <dialog id="delete_comic1" bind:this={delete_comic1} class="modal">
                      <div class="modal-box flex flex-col items-center text-center">
                        <svg
                          class="mx-auto mb-4 w-12 h-12 text-error"
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.4em"
                          height="1.4em"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4m0 4h.01" />
                          </g>
                        </svg>
                        <h3 class="text-lg font-bold">Are you sure you want to Delete Comic?</h3>
                        <div class="modal-action">
                          <form method="dialog">
                            <button class="btn btn-outline btn-error">Delete</button>
                            <button class="btn">Close</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                    <div class="divider custom-divider"></div>
                    <div class="flex justify-between">
                      <div class="flex gap-2 mt-4 mb-3">
                        <!-- {#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter} -->
                        {#each comic.tags as tag}
                          <a class="badge badge-outline">{tag}</a>
                        {/each}
                      </div>
                      <div class="flex gap-3 mb-1">
                        <div class="flex gap-1 my-auto bg-base-300 rounded px-2 mb-1">
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

                    <div class="flex gap-1 my-auto" on:click={() => delete_comic2.showModal()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.4em"
                        height="1.4em"
                        viewBox="0 0 24 24"
                        ><path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"
                        /></svg
                      >
                    </div>
                  </div>
                  <!-- DIALOG DELETE COMIC -->
                  <dialog id="delete_comic2" bind:this={delete_comic2} class="modal">
                    <div class="modal-box flex flex-col items-center text-center">
                      <svg
                        class="mx-auto mb-4 w-12 h-12 text-error"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.4em"
                        height="1.4em"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4m0 4h.01" />
                        </g>
                      </svg>
                      <h3 class="text-lg font-bold">Are you sure you want to Delete Comic?</h3>
                      <div class="modal-action">
                        <form method="dialog">
                          <button class="btn btn-outline btn-error">Delete</button>
                          <button class="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>

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
				<!-- chevron-left -->
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
				<!-- chevron-right -->
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
  <!-- </div> -->
</div>

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
