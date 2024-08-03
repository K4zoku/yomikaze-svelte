<script lang="ts">
  import http from '$utils/http';
  import Time from 'svelte-time/Time.svelte';
  import { onMount } from 'svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import InlineProfile from '../reports/inline-profile.svelte';
  import type { Withdrawal } from '$models/Withdrawal';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let withdrawals: Array<Withdrawal> = [];

  async function getProfile(userId: string) {
    try {
      const response = await http.get(`/profile/${userId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching profile for user ${userId}:`, err);
      return null;
    }
  }

  async function getWithdrawals() {
    try {
      const response = await http.get('/withdrawal');
      let w = response.data.results || [];

      withdrawals = await Promise.all(
        w.map(async (withdrawal: any) => {
          const profile = await getProfile(withdrawal.userId);
          return {
            ...withdrawal,
            profile: profile || {
              avatar: 'default-avatar-url',
              name: 'Unknown'
            },
            isUpdating: withdrawal.status !== 'Pending'
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function approveWithdrawal(withdrawalId: string) {
    try {
      const response = await http.put(`/withdrawal/${withdrawalId}/approve`);
      console.log(response.data);

      let index = withdrawals.findIndex((w) => w.id === withdrawalId);
      withdrawals[index] = {
        ...withdrawals[index],
        status: 'Approved',
        isUpdating: true
      };
      withdrawals = withdrawals; // trigger reactive update
    } catch (err) {
      console.error('Error approving withdrawal:', err);
    }
  }

  async function rejectWithdrawal(withdrawalId: string) {
    try {
      const response = await http.put(`/withdrawal/${withdrawalId}/reject`);
      console.log(response.data);

      let index = withdrawals.findIndex((w) => w.id === withdrawalId);
      withdrawals[index] = {
        ...withdrawals[index],
        status: 'Rejected',
        isUpdating: true
      };
      withdrawals = withdrawals; // trigger reactive update
    } catch (err) {
      console.error('Error rejecting withdrawal:', err);
    }
  }

  onMount(async () => {
    await getWithdrawals();
  });
</script>

<Sublayout pageName="Withrawal Mannagement">
  <table class="table">
    <thead>
      <tr class="text-base font-semibold">
        <th>User Name</th>
        <th>Amount</th>
        <th>Payment</th>
        <th>Payment Information</th>
        <th>Request Date</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each withdrawals as withdrawal (withdrawal.id)}
        <tr>
          <td>
            <InlineProfile profile={withdrawal.profile} />
          </td>
          <td>{withdrawal.amount} coins</td>
          <td>{(withdrawal.amount * 0.009).toFixed(2)}$</td>
          <td>{withdrawal.paymentInformation}</td>
          <td><Time timestamp={withdrawal.creationTime} relative /> </td>
          <td
            ><span
              class="font-semibold badge badge-outline"
              class:badge-warning={withdrawal.status === 'Pending'}
              class:badge-success={withdrawal.status === 'Approved'}
              class:badge-error={withdrawal.status === 'Rejected'}>{withdrawal.status}</span
            ></td
          >
          <td>
            <div class="flex gap-2">
              {#if !withdrawal.isUpdating}
                <button
                  class="btn btn-success btn-sm"
                  on:click={() => approveWithdrawal(withdrawal.id)}
                >
                  Approve
                </button>
                <button
                  class="btn btn-error btn-sm"
                  on:click={() => rejectWithdrawal(withdrawal.id)}
                >
                  Reject
                </button>
              {:else}
                <button class="btn btn-disabled btn-sm" disabled> Approved </button>
                <button class="btn btn-disabled btn-sm" disabled> Rejected </button>
              {/if}
            </div>
          </td>
        </tr>
      {:else}
        <td colspan="6" class="text-center font-semibold italic">No withdrawals request.</td>
      {/each}
    </tbody>
  </table>
</Sublayout>
