<script lang="ts">
  import http from '$utils/http.js';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import { getRoleRequests } from '$utils/role-request-utils';
  import type RoleRequest from '$models/RoleRequest';
  import { onMount } from 'svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let roleRequests: RoleRequest[] = [];
  let error: Error | null = null;

  onMount(async () => {
    try {
      roleRequests = await getRoleRequests();
    } catch (err) {
      error = err as Error;
    }
  });
</script>

<Sublayout pageName="Roles request management">
  <table class="table">
    <!-- head -->
    <thead>
      <tr class="text-base font-medium">
        <th>Detail</th>
        <th>Time</th>
        <th>Reporter</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Dismissal Reason</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      <tr>
        <!-- <td>
            <a href="/comics/{report.chapter.comicId}/chapters/{report.chapter.number}">
              <div class="flex gap-2">
                src={report.comic.cover}
                <Picture
                  src="/"
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
                          {report.comic.chapter}
                      </span>
                  </div>
                  <span class="text-ellipsis line-clamp-1 italic">{report.comic.authors}</span>
                </div>
              </div>
            </a>
          </td> -->
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>
          <!-- <InlineProfile profile={report.reporter} /> -->
          Blue</td
        >
        <td>Blue</td>
        <td
          >Blue
          <!-- <span
              class="font-semibold badge badge-outline"
              class:badge-warning={report.status === 'Pending'}
              class:badge-success={report.status === 'Resolved'}
              class:badge-error={report.status === 'Dismissed'}>{report.status}</span
            > -->
        </td>
        <td>Blue</td>
        <td
          ><button class="btn btn-sm btn-success">1</button>
          <button class="btn btn-sm btn-error">2</button></td
        >
      </tr>
    </tbody>
  </table>
</Sublayout>
