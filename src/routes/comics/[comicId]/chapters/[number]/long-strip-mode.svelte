<script lang="ts">
  import Picture from '$components/picture.svelte';
  export let pages: Array<string>;
  export let offset = 16 * 16; // 16rem
  let elements: Array<HTMLElement> = [];

  export let currentPage: number = 0;
  let scrollY: number;
  let moving: boolean = false;
  function handleScroll() {
    for (let i = 0; i < pages.length; i++) {
      let element = elements[i];
      if (!element) continue;
      let box = element.getBoundingClientRect();
      if (!box) {
        continue;
      }
      if (box.top >= 0) {
        currentPage = i;
        break;
      }
    }
  }

  $: if (currentPage !== undefined) {
    currentPage = Math.min(Math.max(currentPage, 0), pages.length - 1);
    handleChange();
  }

  function handleChange() {
    let element = elements[currentPage];
    if (!element) return;
    let box = element.getBoundingClientRect();
    if (!box) {
      return;
    }
    window.scrollBy({
      top: box.top - offset
    });
  }

  let height: number = 0;
</script>

<svelte:window on:scroll={handleScroll} bind:scrollY />

<div class="w-full" bind:clientHeight={height}>
  {#each pages as page, index (page + index)}
    <div class="w-full" bind:this={elements[index]}>
      <Picture
        src={page}
        useCdn={true}
        class="w-full h-fit select-none"
        imgClass="object-contain"
      />
    </div>
  {/each}
  <input
    type="range"
    min="0"
    max={pages.length - 1}
    bind:value={currentPage}
    on:input={handleChange}
    class="range range-accent opacity-50 hover:opacity-100 transition-opacity duration-300 sticky bottom-2 mt-2"
    step="1"
  />
</div>
