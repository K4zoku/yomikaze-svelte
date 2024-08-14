<script lang="ts">
  import http from '$utils/http.js';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import {
    approveRoleRequest,
    rejectRoleRequest,
    getRoleRequests
  } from '$utils/role-request-utils';
  import type RoleRequest from '$models/RoleRequest';
  import { getContext, onMount } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import InlineProfile from '../reports/inline-profile.svelte';
  import type { Writable } from 'svelte/store';
  import type { ToastProps } from '~/routes/+layout.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let roleRequests: RoleRequest[] = [];
  let totalRequests: number = 0;
  let error: Error | null = null;

  async function handleApproveRequest(id: string) {
    try {
      await approveRoleRequest(id);

      roleRequests = roleRequests.map((request) =>
        request.id === id ? { ...request, status: 'Approved' } : request
      );

      addToast('Role request has been successfully approved!');
    } catch (err) {
      error = err as Error;

      addErrToast('Failed to approve role request.');
    }
  }

  async function handleRejectRequest(id: string) {
    try {
      await rejectRoleRequest(id);
      roleRequests = roleRequests.map((request) =>
        request.id === id ? { ...request, status: 'Rejected' } : request
      );
      addToast('Role request has been successfully rejected!');
    } catch (err) {
      error = err as Error;
      addErrToast('Failed to reject role request.');
    }
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
          </td>

          <td>
            {#each request.user.roles as role}
              <span class="badge badge-outline mx-1">{role} </span>
            {/each}
          </td>

          <td>{request.reason}</td>
          <td><Time timestamp={request.creationTime} relative /></td>
          <td>
            <span
              class="font-semibold badge badge-outline"
              class:badge-warning={request.status === 'Pending'}
              class:badge-success={request.status === 'Approved'}
              class:badge-error={request.status === 'Rejected'}
            >
              {request.status}
            </span>
          </td>
          <td>
            {#if request.status === 'Approved' || request.status === 'Rejected'}
              <button class="btn btn-sm btn-accent" disabled> Approved </button>
              <button class="btn btn-sm btn-error" disabled>Rejected</button>
            {:else}
              <button
                on:click={() => handleApproveRequest(request.id)}
                class="btn btn-sm btn-success"
              >
                Approve
              </button>
              <button on:click={() => handleRejectRequest(request.id)} class="btn btn-sm btn-error"
                >Reject</button
              >
            {/if}
          </td>
        </tr>
      {:else}
        <span class="text-neutral italic">No request yet.</span>
      {/each}
    </tbody>
  </table>
</Sublayout>
