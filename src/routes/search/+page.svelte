<script lang="ts">
  import TriSwap from '$components/daisyui/actions/tri-swap.svelte';

  export let data;
  let { categories } = data;
  let categoryIds = Object.keys(categories).sort();
</script>

<div class="container pt-24 flex flex-col gap-6 items-start">
  {#each categoryIds as categoryId}
    <div class="flex flex-col gap-1 w-full">
      <div class="flex gap-2 items-center">
        <h3 id="tc-{categoryId}" class="text-xl font-bold">{categories[categoryId].name}</h3>
        <hr class="border-1 my-4 flex-grow" />
      </div>
      <div class="flex gap-1 flex-wrap">
        {#each categories[categoryId].tags as tag}
          <div class="tooltip" data-tip={tag.description || undefined}>
            <TriSwap bind:state={tag.searchState}>
              <span slot="one" class="badge badge-outline badge-neutral">
                {tag.name}
              </span>
              <span slot="two" class="badge badge-outline badge-success">
                {tag.name}
              </span>
              <span slot="three" class="badge badge-outline badge-error">
                {tag.name}
              </span>
              <input
                type="hidden"
                value={tag.id}
                name={tag.searchState === 1
                  ? 'include'
                  : tag.searchState === 2
                    ? 'exclude'
                    : undefined}
              />
            </TriSwap>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <span class="text-warning">There is no tags</span>
  {/each}
</div>
