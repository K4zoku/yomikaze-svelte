<script lang="ts">
  import Swap from '$components/daisyui/actions/swap.svelte';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import ComicList from '$components/yomikaze/common/comic/comic-list.svelte';
  import ProfileReport from '$components/yomikaze/report/profile-report.svelte';
  import type AuthDataStore from '$models/AuthDataStore';
  import type Pagination from '$models/Pagination.js';
  import type Problem from '$models/ProblemResponse';
  import { getComics, type GetComicsOptions } from '$utils/comic-utils.js';
  import http from '$utils/http';
  import type { AxiosError } from 'axios';
  import { createEventDispatcher, getContext, onDestroy, tick } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import type { Writable } from 'svelte/store';
  import type { ToastProps } from '~/routes/+layout.svelte';
  import { postRoleRequest } from '$utils/role-request-utils';
  import { changePassword, updateProfile } from '$utils/profile-utils.js';
  import httpImage from '$utils/httpImage.js';
  import { debounce } from '$utils/common.js';

  export let data;
  let { profile, token } = data;
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;

  let roleRequestModal: HTMLDialogElement;
  let reportModal: HTMLDialogElement;
  let addModal: HTMLDialogElement;
  let editModal: HTMLDialogElement;
  let changePasswordModal: HTMLDialogElement;
  let withdrawalAmount = 1;
  let remainingBalance = 0;
  let paymentInfomation = '';

  let amountErr = '';
  let errorMess = '';

  let bannerImageUrl: string | null = null;
  let avatarImageUrl: string | null = null;
  let bio = profile.bio;
  let name = profile.name;

  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let errors = { currentPassword: '', newPassword: '', confirmPassword: '', _: '' };
  let showCurrentPassword = false;
  let showNewPassword = false;
  let showConfirmPassword = false;

  let reason: string;

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

  async function handleRoleRequest() {
    try {
      await postRoleRequest(reason);
      roleRequestModal.close();
      addToast('Role request submitted successfully');
      reason = '';
    } catch (err) {
      console.error('Error requesting role:', err);
      addErrToast('Failed to submit role request');
    }
  }

  $: remainingBalance = profile.balance - withdrawalAmount;
  $: errorMess = remainingBalance < 0 ? 'Insufficient balance' : '';

  async function postWithdrawal(amount: number, payInfo: string) {
    try {
      const response = await http.post(`/withdrawal`, {
        amount: amount,
        paymentInformation: payInfo
      });

      console.log(response);
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
            case 'PaymentInformation':
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

    if (remainingBalance < 0) {
      return;
    }
    try {
      const result = await postWithdrawal(withdrawalAmount, paymentInfomation);
      console.log('Withdrawal posted successfully:', result);
      addToast('Withdrawal request successful');
      closeAddModal();
    } catch (error) {
      console.error('Error posting withdrawal:', error);
    }
  }

  const dispatch = createEventDispatcher();

  async function handleSave() {
    try {
      const payload = [
        { value: bio, path: '/bio', op: 'replace' },
        { value: name, path: '/name', op: 'replace' }
      ];

      if (avatarImageUrl) {
        payload.push({ value: avatarImageUrl, path: '/avatar', op: 'replace' });
      }

      if (bannerImageUrl) {
        payload.push({ value: bannerImageUrl, path: '/banner', op: 'replace' });
      }
      if (!token) return;
      await updateProfile(payload, token);
      profile.bio = bio;
      profile.name = name;
      if (avatarImageUrl) {
        profile.avatar = avatarImageUrl;
      }
      if (bannerImageUrl) {
        profile.banner = bannerImageUrl;
      }
      addToast('Profile updated successfully!');
      editModal.close();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleFileChange(event: Event, type: 'avatar' | 'banner') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await httpImage.post('/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 201) {
          const imageUrl = response.data.images[0]; // Adjust according to your API response structure


          if (type === 'banner') {
            bannerImageUrl = imageUrl;
          } else if (type === 'avatar') {
            avatarImageUrl = imageUrl;
          }
        } else {
          console.error('Failed to upload image:', response.data);
          alert('Failed to upload image. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('An error occurred while uploading image.');
      }
    }
  }

  async function validateCurrentPassword(): Promise<boolean> {
    let valid = true;
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
      valid = false;
    } else {
      errors.currentPassword = '';
    }
    return valid;
  }

  async function validateNewPassword(): Promise<boolean> {
    let valid = true;
    if (!newPassword) {
      errors.newPassword = 'New password is required';
      valid = false;
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long';
      valid = false;
    } else {
      errors.newPassword = '';
    }
    return valid;
  }

  async function validateConfirmPassword(): Promise<boolean> {
    let valid = true;
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'New password and confirmation do not match';
      valid = false;
    } else {
      errors.confirmPassword = '';
    }
    return valid;
  }

  const debouncedValidateCurrentPassword = debounce(validateCurrentPassword, 500);
  const debouncedValidateNewPassword = debounce(validateNewPassword, 500);
  const debouncedValidateConfirmPassword = debounce(validateConfirmPassword, 500);

  onDestroy(() => {
    debouncedValidateCurrentPassword;
    debouncedValidateNewPassword;
    debouncedValidateConfirmPassword;
  });

  async function handleChangePassword() {
    const isCurrentPasswordValid = await validateCurrentPassword();
    const isNewPasswordValid = await validateNewPassword();
    const isConfirmPasswordValid = await validateConfirmPassword();

    if (isCurrentPasswordValid && isNewPasswordValid && isConfirmPasswordValid) {
      try {
        await changePassword(currentPassword, newPassword, token as string);
        addToast('Password changed successfully!');
        changePasswordModal.close();
        dispatch('passwordChanged');
      } catch (error) {
        const axiosError = error as AxiosError;
        const { response } = axiosError;
        if (response) {
          let data = response.data as Problem;
          for (let key of Object.keys(data.errors)) {
            switch (key) {
              case 'newPassword':
                errors.newPassword = data.errors[key].at(0) ?? '';
                break;
              case 'confirmPassword':
                errors.confirmPassword = data.errors[key].at(0) ?? '';
                break;
              default:
                errors._ = 'Unknown Error';
                break;
            }
          }
        } else {
          errors._ = 'Unknown Error';
        }
      }
    }
  }

  function openEditModal() {
    editModal.showModal();
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

  function addErrToast(message: string) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-error', icon: 'lucide--circle-x' }
    ]);
  }

  interface Transaction {
    creationTime: string;
    amount: number;
    description: string;
    type: string;
  }
  let transactions: Transaction[] = [];
  async function getTransactions() {
    try {
      const response = await http.get(`/transactions`);
      transactions = response.data.results;
    } catch (error) {
      console.error('Error getting transactions:', error);
    }
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
              class="w-20 h-20"
              imgClass="w-20 h-20 rounded-full"
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
<div class="container mb-16">
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
        <button class="btn w-full" on:click={openEditModal}>
          <Icon icon="lucide--edit" class="text-xl" />
          Edit Profile
        </button>
        <button class="btn w-full" on:click={() => changePasswordModal.showModal()}>
          <Icon icon="lucide--lock-keyhole" class="text-xl" />
          Change Password
        </button>
        {#if profile.roles.includes('Reader') && !profile.roles.includes('Publisher')}
          <button class="btn w-full" on:click={() => roleRequestModal.showModal()}>
            <Icon icon="lucide--contact" class="text-xl" />
            Request Role
          </button>
        {/if}

        {#if profile.roles.includes('Publisher')}
          {#if profile.balance <= 0}
            <div
              class="tooltip w-full tooltip-right tooltip-warning cursor-help"
              data-tip="You must have at least 1 coin to withdraw"
            >
              <button class="btn btn-block btn-disabled">
                <Icon icon="lucide--receipt" class="text-xl" /> Request Withdrawal
              </button>
            </div>
          {:else}
            <button on:click={openAddModal} class="btn">
              <Icon icon="lucide--receipt" class="text-xl" /> Request Withdrawal
            </button>
          {/if}
        {/if}
      {:else}
        <button class="btn w-full" on:click={() => reportModal.showModal()}>
          <Icon icon="lucide--flag" class="text-xl" />
          Report User
        </button>
        <ProfileReport bind:modal={reportModal} target={profile} {http} />
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
      {#if isSelf}
        <section id="transaction" class="my-12">
          <div class="flex items-baseline gap-4">
            <h3 class="text-lg font-bold">Transactions</h3>
            <hr class="border-1 flex-grow" />
          </div>
          <div class="w-full max-h-96 overflow-y-scroll">
            <table class="table table-pin-rows w-full table-zebra">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {#await getTransactions()}
                  <tr>
                    <td colspan="4">Loading...</td>
                  </tr>
                {:then}
                  {#each transactions as transaction}
                    <tr class="hover">
                      <td>
                        <Time timestamp={transaction.creationTime} relative />
                      </td>
                      <td
                        class:text-error={transaction.amount < 0}
                        class:text-success={transaction.amount > 0}
                      >
                        {#if transaction.amount > 0}+{/if}{transaction.amount} coins
                      </td>
                      <td>
                        {#if transaction.type === 'UnlockChapter'}
                          Unlock Chapter {transaction.description.slice(
                            transaction.description.lastIndexOf('/') + 1
                          )}
                        {:else}
                          {transaction.description}
                        {/if}
                      </td>
                    </tr>
                  {/each}
                {/await}
              </tbody>
            </table>
          </div>
        </section>
      {/if}
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
{#if isSelf}
  {#if profile.roles.includes('Reader') && !profile.roles.includes('Publisher')}
    <!--! Modal role request -->
    <dialog bind:this={roleRequestModal} class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold flex items-center gap-2">Request Role</h3>
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
        <div class="form-control mt-4">
          <label class="label" for="price">Role</label>
          <input class="input input-bordered" id="price" type="text" value="Publisher" readonly />
        </div>
        <div class="form-control mt-4">
          <label class="label" for="reason">Reason</label>
          <textarea
            class="textarea textarea-bordered resize-none"
            id="reason"
            bind:value={reason}
            placeholder="Enter reason for role request"
            rows="3"
          ></textarea>
        </div>
        <div class="modal-action">
          <button class="btn btn-sm btn-accent" on:click={handleRoleRequest}>Request</button>
          <form method="dialog">
            <button class="btn btn-sm">Cancel</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  {/if}

  <!--! Modal edit profile -->
  <dialog bind:this={editModal} class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold flex">Edit Profile</h3>
      <div class="form-control">
        <label class="label" for="name">Name</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          class="input input-bordered focus:input-accent"
        />
      </div>
      <!-- <div class="form-control">
        <label class="label" for="avatar">Avatar</label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          on:change={(e) => (avatarFile = e.target.files[0])}
          class="input input-bordered"
        />
      </div> -->

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Avatar</span>
        </div>
        <input
          type="file"
          accept="image/*"
          class="file-input input-bordered file-input-accent w-full"
          on:change={(event) => handleFileChange(event, 'avatar')}
        />
      </label>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Banner</span>
        </div>
        <input
          type="file"
          accept="image/*"
          class="file-input input-bordered file-input-accent w-full"
          on:change={(event) => handleFileChange(event, 'banner')}
        />
      </label>

      <div class="form-control">
        <label class="label" for="bio">Bio</label>
        <textarea
          id="bio"
          bind:value={bio}
          class="textarea textarea-bordered focus:textarea-accent resize-none"
          rows="4"
        ></textarea>
      </div>

      <div class="modal-action">
        <button class="btn btn-accent btn-sm" on:click={handleSave}>Save</button>
        <button class="btn btn-sm" on:click={() => editModal.close()}>Close</button>
      </div>
    </div>
  </dialog>

  <!--! Modal change password -->
  <dialog id="changePasswordModal" class="modal" bind:this={changePasswordModal}>
    <div class="modal-box">
      <h3 class="text-lg font-bold">Change Password</h3>
      <form method="dialog" on:submit|preventDefault={handleChangePassword}>
        <div class="py-4">
          <label class="form-control">
            <div class="label">
              <span class="label-text">Current Password</span>
            </div>
            <div class="input input-bordered flex items-center gap-2">
              <Icon icon="lucide--key" class="text-lg" />
              {#if showCurrentPassword}
                <input
                  type="text"
                  class="grow"
                  placeholder="Enter your current password"
                  bind:value={currentPassword}
                />
              {:else}
                <input
                  type="password"
                  class="grow"
                  placeholder="Enter your current password"
                  bind:value={currentPassword}
                />
              {/if}
              <button
                type="button"
                class="flex items-center justify-center"
                on:click={() => (showCurrentPassword = !showCurrentPassword)}
              >
                {#if showCurrentPassword}
                  <Icon icon="lucide--eye-off" class="text-xl" />
                {:else}
                  <Icon icon="lucide--eye" class="text-xl" />
                {/if}
              </button>
            </div>
            <div class="label">
              <span class="label-text-alt text-error">
                {errors.currentPassword}
              </span>
            </div>
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">New Password</span>
            </div>
            <div class="input input-bordered flex items-center gap-2">
              <Icon icon="lucide--key" class="text-lg" />
              {#if showNewPassword}
                <input
                  type="text"
                  class="grow"
                  placeholder="Enter your new password"
                  bind:value={newPassword}
                />
              {:else}
                <input
                  type="password"
                  class="grow"
                  placeholder="Enter your new password"
                  bind:value={newPassword}
                />
              {/if}
              <button
                type="button"
                class="flex items-center justify-center"
                on:click={() => (showNewPassword = !showNewPassword)}
              >
                {#if showNewPassword}
                  <Icon icon="lucide--eye-off" class="text-xl" />
                {:else}
                  <Icon icon="lucide--eye" class="text-xl" />
                {/if}
              </button>
            </div>
            <div class="label">
              <span class="label-text-alt text-error">
                {errors.newPassword}
              </span>
            </div>
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text">Confirm New Password</span>
            </div>
            <div class="input input-bordered flex items-center gap-2">
              <Icon icon="lucide--key" class="text-lg" />
              {#if showConfirmPassword}
                <input
                  type="text"
                  class="grow"
                  placeholder="Re-enter your new password"
                  bind:value={confirmPassword}
                />
              {:else}
                <input
                  type="password"
                  class="grow"
                  placeholder="Re-enter your new password"
                  bind:value={confirmPassword}
                />
              {/if}
              <button
                type="button"
                class="flex items-center justify-center"
                on:click={() => (showConfirmPassword = !showConfirmPassword)}
              >
                {#if showConfirmPassword}
                  <Icon icon="lucide--eye-off" class="text-xl" />
                {:else}
                  <Icon icon="lucide--eye" class="text-xl" />
                {/if}
              </button>
            </div>
            <div class="label">
              <span class="label-text-alt text-error">
                {errors.confirmPassword}
              </span>
            </div>
          </label>
        </div>
        <div class="modal-action">
          <button type="submit" class="btn btn-accent btn-sm">Change Password</button>
          <button type="button" class="btn btn-sm" on:click={() => changePasswordModal.close()}
            >Cancel</button
          >
        </div>
      </form>
    </div>
  </dialog>

  {#if profile.roles.includes('Publisher') && profile.balance > 0}
    <!--! Modal for Post Withdrawal -->
    <dialog id="withdrawal_modal" bind:this={addModal} class="modal">
      <div class="modal-box">
        <h2 class="text-2xl mb-4 font-bold">Withdrawal Request</h2>

        {#if !!errorMess}
          <div role="alert" class="alert alert-error max-h-14 p-2">
            <Icon icon="lucide--circle-x" class="text-xl" />
            <span>{errorMess}</span>
          </div>
        {/if}
        <form
          on:submit|preventDefault={handlePostWithdrawal}
          class="flex flex-col gap-3"
          id="withdrawal-form"
        >
          <div class="flex gap-2">
            <label class="form-control">
              <div class="label">
                <span class="label-text">Your Balance</span>
              </div>
              <input
                type="text"
                value="{profile.balance} coins"
                min="0"
                class="input input-bordered w-full"
                readonly
              />
            </label>
            <label class="form-control">
              <div class="label">
                <span class="label-text">New Balance</span>
              </div>
              <input
                type="text"
                value="{remainingBalance} coins"
                min="0"
                class="input input-bordered w-full"
                readonly
              />
            </label>
          </div>

          <label class="form-control">
            <div class="label">
              <span class="label-text">Coin amount</span>
            </div>
            <input
              type="number"
              bind:value={withdrawalAmount}
              placeholder="Enter amount to withdraw"
              min="1"
              max={profile.balance}
              class="input input-bordered w-full"
            />
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text">Actual amount received</span>
            </div>
            <input
              type="text"
              value="{(withdrawalAmount * 0.009).toFixed(2)}$"
              min="0"
              class="input input-bordered w-full"
              disabled
            />
          </label>
          <label class="form-control">
            <div class="label">
              <span class="label-text">Payment infomation</span>
            </div>
            <textarea
              id="report-description"
              bind:value={paymentInfomation}
              class="textarea textarea-bordered w-full resize-none"
              placeholder="EX: &#10; Bank Name &#10; 0123456789 &#10; Card Holder Name"
              rows="3"
            ></textarea>
          </label>
          {#if !!amountErr}
            <p class="text-error">{amountErr}</p>
          {/if}
        </form>
        <div class="modal-action">
          <button type="submit" class="btn btn-accent btn-sm" form="withdrawal-form">Submit</button>
          <button type="button" class="btn btn-sm" on:click={closeAddModal}>Cancel</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  {/if}
{/if}
