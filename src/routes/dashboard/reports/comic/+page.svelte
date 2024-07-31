<script lang="ts">
  import http from '$lib/utils/http';
  import { onMount, tick } from 'svelte';
  import type ComicReport from '$models/ComicReport';
  import Time from 'svelte-time/Time.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import Picture from '$components/picture.svelte';
  import InlineProfile from '../inline-profile.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let comicReports: Array<ComicReport> = [];
  let deleteModal: any;
  let comicName = '';
  let comicCover = '';
  let comicId = '';
  let reportToDelete: any = null;
  let reportDetails: ComicReport | null = null;

  async function getComicReports() {
    try {
      const response = await http.get('/reports/comic');
      comicReports = response.data.results;
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  onMount(() => {
    getComicReports();
  });
</script>

<Sublayout pageName="Comic reports management">
  <table class="table lg:table-lg sm:table-sm xs:table-xs md:table-md">
    <thead>
      <tr class="text-base font-medium">
        <th>Detail</th>
        <th> Time </th>
        <th>Reporter</th>
        <th>Reason</th>
        <th>Description</th>
        <th>Status</th>
        <th>Dismissal Reason</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each comicReports as report (report.id)}
        <tr class="hover">
          <td>
            <a href="/comics/{report.comic.id}">
              <div class="flex gap-2">
                <Picture
                  src={report.comic.cover}
                  class="w-24 h-fit aspect-cover shrink-0"
                  imgClass="w-24 h-fit aspect-cover boject-cover rounded-lg"
                  useCdn={true}
                ></Picture>

                <div class="flex flex-col justify-between">
                  <div>
                    <span class="font-bold text-ellipsis line-clamp-2 p-1">
                      {report.comic.name}
                    </span>
                    <span class="text-sm text-ellipsis line-clamp-1">
                      {report.comic.aliases}
                    </span>
                  </div>

                  <span class="text-ellipsis line-clamp-1 italic">{report.comic.authors}</span>
                </div>
              </div>
            </a>
          </td>

          <td><Time timestamp={report.creationTime} relative /></td>
          <td><InlineProfile profile={report.reporter} /> </td>
          <td>reason</td>
          <td>
            {#if report.description}
              {report.description}
            {:else}
              <span class="text-neutral italic">No description provided.</span>
            {/if}
          </td>
          <td>
            <span
              class="font-semibold badge badge-outline"
              class:badge-warning={report.status === 'Pending'}
              class:badge-success={report.status === 'Resolved'}
              class:badge-error={report.status === 'Dismissed'}
            >
              {report.status}
            </span>
          </td>
          <td>
            <span> Dismissal Reason </span>
          </td>
          <td>
            <div class="flex gap-1 items-center">
              <button class="btn btn-sm btn-success">
                <span>Resolve</span>
              </button>
              <button class="btn btn-sm btn-error">
                <span>Dismiss</span>
              </button>
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="7" class="text-center text-base-300 italic font-bold">
            <span>No Report Comic.</span></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</Sublayout>

<!--! modal delete Comic -->
<dialog id="delete_modal" class="modal" bind:this={deleteModal}>
  <div class="modal-box">
    <h3 class="text-xl font-bold">Are you sure you want to delete this comic?</h3>
    <div class="flex gap-2 pt-3">
      <picture class="w-24 h-32 float-left"
        ><source class="w-24 h-32" srcset={comicCover} />
        <img class="float-left" src="https://placehold.co/84x120" alt="" />
      </picture>
      <div>
        <p>Comic: <strong>{comicName}</strong></p>
        {#if reportDetails}
          <p>Reporter: {reportDetails.reporter.name}</p>
          <p>Reason: {reportDetails.description}</p>
        {/if}
      </div>
    </div>

    <div class="modal-action">
      <button
        class="btn btn-error btn-sm"
        on:click={() => {
          deleteReport(reportToDelete.id);
        }}>Confirm</button
      >
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>

<!-- ToDo Modal Comment Chapter -->
