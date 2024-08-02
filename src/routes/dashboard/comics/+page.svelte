<script lang="ts">
  import http from '$lib/utils/http';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type Comic from '$models/Comic';
  import type { AxiosError } from 'axios';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import ComicCardDetails from '$components/yomikaze/common/comic/comic-card-details.svelte';
  import Icon from '$components/icon.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let comics: Comic[] = [];
  let comicToDelete: Comic | null = null;
  let comicName = '';
  let totals = 0;
  let deleteModal: any;

  const getComics = async (size = 1000) => {
    try {
      const response = await http.get('/comics/management', {
        params: {
          Size: size
        }
      });
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

  function openDeleteModal(comic) {
    comicToDelete = comic;
    comicName = comic.name;
    deleteModal.showModal();
  }
</script>

<Sublayout pageName="Comics Management">
  <div class="flex justify-end items-center">
    <a href="/comics/create" class="btn btn-accent">
      <span class="iconify lucide--plus text-2xl"></span>
      Create Comic
    </a>
  </div>

  <h3 class="text-xl font-semibold">{totals} comics</h3>

  <div class="py-6 flex flex-col gap-3">
    {#each comics as comic (comic.id)}
      <ComicCardDetails {comic}>
        <details
          slot="actions"
          class="dropdown dropdown-end dropdown-bottom flex items-center my-auto"
        >
          <summary class="btn btn-sm btn-circle">
            <span class="iconify lucide--ellipsis-vertical text-xl"></span>
          </summary>
          <ul class="dropdown-content menu menu-sm bg-base-100 rounded z-[1] w-52 p-2 shadow">
            <li>
              <a href="/comics/{comic.id}/edit">
                <Icon icon="lucide--pencil" class="text-xl" />
                Edit
              </a>
            </li>
            <li>
              <button on:click={() => openDeleteModal(comic)}>
                <Icon icon="lucide--trash-2" class="text-xl" />
                Delete
              </button>
            </li>
          </ul>
        </details>
      </ComicCardDetails>
    {/each}
  </div>
</Sublayout>

<dialog id="delete_modal" bind:this={deleteModal} class="modal">
  <div class="modal-box">
    <h3 class="text-xl font-bold">Are you sure you want to delete this comic?</h3>
    <p class="py-4">Comic: <strong>{comicName}</strong></p>
    <div class="modal-action">
      <button
        class="btn btn-error btn-sm"
        on:click={() => {
          if (comicToDelete) deleteComic(comicToDelete.id);
        }}>Confirm</button
      >
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
