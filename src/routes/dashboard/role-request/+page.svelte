<script lang="ts">
  import http from '$utils/http.js';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import { getRoleRequests } from '$utils/role-request-utils';
  import type RoleRequest from '$models/RoleRequest';
  import { onMount } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import InlineProfile from '../reports/inline-profile.svelte';

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
        <th>User</th>
        <th>Role Current</th>
        <th>Reason</th>
        <th>Time</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each roleRequests as request (request.id)}
        <tr class="hover">
          <td>
            <InlineProfile profile={request.user} />
          </td><td>{request.user.roles}</td>
          <td>{request.reason}</td>
          <td><Time timestamp={request.creationTime} relative /></td>
          <td>{request.status}</td>
          <td
            ><button class="btn">1</button>
            <button class="btn">2</button>
          </td>
        </tr>
      {:else}
        <span class="text-neutral italic">No request yet.</span>
      {/each}
    </tbody>
  </table>
</Sublayout>
