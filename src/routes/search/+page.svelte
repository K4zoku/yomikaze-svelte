<script lang="ts">
  import TriSwap from '$components/daisyui/actions/tri-swap.svelte';

  export let data;
  let { categories } = data;
  let categoryIds = Object.keys(categories).sort();
</script>

<div class="py-20">
  {#each categoryIds as categoryId}
    <h3 id="tc-{categoryId}" class="text-xl font-bold pt-4 py-2">{categories[categoryId].name}</h3>
    <div class="flex gap-1 flex-wrap">
      {#each categories[categoryId].tags as tag}
      <div class="tooltip" data-tip="{tag.description || undefined}">
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
            name={tag.searchState === 1 ? 'include' : tag.searchState === 2 ? 'exclude' : undefined}
          />
        </TriSwap>
      </div>
    {/each}
    </div>
    <hr/>
  {:else}
    <span class="text-warning">There is no tags</span>
  {/each}
</div>
