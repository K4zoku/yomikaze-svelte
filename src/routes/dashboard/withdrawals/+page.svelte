<script lang="ts">
  import Icon from '$components/icon.svelte';
  import http from '$utils/http';
  import Picture from '$components/picture.svelte';
  import Time from 'svelte-time/Time.svelte';
  import { onMount } from 'svelte';

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
      withdrawals = response.data.results || [];
      console.log(withdrawals);

      const profiles = await Promise.all(
        withdrawals.map(async (withdrawal: any) => {
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

      withdrawals = profiles;
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
      withdrawals = withdrawals.map((w) => {
        if (w.id === withdrawalId) {
          return {
            ...w,
            status: status,
            isUpdating: true // Đặt cờ để vô hiệu hóa nút
          };
        }
        return w;
      });
    } catch (err) {
      console.error('Error updating withdrawal status:', err);
    }
  }

  onMount(async () => {
    await getWithdrawals();
  });
</script>

<div class="container mt-16">
  <div class="flex justify-between">
    <span class=" text-2xl font-semibold">Withrawal Management</span>
  </div>

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
      {#if withdrawals.length > 0}
        {#each withdrawals as withdrawal}
          <tr>
            <td>
              {#if withdrawal.profile}
                <a href={`/profile/${withdrawal.userId}`} class="flex gap-3">
                  <div class="avatar">
                    <div
                      class="ring-4 ring-offset-4 ring-neutral ring-offset-base-100 w-8 aspect-square rounded-full bg-base-100"
                    >
                      {#if withdrawal.profile.avatar}
                        <div>
                          <Picture
                            src={withdrawal.profile.avatar}
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
                  <span class="flex items-center font-semibold">
                    {withdrawal.profile.name}
                  </span>
                </a>
              {:else}
                <span>Loading...</span>
              {/if}
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
                class:text-error={withdrawal.status === 'Rejected'}
              >{withdrawal.status}</span></td
            >
            <td class="flex gap-2">
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
            </td>
          </tr>
        {/each}
      {:else}
        <td colspan="6" class="text-center font-semibold italic">No withdrawals request.</td>
      {/if}
    </tbody>
  </table>
</div>
