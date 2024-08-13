<script lang="ts">
  import http from '$lib/utils/http';
  import { goto } from '$app/navigation';
  import { getContext, onMount } from 'svelte';
  import type Comic from '$models/Comic';
  import type { AxiosError } from 'axios';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import ComicCardDetails from '$components/yomikaze/common/comic/comic-card-details.svelte';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
    import type { Writable } from 'svelte/store';
    import type { ToastProps } from '~/routes/+layout.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let comics: Comic[] = [];
  let comicToDelete: Comic | null = null;
  let comicName = '';
  let comicCover: string = '';
  let comicAuthor: string = '';
  let comicDescription: string = '';
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
      console.log(error);
      return {
        results: [],
        totals: 0
      };
    }
  };

  const deleteComic = async (key: string) => {
    try {
      await http.delete(`/comics/${key}`);
      comics = comics.filter((comic) => comic.id !== key);
      addToast('Delete Comic Successfull.')
    } catch (error) {
      console.log(error);
    } finally {
      comicToDelete = null;
      comicName = '';
      comicCover = '';
      comicAuthor = '';
      comicDescription = '';
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

  function openDeleteModal(comic: Comic) {
    comicToDelete = comic;
    comicName = comic.name;
    comicAuthor = comic.authors;
    comicDescription = comic.description;
    comicCover = comic.cover;
    deleteModal.showModal();
  }

  const toasts = getContext<Writable<ToastProps[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', icon: 'lucide--circle-check-big' }
    ]);
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

<dialog id="delete_modal" class="modal" bind:this={deleteModal}>
  <div class="modal-box">
    <h3 class="text-xl font-bold">Are you sure you want to delete this comic?</h3>
    <div class="flex gap-2 pt-3">
      <Picture
        src={comicCover}
        class="w-fit h-40 aspect-cover shrink-0"
        imgClass="w-fit h-40 aspect-cover boject-cover rounded-lg"
        useCdn={true}
      ></Picture>
      <div>
        <p>Comic: <strong>{comicName}</strong></p>
        <p>Author: {comicAuthor}</p>
        <p>Description:</p>
        <div class="h-20 max-h-20 overflow-auto">
          <p>{comicDescription}</p>
        </div>
      </div>
    </div>

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
