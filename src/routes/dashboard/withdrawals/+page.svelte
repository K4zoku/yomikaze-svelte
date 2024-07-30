<script lang="ts">
  import Icon from '$components/icon.svelte';
  import http from '$utils/http';
  import Picture from '$components/picture.svelte';
  import Time from 'svelte-time/Time.svelte';
  import { onMount } from 'svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  // let addModal: HTMLDialogElement | null = null;

  // let withdrawalAmount = 0;
  // let withdrawalPrice = 0;
  // let amountErr = '';
  // let errorMess = '';

  // async function postWithdrawal(amount) {
  //   try {
  //     const response = await http.post(`/withdrawal`, {
  //       amount: amount
  //     });

  //     return response.data;
  //   } catch (error) {
  //     const axiosError = error as AxiosError;
  //     const { response } = axiosError;
  //     if (response && response.status === 400) {
  //       let data = response.data as Problem;
  //       for (let key of Object.keys(data.errors)) {
  //         switch (key) {
  //           case 'Amount':
  //             amountErr = data.errors[key].at(0) ?? '';
  //             break;
  //           default:
  //             errorMess = 'An unknown error occurred';
  //             break;
  //         }
  //       }
  //     } else {
  //       errorMess = 'An unknown error occurred';
  //     }
  //     throw error;
  //   }
  // }

  // async function handlePostWithdrawal() {
  //   amountErr = '';
  //   errorMess = '';
  //   try {
  //     const result = await postWithdrawal(withdrawalAmount);
  //     console.log('Withdrawal posted successfully:', result);
  //     closeAddModal();
  //   } catch (error) {
  //     console.error('Error posting withdrawal:', error);
  //   }
  // }

  // function openAddModal() {
  //   addModal?.showModal();
  // }

  // function closeAddModal() {
  //   addModal?.close();
  // }
  let withdrawals = [];

  async function getWithdrawals() {
    try {
      const response = await http.get('/withdrawal');
      withdrawals = response.data.results || [];
      console.log(withdrawals);
    } catch (err) {
      console.error(err);
    }
  }

  onMount(async () => {
    await getWithdrawals();
  });
</script>

<div class="container mt-16">
  <div class="flex justify-between">
    <span class=" text-2xl font-semibold">Withrawal Management</span>
    <!-- <button on:click={openAddModal} class="btn btn-success btn-sm">Request Withdrawal</button> -->
  </div>

  <table class="table">
    <thead>
      <tr class="text-base font-semibold">
        <th>Amount</th>
        <th>Price</th>
        <th>User Name</th>
        <th>Creation Time</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        {#if withdrawals.length > 0}
          {#each withdrawals as withdrawal}
            <td>{withdrawal.amount}</td>
            <td>Price</td>
            <td>
              <a href="/profile/{withdrawal.profile.id}">
                <Picture
                  src={withdrawal.profile.avatar}
                  alt="Banner"
                  class="w-full h-56"
                  imgClass="w-full h-full object-cover object-top"
                  useCdn={true}
                ></Picture>
                {withdrawal.profile.name}</a
              >
            </td>
            <td><Time timestamp={withdrawal.creationTime} relative /> </td>
            <td>{withdrawal.status}</td>
            <td class="flex gap-2"
              ><button class="btn btn-sm btn-circle"
                ><Icon icon="lucide--square-pen" class="text-xl" /></button
              >
              <button class="btn btn-sm btn-circle"
                ><Icon icon="lucide--trash-2" class="text-xl" /></button
              >
            </td>
          {/each}
        {:else}
          <td colspan="6" class="text-center font-semibold italic">No withdrawals request.</td>
        {/if}
      </tr>
    </tbody>
  </table>
</div>

<!--! Modal for Post Withdrawal -->
<!-- <dialog id="withdrawal_modal" bind:this={addModal} class="modal">
  <div class="modal-box">
    <div class="text-center">
      <h2 class="text-2xl mb-4 font-bold">Withdrawal Request</h2>
    </div>
    {#if !!errorMess}
      <div role="alert" class="alert alert-error max-h-14 p-2">
        <Icon icon="lucide--circle-x" class="text-xl" />
        <span>{errorMess}</span>
      </div>
    {/if}
    <form on:submit|preventDefault={handlePostWithdrawal}>
      <label class="form-control">
        <div class="label">
          <span class="label-text">Withdrawal Amount</span>
        </div>
        <input
          type="number"
          bind:value={withdrawalAmount}
          placeholder="Enter amount to withdraw"
          min="0"
          class="input input-bordered w-full"
        />
      </label>
      <label class="form-control">
        <div class="label">
          <span class="label-text">Withdrawal Price</span>
        </div>
        <input
          type="number"
          bind:value={withdrawalAmount}
          placeholder="Enter amount to withdraw"
          min="0"
          class="input input-bordered w-full"
        />
      </label>
      {#if !!amountErr}
        <p class="text-error">{amountErr}</p>
      {/if}
      <div class="modal-action">
        <button type="submit" class="btn btn-success btn-sm">Submit</button>
        <button type="button" class="btn btn-sm" on:click={closeAddModal}>Cancel</button>
      </div>
    </form>
  </div>
</dialog> -->
