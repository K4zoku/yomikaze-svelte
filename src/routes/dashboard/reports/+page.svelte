<script lang="ts">
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import Icon from '$components/icon.svelte';
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
            <span class="text-xl font-semibold">3265</span>
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
            <span class="text-xl font-semibold">2145</span>
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
            <span class="text-xl font-semibold">2151</span>
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
            <span class="text-xl font-semibold">222</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="iconify lucide--users-round" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>
  </div>
</Sublayout>
