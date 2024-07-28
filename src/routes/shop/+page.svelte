<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import Sublayout from '$components/yomikaze/sublayout.svelte';
    import type Pagination from '$models/Pagination';
    export let data: PageData;
    import {getCoin} from '$utils/coin-utils'
    import type CoinPricing from '$models/CoinPricing';
    let pageName ="Coin Shop"
    async function getCoins():Promise<CoinPricing[]> {
        const response= await getCoin({size:1000});
        return response.results
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
                <a href="" class="">
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
                      class="w-28 h-6 flex justify-center border-2  rounded-lg border-success self-center absolute bottom-4"
                    >
                      <h1 class="text-base self-center">${coinData.price}</h1>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        </div>
        {/await}
      </div>
  </Sublayout>
 