<script>
  import Icon from '$components/icon.svelte';
  export let pageName;
</script>

<svelte:head>
  <title>{pageName}</title>
</svelte:head>

<div class="container w-full h-screen mt-16">
  <slot name="header">
    <div class="flex items-center gap-2 mb-6 mt-2">
      <button class="btn btn-circle btn-ghost" on:click={() => history.back()}>
        <Icon icon="lucide--arrow-left" class="text-3xl" />
      </button>
      <h2 class="font-header text-2xl font-semibold">{pageName}</h2>
    </div>
  </slot>
  <slot></slot>
</div>
