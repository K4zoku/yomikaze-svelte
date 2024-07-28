<script>
  import { page } from '$app/stores';
</script>

<div class="hero min-h-screen">
  <div class="hero-content flex-col lg:flex-row gap-8">
    <div>
      <span
        class="iconify text-8xl"
        class:lucide--search-x={$page.status === 404}
        class:lucide--construction={$page.status !== 404}
      ></span>
    </div>
    <div>
      <h1 class="text-4xl font-bold">{$page.status}</h1>
      <p class="mt-2 text-lg italic">
        {#if $page.status === 404}
          The page you are looking for does not exist
        {:else}
          {$page.error?.message ?? 'Something went wrong'}
        {/if}
      </p>

      <div class="flex gap-2 mt-1">
        {#if $page.status === 401}
          <a href="/login" class="btn btn-sm btn-accent text-base-100">Login</a>
          <a href="/register" class="btn btn-sm">Register</a>
        {:else}
          <a href="/" class="btn btn-sm btn-accent text-base-100">Go Home</a>
          <button class="btn btn-sm" on:click={() => history.back()}>Go Back</button>
        {/if}
      </div>
    </div>
  </div>
</div>
