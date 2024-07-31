<script lang="ts">
  import Icon from '$components/icon.svelte';
  import http from '$utils/http';
  import Picture from '$components/picture.svelte';
  import Time from 'svelte-time/Time.svelte';
  import { onMount } from 'svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import InlineProfile from '../reports/inline-profile.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let withdrawals = [];

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
      // console.log(withdrawals);

      withdrawals = await Promise.all(
        w.map(async (withdrawal: any) => {
          const profile = await getProfile(withdrawal.userId);
          return {
            ...withdrawal,
            profile: profile || {
              avatar: 'default-avatar-url', // URL avatar mặc định
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

  async function updateStatus(withdrawalId: string, status: string) {
    try {
      const response = await http.patch(`/withdrawal/${withdrawalId}`, [
        {
          value: status,
          path: '/status',
          op: 'replace',
          from: ''
        }
      ]);
      console.log(response.data);

      // Cập nhật trạng thái trong withdrawals
      let index = withdrawals.findIndex((w) => w.id === withdrawalId);
      withdrawals[index] = {
        ...withdrawals[index],
        status: status,
        isUpdating: true // Đặt cờ để vô hiệu hóa nút
      };
      withdrawals = withdrawals; //trigger reactive
    } catch (err) {
      console.error('Error updating withdrawal status:', err);
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
              class="font-semibold"
              class:text-warning={withdrawal.status === 'Pending'}
              class:text-success={withdrawal.status === 'Approved'}
              class:text-error={withdrawal.status === 'Rejected'}>{withdrawal.status}</span
            ></td
          >
          <td >
            <div class="flex gap-2">
              {#if !withdrawal.isUpdating}
                <button
                  class="btn btn-success btn-sm"
                  on:click={() => updateStatus(withdrawal.id, 'Approved')}
                >
                  Approve
                </button>
                <button
                  class="btn btn-error btn-sm"
                  on:click={() => updateStatus(withdrawal.id, 'Rejected')}
                >
                  Reject
                </button>
              {:else}
                <button class="btn btn-disabled btn-sm" disabled> Approve </button>
                <button class="btn btn-disabled btn-sm" disabled> Reject </button>
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
