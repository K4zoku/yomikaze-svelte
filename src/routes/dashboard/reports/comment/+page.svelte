<script lang="ts">
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type CommentReport from '$models/CommentReport.js';
  import type PagedResult from '$models/PagedResult.js';
  import http from '$utils/http';
  import { CommentReportManagement } from '$utils/report-utils';
  import { getContext, onMount } from 'svelte';
  import InlineProfile from '../inline-profile.svelte';
  import type { Reason } from '$models/Reason';
  import Time from 'svelte-time/Time.svelte';
  import Picture from '$components/picture.svelte';
  import type { Writable } from 'svelte/store';
  import type { ToastProps } from '~/routes/+layout.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let totals: number;
  let commentReportService: CommentReportManagement;
  let reports: PagedResult<CommentReport> = {
    currentPage: 0,
    pageSize: 1000,
    totals: 0,
    totalPages: 0,
    results: []
  };

  let deleteModal: HTMLDialogElement;
  let commentToDelete: CommentReport | null = null;

  let dismissalModal: HTMLDialogElement;
  let commentToDismiss: CommentReport | null = null;
  let dismissalReason: string = '';

  onMount(async () => {
    commentReportService = new CommentReportManagement(token);
    await fetchCommentReportsWithReasons();
  });

  async function fetchCommentReportsWithReasons(page: number = 1) {
    try {
      reports = await commentReportService.getCommentReportsWithReasons(page);
    } catch (error) {
      console.error('Failed to fetch comment reports', error);
    }
  }

  async function handleStatusChange(report: CommentReport, status: string, dismissalReason?: string) {
    try {
      await commentReportService.updateCommentReportStatus(report.id, status, dismissalReason);
      report.status = status;
      if (dismissalReason) {
        report.dismissalReason = dismissalReason;
      }
      reports = { ...reports };
    } catch (error) {
      console.error('Failed to update comment report status', error);
    }
  }

  function resolveReport(reportId: string) {
    const report = reports.results.find((r) => r.id === reportId);
    if (report) {
      handleStatusChange(report, 'Resolved');
    }
  }

  function confirmDismissReport(report: CommentReport) {
    commentToDismiss = report;
    dismissalReason = '';
    dismissalModal.showModal();
  }

  async function dismissReport() {
    if (commentToDismiss) {
      await handleStatusChange(commentToDismiss, 'Dismissed', dismissalReason);
      addToast('Update status success.')
      dismissalModal.close();
    }
  }

  function confirmDeleteReport(report: CommentReport) {
    commentToDelete = report;
    deleteModal.showModal();
  }

  async function deleteReport() {
    if (commentToDelete) {
      try {
        await commentReportService.deleteCommentReport(commentToDelete.id);
        reports.results = reports.results.filter((r) => r.id !== commentToDelete.id);
        reports.totals--;
        addToast('Delete comment successfull');
        deleteModal.close();
      } catch (error) {
        console.error('Failed to delete comment report', error);
      }
    }
  }

  const toasts = getContext<Writable<ToastProps[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', icon: 'lucide--circle-check-big' }
    ]);
  }
</script>

<Sublayout pageName="Comment Reports Management">
  <span class="ml-6 text-xl">Totals: {reports.totals}</span>
  <table class="table">
    <thead>
      <tr class="text-base font-medium">
        <th>Author</th>
        <th>Comment</th>
        <th>Description</th>
        <th>Time</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Dismissal Reason</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each reports.results as report}
        <tr class="hover">
          <td> <InlineProfile profile={report.comment.author} /></td>
          <td>{report.comment.content}</td>
          <td
            >{#if report.description}
              {report.description}
            {:else}
              <span class="text-neutral italic">No description provided.</span>
            {/if}
          </td>
          <td><Time timestamp={report.creationTime} relative /></td>
          <td>{report.reason.content}</td>
          <td
            ><span
              class="font-semibold badge badge-outline"
              class:badge-warning={report.status === 'Pending'}
              class:badge-success={report.status === 'Resolved'}
              class:badge-error={report.status === 'Dismissed'}
            >
              {report.status}
            </span></td
          >
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
            <div class="flex flex-wrap justify-center gap-2">
              {#if report.status === 'Pending'}
                <button class="btn btn-sm btn-success" on:click={() => resolveReport(report.id)}
                  >Resolve</button
                >
                <button class="btn btn-sm" on:click={() => confirmDismissReport(report)}>Dismiss</button
                >
                <button class="btn btn-sm btn-error" on:click={() => confirmDeleteReport(report)}
                  >Delete</button
                >
              {:else}
                <button class="btn btn-sm btn-success" disabled>Resolved</button>
                <button class="btn btn-sm btn-error" disabled>Dismissed</button>
                <button class="btn btn-sm btn-error" on:click={() => confirmDeleteReport(report)}
                  >Delete</button
                >
              {/if}
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="5" class="text-center">No comment reports found.</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Sublayout>

<dialog bind:this={deleteModal} id="delete-modal" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Confirm Deletion</h3>
    <p class="py-4">Are you sure you want to delete this comment report?</p>
    {#if commentToDelete}
      <div class="py-4">
        <div class="flex items-center space-x-4">
          <div class="avatar w-8 h-8 shrink-0">
            <div
              class="ring-4 ring-offset-4 ring-neutral ring-offset-base-100 w-8 aspect-square rounded-full bg-base-100 shrink-0"
            >
              {#if commentToDelete.comment.author.avatar}
                <div>
                  <Picture
                    src={commentToDelete.comment.author.avatar}
                    alt="Avatar"
                    class="max-w-8 max-h-14"
                    imgClass="w-20 h-24 rounded-full"
                    useCdn={true}
                  />
                </div>
              {:else}
                <div
                  class="w-full h-full flex justify-center items-center bg-gray-100 rounded-full"
                >
                  <span class="iconify lucide--user text-8xl !text-base-content"></span>
                </div>
              {/if}
            </div>
          </div>
          <div class="bg-base-100 border-2 border-neutral rounded-lg w-full p-2">
            <p class="font-bold">{commentToDelete.comment.author.name}</p>
            <p>{commentToDelete.comment.content}</p>
          </div>
        </div>
      </div>
    {/if}
    <div class="modal-action">
      <button class="btn btn-error btn-sm" on:click={deleteReport}>Delete</button>
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>

<!--! Dismissal Reason Modal -->
<dialog bind:this={dismissalModal} id="dismissal-modal" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Enter dismissal reason for this comment report</h3>
    <textarea bind:value={dismissalReason} class="textarea textarea-bordered w-full resize-none" rows='4'></textarea>
    <div class="modal-action">
      <button class="btn btn-warning btn-sm" on:click={dismissReport}>Dismiss</button>
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>