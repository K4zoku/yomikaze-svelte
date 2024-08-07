<script lang="ts">
  import http from '$lib/utils/http';
  import { getContext, onMount, tick } from 'svelte';
  import type ComicReport from '$models/ComicReport';
  import Time from 'svelte-time/Time.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import Picture from '$components/picture.svelte';
  import InlineProfile from '../inline-profile.svelte';
  import type { Reason } from '$models/Reason';
    import type { Writable } from 'svelte/store';
    import type { ToastProps } from '~/routes/+layout.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let comicReports: Array<ComicReport> = [];
  let reasons: Array<Reason> = [];
  let reportToDismiss: ComicReport | null = null;
  let deleteModal: HTMLDialogElement;
  let dismissModal: HTMLDialogElement;
  let comicName = '';
  let comicCover: string = '';
  let comicId = '';
  let dismissalReason: string = '';
  let reportToDelete: any = null;
  let reportDetails: ComicReport | null = null;
  let comicTotals: number;

  async function getComicReports() {
    try {
      const response = await http.get('/reports/comic');
      comicTotals = response.data.totals;
      comicReports = response.data.results;
    } catch (error) {
      console.log(error);
    }
  }

  async function getReasons() {
    try {
      const response = await http.get('/reports/comic/reasons');
      reasons = response.data;
    } catch (error) {
      console.log(error);
    }
  }

  function getReasonContent(reasonId: string): string {
    const reason = reasons.find((r) => r.id === reasonId);
    return reason ? reason.content : 'Unknown reason';
  }

  async function deleteReport(id: string) {
    try {
      await http.delete(`/reports/comic/${id}`);
      comicReports = comicReports.filter((report) => report.id !== id);
      addToast('Delete comic successful.')
      deleteModal.close();
    } catch (error) {
      console.log(error);
    }
  }

  async function resolveReport(reportId: string) {
    try {
      await http.patch(`/reports/comic/${reportId}`, [
        {
          value: 'Resolved',
          path: '/status',
          op: 'replace'
        }
      ]);
      addToast('Update status successfull.')
      await getComicReports();
    } catch (error) {
      console.log(error);
    }
  }

  async function dismissReport(reportId: string) {
    try {
      await http.patch(`/reports/comic/${reportId}`, [
        {
          value: 'Dismissed',
          path: '/status',
          op: 'replace'
        },
        {
          value: dismissalReason,
          path: '/dismissalReason',
          op: 'replace'
        }
      ]);
      await getComicReports();
      dismissalReason = '';
      addToast('Update status successfull.')
      dismissModal.close();
    } catch (error) {
      console.log(error);
    }
  }

  function openDismissModal(report: ComicReport) {
    reportToDismiss = report;
    dismissModal.showModal();
  }

  function openDeleteModal(report: ComicReport) {
    reportToDelete = report;
    comicName = report.comic.name;
    comicCover = report.comic.cover;
    reportDetails = report;
    deleteModal.showModal();
  }

  const toasts = getContext<Writable<ToastProps[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', icon: 'lucide--circle-check-big' }
    ]);
  }

  function addErrToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-error', icon: 'lucide--circle-x' }
    ]);
  }

  onMount(() => {
    getComicReports();
    getReasons();
  });
</script>

<Sublayout pageName="Comic reports management">
  <span class="ml-6 text-xl">Totals: {comicTotals}</span>

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
          <td>{getReasonContent(report.reasonId)}</td>
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
            <span
              >{#if report.dismissalReason}
                {report.dismissalReason}
              {:else}
                <span class="text-neutral italic">No dismissal reason provided.</span>
              {/if}
            </span>
          </td>
          <td>
            <div class="flex flex-wrap gap-2 justify-center">
              {#if report.status === 'Pending'}
              <button class="btn btn-sm btn-success" on:click={() => resolveReport(report.id)}>
                <span>Resolve</span>
              </button>
              <button class="btn btn-sm" on:click={() => openDismissModal(report)}>
                <span>Dismiss</span>
              </button>
              <button class="btn btn-sm btn-error" on:click={() => openDeleteModal(report)}>
                <span>Delete</span>
              </button>
              {:else}
              <button class="btn btn-sm btn-success" disabled>Resolve</button>
              <button class="btn btn-sm btn-error" disabled>Dismiss</button>
              <button class="btn btn-sm btn-error" on:click={() => openDeleteModal(report)}
                >Delete</button
              >
              {/if}
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="7" class="text-center text-base-300 italic font-bold">
            <span>No Report Comic.</span>
          </td>
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
      <Picture
        src={comicCover}
        class="w-fit h-40 aspect-cover shrink-0"
        imgClass="w-fit h-40 aspect-cover boject-cover rounded-lg"
        useCdn={true}
      ></Picture>
      <div>
        <p>Comic: <strong>{comicName}</strong></p>
        {#if reportDetails}
          <p>Reporter: <strong>{reportDetails.reporter.name}</strong></p>
          <p>Reason: <strong> {getReasonContent(reportDetails.reasonId)}</strong></p>
          <p>Description: <strong>{reportDetails.description}</strong></p>
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

<!--! Dismiss Modal -->
<dialog id="dismiss_modal" class="modal" bind:this={dismissModal}>
  <div class="modal-box">
    <h3 class="text-xl font-bold">Enter dismissal reason for this comic report</h3>
    <div class="flex gap-2 pt-3">
      <textarea
        bind:value={dismissalReason}
        class="textarea textarea-accent w-full resize-none"
        placeholder="Enter dismissal reason ..."
        rows="4"
      ></textarea>
    </div>

    <div class="modal-action">
      <button
        class="btn btn-warning btn-sm"
        on:click={() => {
          if (reportToDismiss) {
            dismissReport(reportToDismiss.id, dismissalReason);
          }
        }}>Dismiss</button
      >
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
