<script lang="ts">
  import type { PageData } from '../shop/$types';

  export let data: PageData;

  let createCategoryModal: HTMLDialogElement;
  let deleteCategoryModal: HTMLDialogElement;
  let price = 120;
  let shop = [
    {
      amount: 0,
      price: 0,
      currency: 'USD'
    },
    {
      amount: 0,
      price: 0,
      currency: 'USD'
    },
    {
      amount: 0,
      price: 0,
      currency: 'USD'
    }
  ];
</script>

<div class="h-screen container">
  <div class="mt-12">
    <div class="flex items-center mt-12">
      <!-- <a class="btn btn-ghost"> -->
      <span class="text-2xl mt-1 iconify lucide--arrow-left"></span>
      <!-- </a> -->
      <span class="text-xl font-semibold items-center mx-auto mt-3">Coins Shop</span>
    </div>
    <div class="flex justify-center items-center gap-1 ms-5">
      <span class="iconify lucide--coins text-warning"></span>
      <span class="text-lg">{price}</span>
      <span class="iconify lucide--refresh-ccw"></span>
    </div>
    <span class=" flex justify-center items-center ms-5">Buy coin to unlock chapter</span>
  </div>
  <div class="flex flex-col items-center justify-center text-center">
    <!-- <h3 class="text-lg font-semibold mb-2">Category Management</h3> -->
    <div class="flex flex-col gap-2 w-full items-center mt-5">
      <div class="grid grid-cols-3 justify-center gap-10 mt-10 mb-5">
        <div
          class="w-52 h-64 flex flex-col border-2 bg-green-1000 border-green-2000 drop-shadow-lg rounded"
        >
          <div class="flex justify-center absolute self-center top-8">
            <img class="w-30" src="/Coin/Coin1.svg" alt="logo" />
          </div>
          <div class="flex justify-center absolute bottom-14 self-center">
            <h1 class="text-xl font-semibold self-center">100 coins</h1>
          </div>
          <div
            class="w-28 h-6 flex justify-center border-2 rounded-lg border-lime-400 self-center absolute bottom-4"
          >
            <h1 class="text-sm self-center">25.000 VND</h1>
          </div>
        </div>
        <div
          class="w-52 h-64 flex flex-col border-2 bg-green-1000 border-green-2000 drop-shadow-lg rounded"
        >
          <div class="flex justify-center self-center top-8">
            <img
              src="/Coin/Coin2.svg"
              alt=""
            />
          </div>
          <div class="flex justify-center absolute bottom-14 self-center">
            <h1 class="text-xl font-semibold self-center">200 coins</h1>
          </div>
          <div
            class="w-28 h-6 flex justify-center border-2 rounded-lg border-lime-400 self-center absolute bottom-4"
          >
            <h1 class="text-sm self-center">50.000 VND</h1>
          </div>
        </div>
        <div
          class="w-52 h-64 flex flex-col border-2 bg-green-1000 drop-shadow-lg rounded"
        >
          <div class="justify-center absolute self-center top-8">
            <img src="./Coin/Coin3.svg" alt="" />
            <h4 class="mt-1 text-error">+50 coins</h4>
          </div>
          <div class="flex justify-center absolute bottom-14 self-center">
            <h1 class="text-xl font-semibold self-center">400 coins</h1>
          </div>
          <div
            class="w-28 h-6 flex justify-center border-2 rounded-lg border-lime-400 self-center absolute bottom-4"
          >
            <h1 class="text-sm self-center">75.000 VND</h1>
          </div>
        </div>
        <div
          class="w-52 h-64 flex flex-col border-2 bg-green-1000 drop-shadow-lg rounded"
        >
          <div class="justify-center absolute self-center top-8">
            <img src="./Coin/Coin4.svg" alt="" />
            <h4 class="mt-1 text-error">+100 coins</h4>
          </div>
          <div class="flex justify-center absolute bottom-14 self-center">
            <h1 class="text-xl font-semibold self-center">500 coins</h1>
          </div>
          <div
            class="w-28 h-6 flex justify-center border-2 rounded-lg border-lime-400 self-center absolute bottom-4"
          >
            <h1 class="text-sm self-center">100.000 VND</h1>
          </div>
        </div>
        <div
          class="w-52 h-64 flex flex-col border-2 drop-shadow-lg rounded"
        >
          <div class="justify-center absolute self-center top-8">
            <img src="./Coin/Coin5.svg" alt="" />
            <h4 class="mt-1 text-error">+100 coins</h4>
          </div>
          <div class="flex justify-center absolute bottom-14 self-center">
            <h1 class="text-xl font-semibold self-center">1000 coins</h1>
          </div>
          <div
            class="w-28 h-6 flex justify-center border-2 rounded-lg border-lime-400 self-center absolute bottom-4"
          >
            <h1 class="text-sm self-center">200.000 VND</h1>
          </div>
        </div>
        <div
          class="w-52 h-64 flex flex-col border-2 bg-green-1000 border-green-2000 drop-shadow-lg rounded"
        >
          <div class="justify-center absolute self-center top-8">
            <img src="./Coin/Coin6.svg" alt="" />
            <h4 class="mt-1 text-error">+200 coins</h4>
          </div>
          <div class="flex justify-center absolute bottom-14 self-center">
            <h1 class="text-xl font-semibold self-center">2000 coins</h1>
          </div>
          <div
            class="w-28 h-6 flex justify-center border-2  rounded-lg border-lime-400 self-center absolute bottom-4"
          >
            <h1 class="text-sm self-center">400.000 VND</h1>
          </div>
        </div>
      </div>
      <div class="absolute bottom-2 right-2">
        <img class="w-60" src="/images/support.svg" alt="logo" />
      </div>
    </div>
  </div>
</div>
