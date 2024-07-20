<script lang="ts">
  // import SideBar from '../Side-Bar/+page.svelte';
  import { goto } from '$app/navigation';

  let roleRequestModal: HTMLDialogElement;
  let reportModal: HTMLDialogElement;
  let deleteCategoryModal: HTMLDialogElement;
  let createCategoryModal:HTMLDialogElement;

  function handleClick() {
    // goto('/'); // Điều hướng về trang chủ nếu không có lịch sử
  }

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
    }
  ];

  let profileData = {
    avatar: 'https://i.yomikaze.org/images/misc/73159321495658496.webp',
    banner: 'https://i.yomikaze.org/images/misc/72649699668123648.webp',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut enim vitae erat iaculis vulputate. Donec id velit diam.',
    name: 'Joysinh',
    birthday: '2002-07-19T10:20:37.881Z',
    balance: 3000,
    roles: ['Super', 'Admin'],
    id: 'string',
    creationTime: '2024-07-19T10:20:37.881Z',
    lastModification: '2024-07-19T10:20:37.881Z'
  };

  let activeContent = 'content1';

  function showContent(content) {
    activeContent = content;
  }
</script>

<div class="w-full aspect-[20/6]">
  <div class="w-full aspect-[20/6]">
    <img alt="" src={profileData.banner} class="w-full h-full object-cover" />
  </div>
  <!-- Avatar -->
  <div
    class="absolute w-full aspect-[20/6] top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100 backdrop-blur"
  >
    <div class="bottom-0 absolute flex gap-2">
      <div class="avatar">
        <div class="w-32 h-32 rounded-full shadow-lg ms-20 me-5">
          <img alt="" src={profileData.avatar} />
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-12">
        <h2 class="text-3xl font-semibold">{profileData.name}</h2>
        <div class="flex gap-1">
          {#each profileData.roles as role}
            <div class="badge badge-outline">{role}</div>
          {/each}
        </div>
        <span class="flex text-l font-medium"
          >{profileData.balance}
          <svg
            class="ms-1"
            xmlns="http://www.w3.org/2000/svg"
            width="1.4em"
            height="1.4em"
            viewBox="0 0 24 24"
            ><g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              ><circle cx="8" cy="8" r="6" /><path
                d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4"
              /><path d="m16.71 13.88l.7.71l-2.82 2.82" /></g
            ></svg
          >
        </span>
      </div>
    </div>
  </div>
</div>
<div class="container">
  <div class="flex ms-8 gap-4">
    <div class="flex flex-col mt-12 gap-2 w-1/6">
      <button on:click={handleClick} class="btn btn-outline btn-warning w-full">
        <span class="iconify lucide--edit text-xl"></span>
        Edit Profile
      </button>
      <button class="btn btn-outline btn-warning w-full" on:click={() => reportModal.showModal()}>
        <!-- badge-alert -->
        <span class="iconify lucide--alert-circle text-xl"></span>
        Report User
      </button>
      <dialog bind:this={reportModal} class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold mb-4">Report User</h3>
          <div class="flex items-center mb-4">
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img alt="" src={profileData.avatar} />
              </div>
            </div>
            <span class="ml-4 text-base font-medium">{profileData.name}</span>
          </div>
          <div class="divider"></div>
          <div class="mb-4">
            <label for="report-reason" class="block mb-2 font-medium">Reason</label>
            <select id="report-reason" class="select select-bordered w-2/3">
              <option value="">Copyright infringement</option>
              <option value="">Violation of website rules</option>
              <option value="">Disruptive behavior</option>
            </select>
          </div>
          <div class="mb-6">
            <label for="report-description" class="block mb-2 font-medium">Description</label>
            <textarea
              id="report-description"
              class="textarea textarea-bordered w-full"
              placeholder="Please provide additional details"
            ></textarea>
          </div>
          <div class="modal-action">
            <form method="dialog" class="flex space-x-2">
              <button type="submit" class="btn">Report</button>
              <button type="submit" class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <button class="btn btn-outline btn-warning w-full" on:click={() => roleRequestModal.showModal()}>
        <!-- user-round-check -->
        <span class="iconify lucide--user-round-check text-xl"></span>
        Change Role
      </button>
      <dialog bind:this={roleRequestModal} class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Change Role</h3>
          <h5 class="font-medium">User</h5>
          <div class="avatar">
            <div class="w-12 rounded-full mt-3">
              <img alt="" src={profileData.avatar} />
            </div>
            <span class="mt-6 ms-5">{profileData.name}</span>
          </div>
          <div class="divider"></div>
          <select class="select select-bordered w-full max-w-xs">
            <option value="">Admin</option>
            <option value="">Reader</option>
            <option value="">Publisher</option>
          </select>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Save</button>
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
    <div class="w-3/4">
      <div class="flex justify-end">
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
      <div class="content {activeContent === 'content1' ? 'active' : ''}">
        <div class="grid gap-3">
          <div class="">
            <h3 class="text-lg font-bold mb-2">Bio</h3>
            <p class="text-base">{profileData.bio}</p>
          </div>
        </div>
      </div>
      <div class="content {activeContent === 'content2' ? 'active' : ''}">
        <div class="flex flex-col gap-2.5 h-80">
          <h3 class="text-lg font-bold mb-2">Comic I Wrote</h3>
          {#each comics as comic}
            <div class="card">
              <div class="card-body gird items-center rounded-lg shadow-md">
                <div class="flex gap-1">
                  <div class="flex items-center">
                    <img
                      src={comic.cover}
                      alt={comic.name}
                      class="w-42 h-56 rounded-lg object-cover mb-auto"
                    />

                    <div class="flex-grow flex flex-col justify-evenly ml-2">
                      <div class="flex justify-between">
                        <div class="flex items-center space-x-2 mb-2">
                          <h2 class="text-l font-bold mb-0">{comic.name}</h2>
                          <span class="text-l text-gray-600 mb-0">{comic.author}</span>
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
                          <div class="dropdown dropdown-left">
                            <span
                              tabindex="0"
                              role="button"
                              class="iconify lucide--more-vertical text-xl"
                            ></span>
                            <ul
                              tabindex="0"
                              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                              <li>
                                <a on:click={() => {createCategoryModal.showModal()}}>
                                  <span class="flex iconify lucide--edit text-xl"></span>
                                  <span>Edit Comic</span>
                                </a>
                              </li>
                              <li>
                                <a on:click={() => {deleteCategoryModal.showModal()}}>
                                  <span class="flex iconify lucide--trash-2 text-xl"></span>
                                  <span>Delete Comic</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="divider custom-divider"></div>

                      <div class="flex gap-2 mt-4 mb-3">
                        <!-- {#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter} -->
                        {#each comic.tags as tag}
                          <a class="badge badge-outline">{tag}</a>
                        {/each}
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
    </div>
  </div>
</div>

 <!-- DIALOG CREATE PERSONAL CATEGORY -->
 <dialog bind:this={createCategoryModal} class="modal">
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
