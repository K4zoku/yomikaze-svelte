<script lang="ts">
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import { PUBLIC_STRIPE_KEY } from '$env/static/public';
  import type CoinPricing from '$models/CoinPricing';
  import { getCoin } from '$utils/coin-utils';
  import http from '$utils/http';
  import { loadStripe, type Stripe } from '@stripe/stripe-js';
  import { EmbeddedCheckout } from 'svelte-stripe';
  import { onMount } from 'svelte';
  let pageName = 'Coin Shop';
  async function getCoins(): Promise<CoinPricing[]> {
    const response = await getCoin({ size: 1000 });
    return response.results;
  }

  export let data;

  const { token } = data;
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  let stripe: Stripe | null = null;

  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_KEY);
  });

  async function getClientSecret(priceId: string): Promise<string> {
    let result = await http.post('/stripe/checkout', {
      priceId,
      returnUrl: window.location.href
    });
    return result.data.clientSecret;
  }

  let clientSecret: string = '';

  function handleClick(priceId: string) {
    getClientSecret(priceId).then((clientSecret) => {
      clientSecret = clientSecret;
    });
  }
</script>

<svelte:head>
  <title>Coin Shop</title>
</svelte:head>
<Sublayout {pageName}>
  <div class="h-screen container">
    {#await getCoins() then data}
      <div class="flex flex-col items-center justify-center text-center">
        <div class="flex flex-col gap-2 w-full items-center mt-5">
          <div class="grid grid-cols-3 justify-center gap-10 mt-10 mb-5">
            {#each data as coinData}
              <button on:click={() => handleClick(coinData.id)}>
                <div
                  class="w-52 h-64 flex flex-col border-2 bg-base-300/50 drop-shadow-lg rounded-md btn"
                >
                  <div class="justify-center absolute self-center top-12">
                    <span class="iconify la--coins text-8xl text-warning"></span>
                  </div>
                  <div class="flex justify-center absolute bottom-14 self-center">
                    <span class="text-xl font-semibold self-center">{coinData.amount}</span>
                  </div>
                  <div
                    class="w-28 h-6 flex justify-center border-2 rounded-lg border-success self-center absolute bottom-4"
                  >
                    <h1 class="text-base self-center">${coinData.price}</h1>
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/await}
  </div>
  {#if stripe && clientSecret}
    <EmbeddedCheckout {stripe} {clientSecret} />
  {:else}
    <div>Loading...</div>
  {/if}
</Sublayout>
