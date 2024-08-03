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
  import Time from 'svelte-time/Time.svelte';
  import InlineProfile from '../../reports/inline-profile.svelte';
  import type { Writable } from 'svelte/store';
  import type { ToastProps } from '~/routes/+layout.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let comics: Comic[] = [];
  let comicToDelete: Comic | null = null;
  let comicName = '';
  let comicPublisher = '';
  let comicAuthor: string[];
  let comicDescription: string | undefined;
  let totals = 0;
  let deleteModal: HTMLDialogElement;

  const getComics = async (size = 1000) => {
    try {
      const response = await http.get('/comics?status=OnGoing', {
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
      const response = await http.delete(`/comics/${key}`);
      comics = comics.filter((comic) => comic.id !== key);
      addToast('Deleted the comic successfully');
    } catch (error) {
      if (error) {
        console.log(error);
      }
    } finally {
      comicToDelete = null;
      comicName = '';
      comicPublisher = '';
      comicDescription;
      comicAuthor;
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

  const approveComic = async (key: string) => {
    try {
      await http.patch(`/comics/${key}`, {
        status: 'OnGoing'
      });
      comics = comics.filter((comic) => comic.id !== key);
      addToast('Comic status has been updated successfully');
    } catch (error) {
      console.log(error)
    }
  };

  function openDeleteModal(comic: Comic) {
    comicToDelete = comic;
    comicName = comic.name;
    comicPublisher = comic.publisher.name;
    comicAuthor = comic.authors;
    comicDescription = comic.description;
    deleteModal.showModal();
  }

  function closeDeleteModal() {
    deleteModal.close();
    comicToDelete = null;
    comicName = '';
  }

  const toasts = getContext<Writable<ToastProps[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', icon: 'lucide--circle-check-big' }
    ]);
  }
</script>

<Sublayout pageName="Comic publication resquest">
  <span class="text-xl ml-6">Totals: {totals}</span>
  <table class="table">
    <thead>
      <tr class="text-base font-medium">
        <th>Comic</th>
        <th>Description</th>
        <th>Publisher</th>
        <th>Creation Time</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each comics as comic (comic.id)}
        <tr>
          <th>
            <div class="flex gap-2">
              <Picture
                src={comic.cover}
                class="w-fit h-40 aspect-cover shrink-0"
                imgClass="w-fit h-40 aspect-cover boject-cover rounded-lg"
                useCdn={true}
              ></Picture>

              <div class="flex flex-col justify-between">
                <div>
                  <span class="font-bold text-ellipsis line-clamp-2 p-1">
                    {comic.name}
                  </span>
                  <span class="text-sm text-ellipsis line-clamp-1">
                    {comic.aliases}
                  </span>
                </div>
                <span>{comic.authors}</span>
              </div>
            </div></th
          >
          <td
            ><div class="max-h-40 overflow-y-auto">
              {comic.description}
            </div></td
          >
          <td><InlineProfile profile={comic.publisher} /></td>
          <td><Time timestamp={comic.creationTime} relative /></td>
          <td>
            <div class="flex gap-2 flex-wrap">
              <button class="btn btn-success btn-sm" on:click={() => approveComic(comic.id)}
                >Approve</button
              >
              <button class="btn btn-error btn-sm" on:click={() => openDeleteModal(comic)}
                >Delete</button
              >
            </div>
          </td>
        </tr>
      {:else}
        <span class="text-neutral italic"></span>
      {/each}
    </tbody>
  </table>
</Sublayout>

<!--! modal delete Comic -->
<dialog id="delete_modal" class="modal" bind:this={deleteModal}>
  <div class="modal-box">
    <h3 class="text-xl font-bold">Are you sure you want to delete this comic?</h3>
    <div class="flex gap-2 pt-3">
      <Picture
        src={comicToDelete ? comicToDelete.cover : ''}
        class="w-fit h-40 aspect-cover shrink-0"
        imgClass="w-fit h-40 aspect-cover boject-cover rounded-lg"
        useCdn={true}
      ></Picture>
      <div>
        <p>Comic: <strong>{comicName}</strong></p>
        <p>Authors: <strong>{comicAuthor}</strong></p>
        <p>Publisher: <strong>{comicPublisher}</strong></p>
        <p>Description:</p>
        <p class="max-h-40 overflow-y-auto">{comicDescription}</p>
      </div>
    </div>
    <div class="modal-action">
      <button class="btn btn-error btn-sm" on:click={() => deleteComic(comicToDelete.id)}
        >Confirm</button
      >

      <button class="btn btn-sm" on:click={closeDeleteModal}>Cancel</button>
    </div>
  </div>
</dialog>
