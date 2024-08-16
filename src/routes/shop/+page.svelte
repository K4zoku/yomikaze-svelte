<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '$components/icon.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import { PUBLIC_STRIPE_KEY } from '$env/static/public';
  import type CoinPricing from '$models/CoinPricing';
  import { getCoin } from '$utils/coin-utils';
  import http from '$utils/http';
  import { loadStripe, type Stripe } from '@stripe/stripe-js';
  import { getContext, onMount, tick } from 'svelte';
  import { EmbeddedCheckout } from 'svelte-stripe';
  let pageName = 'Coin Shop';
  async function getCoins(): Promise<CoinPricing[]> {
    const response = await getCoin({ size: 1000 });
    response.results = response.results.sort((a, b) => a.amount - b.amount);
    return response.results;
  }

  export let data;

  const { token } = data;
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  let session_id: string | null = null;
  $: session_id = $page.url.searchParams.get('session_id');
  const addSuccessToast: (message: string, duration?: number) => void =
    getContext('addSuccessToast');
  const addErrorToast: (message: string, duration?: number) => void = getContext('addErrorToast');
  onMount(async () => {
    if (!session_id) return;
    const sid = session_id;
    await goto('/shop', { replaceState: true, keepFocus: true });
    const session = await http
      .get(`/stripe/checkout/${sid}`)
      .then((res) => res.data)
      .catch((err) => false);
    if (!session) return;
    if (session.status === 'complete') {
      if (session.payment_status === 'unpaid') addErrorToast('Payment Failed');
      else addSuccessToast('Payment Successful');
    }
  });

  let stripe: Stripe;

  onMount(async () => {
    stripe = (await loadStripe(PUBLIC_STRIPE_KEY)) as Stripe;
  });

  async function getClientSecret(priceId: string): Promise<string> {
    let result = await http.post('/stripe/checkout', {
      priceId,
      returnUrl: window.location.href
    });
    return result.data.clientSecret;
  }

  let checkoutModal: HTMLDialogElement;
  let selectedPriceId: string | null = null;
  async function handleClick(priceId: string) {
    selectedPriceId = priceId;
    await tick();
    checkoutModal.showModal();
  }
</script>

<svelte:head>
  <title>Coin Shop</title>
</svelte:head>
<Sublayout {pageName}>
  <div class="h-screen container">
    {#await getCoins() then pricings}
      <div class="flex flex-col items-center justify-center text-center">
        <div class="flex flex-col gap-2 w-full items-center mt-5">
          <div class="grid grid-cols-3 justify-center gap-10 mt-10 mb-5">
            {#each pricings as pricing}
              <button on:click={() => handleClick(pricing.id)}>
                <div
                  class="w-52 h-64 flex flex-col border-2 drop-shadow-lg rounded-md btn no-animation"
                >
                  <div class="justify-center absolute self-center top-12">
                    <span class="iconify la--coins text-8xl text-warning"></span>
                  </div>
                  <div class="flex justify-center absolute bottom-14 self-center">
                    <span class="text-xl font-semibold self-center">{pricing.amount} Coins</span>
                  </div>
                  <div
                    class="w-28 h-6 flex justify-center border-2 rounded-lg border-success self-center absolute bottom-4"
                  >
                    <h1 class="text-base self-center">${pricing.price}</h1>
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/await}

    <dialog
      class="modal"
      bind:this={checkoutModal}
      on:close={() => setTimeout(() => (selectedPriceId = null), 500)}
    >
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <Icon icon="lucide--x" class="text-lg" />
          </button>
        </form>
        {#key selectedPriceId}
          {#if selectedPriceId}
            {#await getClientSecret(selectedPriceId)}
              <div class="flex items-center justify-center h-64">
                <div class="loading loading-lg loading-ring"></div>
              </div>
            {:then clientSecret}
              <EmbeddedCheckout {stripe} {clientSecret} />
            {:catch error}
              <div class="flex items-center justify-center h-64">
                <div class="flex gap-2 items-center">
                  <Icon icon="lucide--alert-circle" class="text-4xl text-error" />
                  <span class="text-xl text-error">
                    {error.message || 'An error occurred'}
                  </span>
                </div>
              </div>
            {/await}
          {/if}
        {/key}
      </div>
    </dialog>
  </div>
</Sublayout>
