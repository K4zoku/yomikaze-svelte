<script lang="ts">
  import Picture from '$components/picture.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import http from '$utils/http';
  import { onMount } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import InlineProfile from '../inline-profile.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let reports = [];
  let reasons = [];
  let totals: number;

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

  async function updateReportStatus(reportId: string, newStatus: string) {
    try {
      const response = await http.patch(`/reports/profile/${reportId}`, [
        {
          value: newStatus,
          path: '/status',
          op: 'replace',
          from: ''
        }
      ]);
      console.log(response.data);

      // Cập nhật trạng thái trong reports
      reports = reports.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: newStatus,
            isUpdating: true // Đặt cờ để vô hiệu hóa nút
          };
        }
        return r;
      });
    } catch (err) {
      console.error('Error updating report status:', err);
    }
  }

  onMount(async () => {
    await getProfileReports();
  });

  function isActionDisabled(status) {
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
        <th>Report Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#if reports.length > 0}
        {#each reports as report}
          <tr class="hover">
            <td class="p-2">
              <InlineProfile profile={report.profile}/>
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
              <InlineProfile profile={report.reporter}/>
            </td>
            <td class="p-2">
              <span
                class="font-semibold badge badge-outline"
                class:badge-warning={report.status === 'Pending'}
                class:badge-success={report.status === 'Resolved'}
                class:badge-error={report.status === 'Dismissed'}>{report.status}</span
              >
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
                on:click={() => updateReportStatus(report.id, 'Dismissed')}
              >
                Dismiss
              </button>
              </div>
              
            </td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan="6" class="text-center font-semibold italic">No profile reports found.</td>
        </tr>
      {/if}
    </tbody>
  </table>
</Sublayout>
