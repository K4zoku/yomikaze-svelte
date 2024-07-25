<script lang="ts">
  export let active: boolean;
  export let pages: Array<string>;
</script>

<div class="transition-all duration-500 h-screen" class:shifted={active}>
  {#each pages as image, index (index)}
    <div class="h-full">
      <img class="object-contain max-h-full max-w-full" src={image} alt={`${index + 1}`} />
    </div>
  {/each}
  <input type="range" min="0" max={pages.length} value="1" class="range my-3 range-accent" step="1" />
</div>

<style>
  .shifted {
    transition: all 0.5s;
    margin-right: 300px;
  }
</style>
