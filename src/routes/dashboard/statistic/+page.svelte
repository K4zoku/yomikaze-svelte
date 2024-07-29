<script>
  import Icon from '$components/icon.svelte';
</script>

<div class="container mx-auto mt-10">
  <div class="pt-20">
    <span class="text-xl font-bold">General Statistics</span>
  </div>
  <div class="grid grid-cols-3 gap-4 mt-3">
    <div
      class="rounded-md border-2 p-2 w-60 border-accent-content shadow-lg hover:shadow-2xl transition duration-300"
    >
      <a href="/dashboard/comics">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span>Comic</span>
            <span class="text-xl font-semibold">100</span>
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
            <span>User</span>
            <span class="text-xl font-semibold">35</span>
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
          <span>Comment</span>
          <span class="text-xl font-semibold">100</span>
        </div>
        <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
          <Icon icon="iconify lucide--messages-square" class="text-3xl text-accent-content" />
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
            <span class="text-xl font-semibold">111</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="iconify lucide--tags" class="text-3xl text-accent-content" />
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
            <span>Role Request</span>
            <span class="text-xl font-semibold">500</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="iconify lucide--file-pen-line" class="text-3xl text-accent-content" />
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
            <span>Report</span>
            <span class="text-xl font-semibold">69</span>
          </div>
          <div class="rounded flex items-center aspect-square h-full p-1 bg-accent shadow">
            <Icon icon="iconify lucide--file-x" class="text-3xl text-accent-content" />
          </div>
        </div>
      </a>
    </div>
  </div>
</div>
