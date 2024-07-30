<script lang="ts">
  import http from '$lib/utils/http';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
    import type Comic from '$models/Comic';
    import type { AxiosError } from 'axios';

  let cover = 'https://i.yomikaze.org';
  let comics: Array<Comic> = [];
  let comicToDelete: Comic | null = null;
  let comicName = '';
  let totals = 0;
  let deleteModal: any;

  const getComics = async () => {
    try {
      const response = await http.get('/comics');
      if (response.status === 200) {
        console.log('Comics retrieved successfully:', response.data.results);
        return {
          results: response.data.results,
          totals: response.data.totals
        };
      } else {
        console.error('Unexpected response status:', response.status);
        return {
          results: [],
          totals: 0
        };
      }
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      return {
        results: [],
        totals: 0
      };
    }
  };

  const deleteComic = async (key: string) => {
    try {
      const response = await http.delete(`/comics/${key}`);
      comics = comics.filter((comic) => comic.id !== key);
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      comicToDelete = null;
      comicName = '';
      deleteModal.close();
    }
  };

  const fetchComics = async () => {
    const data = await getComics();
    comics = data.results;
    totals = data.totals;
  };

  onMount(() => {
    fetchComics();
  });

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/');
    }
  }

  function openDeleteModal(comic) {
    comicToDelete = comic;
    comicName = comic.name;
    deleteModal.showModal();
  }
</script>

<div class="container mx-auto mt-16">
  <div class="flex my-3 gap-2">
    <button on:click={goBack}>
      <span class="iconify lucide--arrow-left text-4xl text-center"></span>
    </button>
    <div>
      <span class="text-3xl font-semibold">Comics Management</span>
    </div>
  </div>

  <div class="ml-8">
    <a href="../create-comic" class="btn btn-warning"
      ><span class="iconify lucide--plus text-2xl"></span></a
    >
  </div>

  <h1 class="text-3xl font-semibold ml-8 mt-14">{totals} title</h1>

  <div class="mt-5 mb-10 flex flex-col gap-3 mx-auto w-11/12">
    {#each comics as comic (comic.id)}
      <div class="card hover:shadow-lg transition duration-300">
        <div class="card-body p-3 bg-base-100 rounded-lg drop-shadow-lg h-44">
          <div class="flex gap-1">
            <a href="/comics/{comic.id}" class="w-28 h-36">
              <picture class="w-24 h-32 float-left">
                <source class="w-24 h-32 object-cover" srcset={cover + comic.cover} />
                <img class="float-left" src="https://placehold.co/84x120" alt="" />
              </picture>
            </a>

            <div class="flex-grow flex flex-col justify-evenly ml-2">
              <div class="flex justify-between">
                <div class="flex gap-3 items-center">
                  <a href="/comics/{comic.id}" class="font-bold text-lg max-w-xl">{comic.name}</a>
                  <span
                    class="font-normal text text-lg text-center max-w-30 overflow-hidden max-h-14"
                    >{comic.authors}</span
                  >
                </div>

                <div class="flex gap-3">
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--star text-xl"></span>
                    <span class="text-lg">{comic.totalRatings}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--bookmark text-xl"></span>
                    <span class="text-base">{comic.totalFollows}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--eye text-xl"></span>
                    <span class="text-lg">{comic.totalViews}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--message-square text-xl"></span>
                    <span class="text-lg">{comic.totalComments}</span>
                  </div>
                  <div class="flex gap-1 items-center my-auto bg-base-200 rounded px-2">
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
                    <span class="text-base font-semibold">{comic.status}</span>
                  </div>
                  <details class="dropdown dropdown-bottom dropdown-left flex items-center my-auto">
                    <summary class="btn btn-sm btn-circle text-base">
                      <span class="iconify lucide--ellipsis-vertical text-xl"></span>
                    </summary>
                    <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                      <li>
                        <button
                          ><span class="iconify lucide--pencil text-xl"></span><span
                            class="text-base font-medium">Edit</span
                          >
                        </button>
                      </li>
                      <li>
                        <button on:click={() => openDeleteModal(comic)}>
                          <span class="iconify lucide--trash-2 text-xl"></span>
                          <span class="text-base font-medium">Delete</span>
                        </button>
                      </li>
                    </ul>
                  </details>
                </div>
              </div>

              <div class="flex gap-1 items-center py-2 border-t-2">
                {#each comic.tags as tag}
                  <span class="badge badge-outline">{tag.name}</span>
                {/each}
              </div>

              <div class="text-sm font-normal mt-2 md:max-h-14 sm:max-h-1 overflow-x-auto">
                <span class="text-base">{comic.description} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<dialog id="delete_modal" bind:this={deleteModal} class="modal">
  <div class="modal-box">
    <h3 class="text-xl font-bold">Are you sure you want to delete this comic?</h3>
    <p class="py-4 ">Comic: <strong>{comicName}</strong></p>
    <div class="modal-action">
      <button
        class="btn btn-error btn-sm"
        on:click={() => {
          deleteComic(comicToDelete.id);
        }}>Confirm</button
      >
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
