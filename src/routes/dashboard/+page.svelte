<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import http from '$utils/http';
  import 'chart.js/auto';
  import type { ChartData } from 'chart.js/auto';
  import { onMount } from 'svelte';
  import { Line } from 'svelte-chartjs';

  export let data;
  const { token } = data;

  interface Statistics {
    comics: number;
    chapters: number;
    users: number;
    tags: number;
    tagCategories: number;
    transactions: number;
    withdrawals: number;
    reports: number;
    comments: number;
    income: number;
    outcome: number;
  }

  let statistics: Statistics = {
    comics: 0,
    chapters: 0,
    users: 0,
    tags: 0,
    tagCategories: 0,
    transactions: 0,
    withdrawals: 0,
    reports: 0,
    comments: 0,
    income: 0,
    outcome: 0
  };

  let comicChart: ChartData<"line", number[]> | undefined;
  onMount(async () => {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    const response = await http.get('/statistics');
    statistics = response.data;
    const comicResponse = await http.get('/statistics/comic/chart');
    comicChart = comicResponse.data;
    if (comicChart) {
      comicChart.datasets = comicChart.datasets.map((dataset: any) => {
        return {
          ...dataset,
          lineTension: 0.3,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          pointBackgroundColor: '#f59e0b',
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointBorderColor: '#f59e0b',
          pointHoverBackgroundColor: '#f59e0b',
          pointHoverBorderColor: '#f59e0b',
          fill: true,
          label: 'Comics'
        };
      });
    }
  });
</script>

<Sublayout pageName="Dashboard">
  <h3 class="text-xl font-bold">General Statistics</h3>
  <div class="grid grid-cols-4 gap-4 mt-3">
    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/comics">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Comics</span>
            <span class="text-xl font-semibold">{statistics.comics}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--book-open" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>

    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Users</span>
            <span class="text-xl font-semibold">{statistics.users}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="iconify lucide--users-round" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>

    <div class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg">
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <span>Comments</span>
          <span class="text-xl font-semibold">{statistics.comments}</span>
        </div>
        <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
          <Icon icon="lucide--messages-square" class="text-3xl text-accent-content" />
        </div>
      </div>
    </div>

    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/tags">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Tags</span>
            <span class="text-xl font-semibold">{statistics.tags}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--tags" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>

    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Role Requests</span>
            <span class="text-xl font-semibold">0</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--file-pen-line" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>

    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/reports/comics" class="">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Reports</span>
            <span class="text-xl font-semibold">{statistics.reports}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="iconify lucide--flag" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>
    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/reports/comics" class="">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Income</span>
            <span class="text-xl font-semibold" class:text-success={statistics.income > 0}>{statistics.income > 0 ? '+' : ''}{statistics.income}$</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--diamond-plus" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>
    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/reports/comics" class="">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Outcome</span>
            <span class="text-xl font-semibold" class:text-error={statistics.outcome < 0}>{statistics.outcome}$</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--diamond-minus" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>
  </div>
  <div class="w-full flex flex-col gap-2 mt-8">
    <h3 class="text-xl font-bold mt-5">Comics Statistics</h3>
    {#if comicChart}
      <div class="w-3/5 self-center">
        <Line data={comicChart} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>
    {:else}
      <div class="w-full flex justify-center items-center h-40">
        <div class="loading loading-dots loading-lg"></div>
      </div>
    {/if}
  </div>
</Sublayout>
