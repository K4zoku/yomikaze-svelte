<script lang="ts">
  import Picture from '$components/picture.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import http from '$utils/http';
  import { getContext, onMount } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import InlineProfile from '../inline-profile.svelte';
    import { writable, type Writable } from 'svelte/store';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let reports = [];
  let reasons = [];
  let totals: number;
  let dismissalReasonModal: HTMLDialogElement;
  const dismissalReason = writable("");
  let currentReportId: string | null = null;

  async function getProfileReports() {
    try {
      const [reportsResponse, reasonsResponse] = await Promise.all([
        http.get('/reports/profile'),
        http.get('/reports/profile/reasons')
      ]);

      reports = reportsResponse.data.results || [];
      totals = reportsResponse.data.totals;
      reasons = reasonsResponse.data || [];

      const reasonsMap = reasons.reduce((map, reason) => {
        map[reason.id] = reason.content;
        return map;
      }, {});

      const profilePromises = reports.map(async (report) => {
        try {
          const profileResponse = await http.get(`/profile/${report.profileId}`);
          return {
            ...report,
            profileDetails: profileResponse.data,
            reasonContent: reasonsMap[report.reasonId] || 'Unknown Reason',
            isUpdating: report.status !== 'Pending'
          };
        } catch (profileErr) {
          console.error(`Error fetching profile for ${report.profileId}:`, profileErr);
          return {
            ...report,
            profileDetails: null,
            reasonContent: reasonsMap[report.reasonId] || 'Unknown Reason',
            isUpdating: report.status !== 'Pending'
          };
        }
      });

      reports = await Promise.all(profilePromises);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateReportStatus(reportId: string, newStatus: string, reason: string = '') {
    try {
      const response = await http.patch(`/reports/profile/${reportId}`, [
        {
          value: newStatus,
          path: '/status',
          op: 'replace',
          from: ''
        },
        {
          value: reason,
          path: '/dismissalReason',
          op: 'replace',
          from: ''
        }
      ]);
      console.log(response.data);

      reports = reports.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: newStatus,
            dismissalReason: reason,
            isUpdating: true
          };
        }
        return r;
      });
      addToast('Update status successful.');
    } catch (err) {
      console.error('Error updating report status:', err);
    }
  }

  function openDismissalModal(reportId: string) {
    currentReportId = reportId;
    dismissalReasonModal.showModal();
  }

  async function submitDismissalReason() {
    const reason = $dismissalReason.trim();

    if (reason === '') {
      alert('Dismissal reason cannot be empty.');
      return;
    }

    if (currentReportId) {
      await updateReportStatus(currentReportId, 'Dismissed', reason);
      dismissalReasonModal.close();
    }
  }

  onMount(async () => {
    await getProfileReports();
  });

  const toasts = getContext<Writable<any[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', icon: 'lucide--circle-check-big' }
    ]);
  }

  function isActionDisabled(status: string) {
    return status !== 'Pending';
  }
</script>

<Sublayout pageName="Profile reports management">
  <span class="ml-6 text-xl">Totals: {totals}</span>
  <table class="table rounded">
    <thead>
      <tr class="text-base font-semibold bg-base-200 table-pin-rows">
        <th>Reported Profile</th>
        <th>Reason</th>
        <th>Description</th>
        <th>Reporter Name</th>
        <th>Status</th>
        <th>Dismissal Reason</th>
        <th>Report Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each reports as report}
        <tr class="hover">
          <td class="p-2">
            <InlineProfile profile={report.profile} />
          </td>
          <td class="p-2">{report.reasonContent}</td>
          <td class="p-2">
            {#if report.description}
              {report.description}
            {:else}
              <span class="text-neutral italic">No description provided.</span>
            {/if}
          </td>
          <td class="p-2">
            <InlineProfile profile={report.reporter} />
          </td>
          <td class="p-2">
            <span
              class="font-semibold badge badge-outline"
              class:badge-warning={report.status === 'Pending'}
              class:badge-success={report.status === 'Resolved'}
              class:badge-error={report.status === 'Dismissed'}>{report.status}</span
            >
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
          <td class="p-2"><Time timestamp={report.creationTime} relative /></td>
          <td class="p-2">
            <div class="flex items-center gap-2">
              <button
                class="btn btn-success btn-sm"
                disabled={isActionDisabled(report.status) || report.isUpdating}
                on:click={() => updateReportStatus(report.id, 'Resolved')}
              >
                Resolve
              </button>
              <button
                class="btn btn-error btn-sm"
                disabled={isActionDisabled(report.status) || report.isUpdating}
                on:click={() => openDismissalModal(report.id)}
              >
                Dismiss
              </button>
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="6" class="text-center font-semibold italic">No profile reports found.</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Sublayout>


<dialog id="dismissalModal" class="modal" bind:this={dismissalReasonModal}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">Enter Dismissal Reason</h3>
    <textarea
      bind:value={$dismissalReason}
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