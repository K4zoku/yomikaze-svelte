<script lang="ts">
  import Picture from '$components/picture.svelte';
  import http from '$utils/http';
  import { onMount } from 'svelte';
  import Time from 'svelte-time/Time.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let reports = [];
  let reasons = [];

  async function getProfileReports() {
    try {
        const [reportsResponse, reasonsResponse] = await Promise.all([
        http.get('/reports/profile'),
        http.get('/reports/profile/reasons')
      ]);
      
      reports = reportsResponse.data.results || [];
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

  async function updateReportStatus(reportId, newStatus) {
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

<div class="container mt-16">
  <div class="flex justify-between">
    <span class="text-2xl font-semibold">Profile Report Management</span>
  </div>

  <table class="table">
    <thead>
      <tr class="text-base font-semibold">
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
          <tr class="border-b">
            <td class="p-2">
              {#if report.profileDetails}
                <a href="/profile/{report.profileDetails.id}" class="flex gap-3 my-3">
                  <div class="avatar">
                    <div
                      class="ring-4 ring-offset-4 ring-neutral ring-offset-base-100 w-8 aspect-square rounded-full bg-base-100"
                    >
                      {#if report.profileDetails.avatar}
                        <div>
                          <Picture
                            src={report.profileDetails.avatar}
                            alt="Avatar"
                            class="max-w-8 max-h-14"
                            imgClass="w-20 h-24 rounded-full"
                            useCdn={true}
                          />
                        </div>
                      {:else}
                        <div
                          class="w-8 h-10 flex justify-center items-center bg-gray-100 rounded-full"
                        >
                          <span class="iconify lucide--user text-8xl !text-base-content"></span>
                        </div>
                      {/if}
                    </div>
                  </div>
                  <span class="flex items-center font-semibold"> {report.profileDetails.name}</span>
                </a>
              {/if}
            </td>
            <td class="p-2">{report.reasonContent}</td>
            <td class="p-2">{report.description} none</td>
            <td class="p-2">
              <a href="/profile/{report.reporter.id}" class="flex gap-3">
                <div class="avatar">
                  <div
                    class="ring-4 ring-offset-4 ring-neutral ring-offset-base-100 w-8 aspect-square rounded-full bg-base-100"
                  >
                    {#if report.reporter.avatar}
                      <div>
                        <Picture
                          src={report.reporter.avatar}
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
                <span class="flex items-center font-semibold">{report.reporter.name}</span>
              </a>
            </td>
            <td class="p-2">
              <span
                class="font-semibold"
                class:text-warning={report.status === 'Pending'}
                class:text-success={report.status === 'Resolved'}
                class:text-error={report.status === 'Dismissed'}>{report.status}</span
              >
            </td>
            <td class="p-2"><Time timestamp={report.creationTime} relative /></td>
            <td class="p-2 flex gap-2">
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
</div>
