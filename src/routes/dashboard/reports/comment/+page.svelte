<script lang="ts">
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type CommentReport from '$models/CommentReport.js';
  import type PagedResult from '$models/PagedResult.js';
  import http from '$utils/http';
  import { CommentReportManagement } from '$utils/report-utils';
  import { onMount } from 'svelte';
  import InlineProfile from '../inline-profile.svelte';
  import type { Reason } from '$models/Reason';
  import Time from 'svelte-time/Time.svelte';

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

  async function handleStatusChange(report: CommentReport, status: string) {
    try {
      await commentReportService.updateCommentReportStatus(report.id, status);
      report.status = status;
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

  function dismissReport(reportId: string) {
    const report = reports.results.find((r) => r.id === reportId);
    if (report) {
      handleStatusChange(report, 'Dismissed');
    }
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
            <div class="flex flex-wrap justify-center gap-2">
              {#if report.status === 'Pending'}
              <button class="btn btn-sm btn-success" on:click={() => resolveReport(report.id)}
                >Resolve</button
              >
              <button class="btn btn-sm" on:click={() => dismissReport(report.id)}
                >Dismiss</button
              >
              <button class="btn btn-sm btn-error">Delete</button>
            {:else}
              <button class="btn btn-sm btn-success" disabled>Resolved</button>
              <button class="btn btn-sm btn-error" disabled>Dismissed</button>
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
