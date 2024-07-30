<script lang="ts">
  import http from '$utils/http';
  import Swap from '$components/daisyui/actions/swap.svelte';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import ComicList from '$components/yomikaze/common/comic/comic-list.svelte';
  import type AuthDataStore from '$models/AuthDataStore';
  import type Pagination from '$models/Pagination.js';
  import { getComics, type GetComicsOptions } from '$utils/comic-utils.js';
  import { getContext, tick, type ComponentType } from 'svelte';
  import Toast from '../../../lib/components/daisyui/toast.svelte';
  import type { Writable } from 'svelte/store';
  import type { ToastProps } from '~/routes/+layout.svelte';
  import type { AxiosError } from 'axios';
  import type Problem from '$models/ProblemResponse';

  let roleRequestModal: HTMLDialogElement;
  let reportModal: HTMLDialogElement;
  let addModal: HTMLDialogElement;
  let withdrawalAmount = 0;
  let withdrawalPrice = 0;

  let amountErr = '';
  let errorMess = '';

  export let data;
  let { profile } = data;

  const authStore = getContext<AuthDataStore>('auth');
  const currentUser = authStore?.user;
  const isSelf = profile.id === $currentUser?.id;
  async function loadComics(pagination: Pagination) {
    search.page = pagination.page;
    search.size = pagination.size ?? 6;
    search.publisherId = profile.id;
    return await getComics({ ...search });
  }
  let search: GetComicsOptions = {
    name: '',
    page: 1,
    size: 6,
    orderBy: ['name']
  };

  let sortType = false;
  let sortOrder = false;

  let sortMapping = ['name', 'nameDesc', 'creationTime', 'creationTimeDesc'];

  async function updateSort() {
    search.orderBy = [sortMapping[(+sortType << 1) | +sortOrder]];
    await tick();
    reload();
  }

  async function handleOnSearch() {
    await tick();
    reload();
  }

  let reload = () => {};

  function handleShareProfile(event: MouseEvent) {
    if (event.target instanceof HTMLAnchorElement) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(event.target.href);
        addToast('Profile link copied to clipboard!');
      }
    }
  }

  async function postWithdrawal(amount: number) {
    try {
      const response = await http.post(`/withdrawal`, {
        amount: amount
        // price: price
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const { response } = axiosError;
      if (response && response.status === 400) {
        let data = response.data as Problem;
        for (let key of Object.keys(data.errors)) {
          switch (key) {
            case 'Amount':
              amountErr = data.errors[key].at(0) ?? '';
              break;
            default:
              errorMess = 'An unknown error occurred';
              break;
          }
        }
      } else {
        errorMess = 'An unknown error occurred';
      }
      throw error;
    }
  }

  async function handlePostWithdrawal() {
    amountErr = '';
    errorMess = '';
    try {
      const result = await postWithdrawal(withdrawalAmount);
      console.log('Withdrawal posted successfully:', result);
      addToast('Withdrawal request successful');
      closeAddModal();
    } catch (error) {
      console.error('Error posting withdrawal:', error);
    }
  }

  function openAddModal() {
    addModal?.showModal();
  }

  function closeAddModal() {
    addModal?.close();
  }

  const toasts = getContext<Writable<ToastProps[]>>('toasts');
  function addToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', icon: 'lucide--circle-check-big' }
    ]);
  }
</script>

<svelte:head>
  <title>Profile - {profile.name}</title>
