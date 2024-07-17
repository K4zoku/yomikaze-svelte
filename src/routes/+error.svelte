<script>
  import { page } from '$app/stores';
</script>

<div class="hero min-h-screen">
  <div class="hero-content flex-col lg:flex-row gap-8">
    <div>
      <span class="iconify text-neutral text-8xl" class:lucide--search-x={$page.status === 404} class:lucide--construction={$page.status !== 404}></span>
    </div>
    <div>
      <h1 class="text-4xl font-bold">{$page.status}</h1>
      <p class="py-2 text-neutral italic">
        {$page.error?.message}
      </p>
    </div>
  </div>
</div>
