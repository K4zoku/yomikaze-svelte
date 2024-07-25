<script lang="ts">
 export let active:boolean;
 export let pages:Array<string>;
</script>
<div class="flex flex-col gap-5 transition-all duration-500 h-3/5" class:shifted={active}>
    {#each pages as image, index}
      <div class="max-h-full lg:max-w-2xl max-w-full">
        <img class="" src={image} alt={`${index + 1}`} />
      </div>
    {/each}
  </div>
  <style>
    .shifted {
    transition: all 0.5s;
    margin-right: 300px;
  }
  </style>