</svelte:head>
<div class="w-full h-56 min-h-56 max-h-56 select-none relative z-0 mb-16">
  <Picture
    src={profile.banner}
    alt="Banner"
    class="w-full h-56"
    imgClass="w-full h-full object-cover object-top"
    useCdn={true}
  />
  <!-- Avatar -->
  <div
    class="absolute min-w-[0] h-full w-full top-0 left-0 bg-gradient-to-b from-base-100/60 to-base-100 flex items-end"
  >
    <div class="flex gap-6 container px-10 -mb-16">
      <div class="avatar">
        <div
          class="ring-4 ring-offset-4 ring-neutral ring-offset-base-100 w-32 h-32 aspect-square rounded-full bg-base-100"
        >
          {#if profile.avatar}
            <Picture
              src={profile.avatar}
              alt="Avatar"
              class="w-full h-full"
              imgClass="w-full h-full rounded-full"
              useCdn={true}
            />
          {:else}
            <div class="w-full h-full flex justify-center items-center bg-gray-100 rounded-full">
              <span class="iconify lucide--user text-8xl !text-base-content"></span>
            </div>
          {/if}
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="grow"></div>
        <h2 class="text-3xl font-semibold shrink-0">{profile.name}</h2>
        <div class="flex gap-1 shrink-0">
          {#if isSelf}
            <div class="shrink-0 flex gap-2 badge badge-outline badge-warning text-warning">
              <span class="iconify la--coins text-lg"></span><span>{profile.balance ?? 0}</span>
            </div>
          {/if}
          {#each profile.roles as role}
            <div class="badge badge-outline">{role}</div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
<div class="container">
  <div class="flex gap-8">
    <div class="flex flex-col mt-12 gap-2 w-1/6 shrink-0">
      <a
        href="/profile/{profile.id}"
        class="btn btn-accent w-full"
        on:click|preventDefault={handleShareProfile}
      >
        <Icon icon="lucide--share-2" class="text-xl" />
        Share Profile
      </a>
      {#if isSelf}
        <a href="/profile/settings" class="btn w-full">
          <Icon icon="lucide--edit" class="text-xl" />
          Edit Profile
        </a>
        <button class="btn w-full" on:click={() => roleRequestModal.showModal()}>
          <Icon icon="lucide--contact" class="text-xl" />
          Request Role
        </button>
        <dialog bind:this={roleRequestModal} class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <Icon icon="lucide--contact" class="text-xl" />
              Request Role
            </h3>
            <h5 class="font-medium mb-2">User</h5>
            <div class="flex gap-4 items-center w-full bg-base-200 h-fit p-4 rounded">
              <div class="avatar">
                <div
                  class="ring-2 ring-offset-2 ring-neutral ring-offset-base-100 w-12 h-12 aspect-square rounded-full bg-base-100"
                >
                  {#if profile.avatar}
                    <Picture
                      src={profile.avatar}
                      alt="Avatar"
                      class="w-full h-full"
                      imgClass="w-full h-full rounded-full"
                      useCdn={true}
                    />
                  {:else}
                    <div
                      class="w-full h-full flex justify-center items-center bg-gray-100 rounded-full"
                    >
                      <span class="iconify lucide--user text-4xl !text-base-content"></span>
                    </div>
                  {/if}
                </div>
              </div>
              <span class="text-base font-medium">{profile.name}</span>
            </div>
            <hr class="border-1 my-4" />
            <label for="role" class="block mb-2 font-medium">Role</label>
            <select class="select select-bordered select-sm w-full max-w-xs" id="role">
              <option value="Administrator">Administrator</option>
              <option value="Publisher">Publisher</option>
            </select>
            <div class="modal-action">
              <button class="btn btn-sm btn-accent">Request</button>
              <form method="dialog">
                <button class="btn btn-sm">Cancel</button>
              </form>
            </div>
          </div>
        </dialog>
        <!-- {#if profile.roles.includes('Publisher')} -->
        <button on:click={openAddModal} class="btn">
          <Icon icon="lucide--receipt" class="text-xl" /> Request Withdrawal</button
        >
        <!--! Modal for Post Withdrawal -->
        <dialog id="withdrawal_modal" bind:this={addModal} class="modal">
          <div class="modal-box">
            <div class="text-start">
              <h2 class="text-2xl mb-4 font-bold">Withdrawal Request</h2>
            </div>
            {#if !!errorMess}
              <div role="alert" class="alert alert-error max-h-14 p-2">
                <Icon icon="lucide--circle-x" class="text-xl" />
                <!-- <span class="iconify  text-xl"></span> -->
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
        </dialog>
        <!-- {/if} -->
      {:else}
        <button class="btn w-full" on:click={() => reportModal.showModal()}>
          <Icon icon="lucide--flag" class="text-xl" />
          Report User
        </button>
        <dialog bind:this={reportModal} class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon icon="lucide--flag" class="text-xl" />
              Report User
            </h3>
            <h5 class="font-medium mb-2">User</h5>
            <div class="flex gap-4 items-center w-full bg-base-200 h-fit p-4 rounded">
              <div class="avatar">
                <div
                  class="ring-2 ring-offset-2 ring-neutral ring-offset-base-100 w-12 h-12 aspect-square rounded-full bg-base-100"
                >
                  {#if profile.avatar}
                    <Picture
                      src={profile.avatar}
                      alt="Avatar"
                      class="w-full h-full"
                      imgClass="w-full h-full rounded-full"
                      useCdn={true}
                    />
                  {:else}
                    <div
                      class="w-full h-full flex justify-center items-center bg-gray-100 rounded-full"
                    >
                      <span class="iconify lucide--user text-4xl !text-base-content"></span>
                    </div>
                  {/if}
                </div>
              </div>
              <span class="text-base font-medium">{profile.name}</span>
            </div>
            <hr class="border-1 my-4" />
            <div class="mb-4">
              <label for="report-reason" class="block mb-2 font-medium">Reason</label>
              <select id="report-reason" class="select select-bordered w-2/3 select-sm mb-4">
                <option value="">Offensive bio/avatar/banner</option>
                <option value="">Spambot</option>
                <option value="">Other</option>
              </select>
              <textarea
                id="report-description"
                class="textarea textarea-bordered w-full resize-none"
                placeholder="Please provide additional details"
                rows="3"
              ></textarea>
            </div>
            <div class="modal-action">
              <button type="submit" class="btn btn-sm btn-accent">Send Report</button>
              <form method="dialog" class="flex space-x-2">
                <button class="btn btn-sm">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      {/if}
    </div>
    <div class="w-full">
      <section id="bio" class="my-12">
        <div class="flex items-baseline gap-4">
          <h3 class="text-lg font-bold">Bio</h3>
          <hr class="border-1 flex-grow" />
        </div>
        <p class="text-base max-h-24 overflow-y-scroll">
          {#if profile.bio}
            {profile.bio}
          {:else}
            <span class="italic">This user has not provided a bio.</span>
          {/if}
        </p>
      </section>
      <section id="uploads" class="flex flex-col">
        <div class="flex items-baseline gap-4">
          <h3 class="text-lg font-bold mb-2">Uploads</h3>
          <hr class="border-1 flex-grow" />
        </div>
        <ComicList loadFn={loadComics} bind:reload>
          <div class="flex grow w-full justify-between gap-2" slot="controls">
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <Swap bind:active={sortType} on:change={() => updateSort()}>
                  <span slot="off">
                    <span class="text-accent">Name</span> |
                    <span class="text-neutral">Date Uploaded</span>
                  </span>
                  <span slot="on">
                    <span class="text-neutral">Name</span> |
                    <span class="text-accent">Date Uploaded</span>
                  </span></Swap
                >
                <Swap
                  rotate={true}
                  itemsClass="flex items-center"
                  bind:active={sortOrder}
                  on:change={() => updateSort()}
                >
                  <Icon icon="lucide--sort-asc" class="text-xl" slot="off" />
                  <Icon icon="lucide--sort-desc" class="text-xl" slot="on" />
                </Swap>
              </div>
            </div>
            <div class="flex items-center justify-center gap-2">
              <form on:submit|preventDefault={handleOnSearch}>
                <label
                  class="join-item z-10 input input-bordered focus:input-accent input-sm flex items-center gap-2 pr-4 w-73"
                >
                  <input type="text" class="grow-0" placeholder="Search" bind:value={search.name} />
                  <span class="iconify lucide--search text-lg"></span>
                </label>
                <button class="hidden" type="submit"> </button>
              </form>
            </div>
          </div>
        </ComicList>
      </section>
    </div>
  </div>
</div>
