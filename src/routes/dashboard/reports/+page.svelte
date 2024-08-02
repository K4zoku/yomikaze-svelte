<script lang="ts">
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import Icon from '$components/icon.svelte';
  import { onMount } from 'svelte';
    import http from '$utils/http.js';

  export let data;
  const { token } = data;

  interface Statistics {
    comicReports: number;
    chapterReports: number;
    commentReports: number;
    profileReports: number;
  }

  let statistics: Statistics = {
    comicReports: 0,
    chapterReports: 0,
    commentReports: 0,
    profileReports: 0
  };

  onMount(async () => {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    const response = await http.get('/statistics/report');
    statistics = response.data;
  });
</script>

<Sublayout pageName="Reports">
  <div class="grid grid-cols-4 gap-4 mt-3">
    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/reports/comic">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Comic reports</span>
            <span class="text-xl font-semibold">{statistics.comicReports}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--book-copy" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>

    <div class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg">
      <a href="/dashboard/reports/chapter">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Chapter reports</span>
            <span class="text-xl font-semibold">{statistics.chapterReports}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--files" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>

    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/reports/comment">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Comment reports</span>
            <span class="text-xl font-semibold">{statistics.commentReports}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="lucide--messages-square" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>

    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/reports/profile">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Profile reports</span>
            <span class="text-xl font-semibold">{statistics.profileReports}</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="iconify lucide--users-round" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>
  </div>
</Sublayout>
