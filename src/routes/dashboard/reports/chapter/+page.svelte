<script lang="ts">
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import Picture from '$components/picture.svelte';
  import type ChapterReport from '$models/ChapterReport';
  import http from '$utils/http.js';
  import Time from 'svelte-time/Time.svelte';
  import { ChapterReportManagement } from '$utils/report-utils';
  import { onMount } from 'svelte';
  import InlineProfile from '../inline-profile.svelte';

  export let data: { token: string; reports: ChapterReport[] };

  let { token, reports = [] } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  const reportManagement = new ChapterReportManagement(data.token);

  let dismissalReasonModal: HTMLDialogElement;
  let currentReportId: string | null = null;
  let totals: number

  onMount(async () => {
    const chapterReportManager = new ChapterReportManagement('YOUR_TOKEN');
    try {
      const pagedReports = await chapterReportManager.getChapterReportsWithReasons();
      totals = pagedReports.totals;
      reports = pagedReports.results;
    } catch (err) {
      console.error(err);
    }
  });

  function openDismissalModal(reportId: string) {
    currentReportId = reportId;
    dismissalReasonModal.showModal();
  }

  async function submitDismissalReason() {
    const dismissalReasonInput = document.getElementById(
      'dismissalReasonInput'
    ) as HTMLTextAreaElement;
    const dismissalReason = dismissalReasonInput.value.trim();

    if (dismissalReason === '') {
      alert('Dismissal reason cannot be empty.');
      return;
    }

    if (currentReportId) {
      try {
        await reportManagement.updateChapterReported(currentReportId, 'Dismissed', dismissalReason);

   
        const updatedReports = await reportManagement.getChapterReportsWithReasons();
        reports = updatedReports.results;
      } catch (err) {
        console.error('Error updating dismissal reason:', err);
      }
    }

    dismissalReasonModal.close();
  }

  async function resolveReport(reportId: string) {
  try {

    await reportManagement.updateChapterReported(reportId, 'Resolved', '');

    const updatedReports = await reportManagement.getChapterReportsWithReasons();
    reports = updatedReports.results;
  } catch (err) {
    console.error('Error resolving report:', err);
  }
}

  async function handleDismissal(reportId: string, dismissalReason: string) {
    try {
      await reportManagement.updateChapterReported(reportId, 'Dismissed', dismissalReason);

      const updatedReports = await reportManagement.getChapterReportsWithReasons();
      reports = updatedReports.results;
    } catch (err) {
      console.error('Error updating dismissal reason:', err);
    }
  }
</script>

<Sublayout pageName="Chapter reports management">
  <span class="ml-6 text-xl">Totals: {totals}</span>
  <table class="table">
    <!-- head -->
    <thead>
      <tr class="text-base font-medium">
        <th>Detail</th>
        <th>Time</th>
        <th>Reporter</th>
        <th>Reason</th>
        <th>Description</th>
        <th>Status</th>
        <th>Dismissal Reason</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each reports as report (report.id)}
        <tr class="hover">
          <td>
            <a href="/comics/{report.chapter.comicId}/chapters/{report.chapter.number}">
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
                  <div>
                    <span>
                      <span>
                        Chapter {report.chapter.number}
                      </span>
                    </span>
                  </div>
                  <span class="text-ellipsis line-clamp-1 italic">{report.comic.authors}</span>
                </div>
              </div>
            </a>
          </td>
          <td><Time timestamp={report.creationTime} relative /></td>
          <td><InlineProfile profile={report.reporter} /></td>
          <td>{report.reason.content}</td>
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
            </span></td
          >
          <td
            >{#if report.dismissalReason}
              {report.dismissalReason}
            {:else}
              <span class="text-neutral italic">No dismissal reason provided</span>
            {/if}
          </td>
          <td>
            <div class="flex flex-wrap gap-2 justify-center">
              {#if report.status === 'Pending'}
                <button
                  class="btn btn-sm btn-success"
                  on:click={() => resolveReport(report.id)}
                  disabled={report.status !== 'Pending'}>Resolve</button
                >
                <button
                  class="btn btn-sm "
                  disabled={report.status !== 'Pending'}
                  on:click={() => openDismissalModal(report.id)}>Dismiss</button
                >
                <button class="btn btn-sm btn-error">Delete</button>
              {:else}
                <button class="btn btn-sm btn-success" disabled>Resolve</button>
                <button class="btn btn-sm btn-error" disabled>Dismiss</button>
              {/if}
            </div>
          </td>
        </tr>
      {:else}
        <span class="text-neutral italic">No chapter report yet.</span>
      {/each}
    </tbody>
  </table>
</Sublayout>

<dialog id="dismissalModal" class="modal" bind:this={dismissalReasonModal}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">Enter Dismissal Reason</h3>
    <textarea
      id="dismissalReasonInput"
      class="w-full border rounded p-2 resize-none"
      rows="4"
      placeholder="Enter dismissal reason..."
    ></textarea>
    <div class="modal-action">
      <button class="btn btn-sm btn-success" on:click={submitDismissalReason}>Submit</button>
      <button class="btn btn-sm" on:click={() => dismissalReasonModal.close()}>Cancel</button>
    </div>
  </div>
</dialog>
