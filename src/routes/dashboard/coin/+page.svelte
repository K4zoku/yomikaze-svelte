<script lang="ts">
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import http from '$utils/http.js';
  import type CoinPricing from '$models/CoinPricing.js';
  import { getCoin, postCoinPricing, deleteCoinPricing, patchCoinPricing } from '$utils/coin-utils';
  import type PagedResult from '$models/PagedResult.js';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import type Pagination from '$models/Pagination.js';
  import Icon from '$components/icon.svelte';
  import type { Writable } from 'svelte/store';
  import type { ToastProps } from '~/routes/+layout.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let coinData: PagedResult<CoinPricing> = {
    currentPage: 1,
    pageSize: 25,
    totals: 0,
    totalPages: 0,
    results: []
  };
  let loading = true;
  let error = null;

  let newAmount: number = 0;
  let newPrice: number = 0;

  let addModal: HTMLDialogElement;
  let deleteModal: HTMLDialogElement;
  let editModal: HTMLDialogElement;

  let coinToEdit: CoinPricing | null = null;
  let editAmount: number = 0;
  let editPrice: number = 0;
  let coinToDelete: CoinPricing | null = null;

  const dispatch = createEventDispatcher();

  async function fetchCoinData(pagination?: Pagination) {
    try {
      coinData = await getCoin(pagination);
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  }

  async function handlePostCoinPricing() {
    try {
      const newCoin = await postCoinPricing(newAmount, newPrice);
      coinData.results.push(newCoin);
      coinData.totals += 1;
      coinData.totalPages = Math.ceil(coinData.totals / coinData.pageSize);
      addModal.close();
      addToast('Create coin pricing successful');
      newAmount = 0;
      newPrice = 0;
      dispatch('update');
    } catch (err) {
      error = err as Error;
    }
  }

  async function handleDeleteCoinPricing() {
    if (coinToDelete) {
      try {
        await deleteCoinPricing(coinToDelete.id);
        coinData.results = coinData.results.filter((coin) => coin.id !== coinToDelete.id);
        coinData.totals -= 1;
        coinData.totalPages = Math.ceil(coinData.totals / coinData.pageSize);
        coinToDelete = null;
        deleteModal.close();
        addToast('Delete coin pricing successful');
        dispatch('update');
      } catch (err) {
        error = err as Error;
      }
    }
  }

  async function handleEditCoinPricing() {
    if (coinToEdit) {
      try {
        const patchData = [
          { op: 'replace', path: '/amount', value: editAmount },
          { op: 'replace', path: '/price', value: editPrice }
        ];

        await patchCoinPricing(coinToEdit.id, patchData);
        coinToEdit.amount = editAmount;
        coinToEdit.price = editPrice;
        editModal.close();
        addToast('Edit coin pricing successful');
        dispatch('update');
      } catch (err) {
        error = err as Error;
      }
    }
  }

  function openDeleteModal(coin: CoinPricing) {
    coinToDelete = coin;
    deleteModal.showModal();
  }

  function openEditModal(coin: CoinPricing) {
    coinToEdit = coin;
    editAmount = coin.amount;
    editPrice = coin.price;
    editModal.showModal();
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

  onMount(() => {
    fetchCoinData();
  });
</script>

<Sublayout pageName="Coin pricing management">
  <div class="flex justify-end">
    <button class="btn btn-success btn-sm" on:click={() => addModal.showModal()}>
      <Icon icon="lucide--hand-coins" class="text-xl" />
      Create coin
    </button>
  </div>
  <table class="table table-lg mt-2">
    <thead>
      <tr class="text-base font-medium">
        <th>Amount</th>
        <th>Price</th>
        <th>Currency</th>
        <th>Creation Time</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each coinData.results as coin}
        <tr>
          <td>{coin.amount} coins</td>
          <td>{coin.price}$</td>
          <td>{coin.currency}</td>
          <td> <Time timestamp={coin.creationTime} relative /></td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-sm" on:click={() => openEditModal(coin)}>Edit</button>
              <button class="btn btn-error btn-sm" on:click={() => openDeleteModal(coin)}
                >Delete</button
              >
            </div>
          </td>
        </tr>
      {:else}
        <span class="text-neutral italic">No coin pricing yet.</span>
      {/each}
    </tbody>
  </table>
</Sublayout>

<!--! Modal create coin -->
<dialog bind:this={addModal} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Post Coin Pricing</h3>
    <div class="form-control">
      <label class="label" for="amount">Amount</label>
      <input
        class="input input-bordered"
        id="amount"
        type="number"
        bind:value={newAmount}
        min="1"
      />
    </div>
    <div class="flex gap-2">
      <div class="form-control mt-4">
        <label class="label" for="price">Price $</label>
        <input
          class="input input-bordered"
          id="price"
          type="number"
          bind:value={newPrice}
          min="1"
        />
      </div>
      <div class="form-control mt-4">
        <label class="label" for="price">Currency</label>
        <input class="input input-bordered" id="price" type="text" value="USD" readonly />
      </div>
    </div>

    <div class="modal-action">
      <button class="btn btn-success btn-sm" on:click={handlePostCoinPricing}>Post</button>
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<!-- ! Modal delete coin -->
<dialog id="delete_modal" class="modal" bind:this={deleteModal}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">Delete Coin Pricing</h3>
    {#if coinToDelete}
      <p class="py-4">
        Are you sure you want to delete this coin pricing?<br />
        <strong>Amount:</strong>
        {coinToDelete.amount} coins<br />
        <strong>Price:</strong>
        {coinToDelete.price}$<br />
        <strong>Currency:</strong>
        {coinToDelete.currency}
      </p>
      <div class="modal-action">
        <button class="btn btn-error btn-sm" on:click={handleDeleteCoinPricing}>Delete</button>
        <form method="dialog">
          <button class="btn btn-sm">Cancel</button>
        </form>
      </div>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<!--! Modal edit coin pricing -->
<dialog bind:this={editModal} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Edit Coin Pricing</h3>
    <div class="form-control">
      <label class="label" for="editAmount">Amount</label>
      <input
        class="input input-bordered"
        id="editAmount"
        type="number"
        bind:value={editAmount}
        min="1"
      />
    </div>
    <div class="flex gap-2">
      <div class="form-control mt-4">
        <label class="label" for="editPrice">Price $</label>
        <input
          class="input input-bordered"
          id="editPrice"
          type="number"
          bind:value={editPrice}
          min="1"
        />
      </div>
      <div class="form-control mt-4">
        <label class="label" for="editPrice">Currency</label>
        <input
          class="input input-bordered"
          type="text"
          value="USD"
         readonly
        />
      </div>
    </div>

    <div class="modal-action">
      <button class="btn btn-success btn-sm" on:click={handleEditCoinPricing}>Save</button>
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
