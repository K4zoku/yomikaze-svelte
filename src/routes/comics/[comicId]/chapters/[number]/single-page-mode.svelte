<script lang="ts">
    import Picture from '$components/picture.svelte';
  import Page from './+page.svelte';

  export let active: boolean;
  export let pages: Array<string>;
  interface Page {
    element?: HTMLDivElement;
    url: string;
  }
  let pageElements: Page[] = pages.map((url) => {
    return {
      url
    } as Page;
  });
  let value: number = 0;
  let scrollY: number;
  let moving : boolean = false;
  function handleScroll() {
    // if (moving) return;
    for (let i = 0; i < pageElements.length; i++) {
      let element = pageElements[i].element;
      if (!element) continue;
      let box = element.getBoundingClientRect();
      if (!box) {
        continue;
      }
      if (box.top >= 0) {
        value = i;
        console.log(box.top, scrollY,i)
        break;
      }
    }
  }

  function handleChange (){
    let element = pageElements[value].element;
    if (!element) return;
    let box = element.getBoundingClientRect();
      if (!box) {
        return;
      }
      moving = true;
      window.scrollBy({
        top:box.top
      })
      setTimeout(()=> {
        moving =false;
      }, 200);
  }
</script>

<svelte:window on:scroll={handleScroll} bind:scrollY />

<div class="transition-margin duration-150 h-screen" class:shifted={active}>
  {#each pageElements as page, index (index)}
    <div class="h-full" bind:this={page.element}>
      <Picture src={page.url} class="h-full" imgClass="object-contain max-h-full max-w-full"/>
      <!-- <img class="object-contain max-h-full max-w-full" src={page.url} alt={`${index + 1}`} /> -->
    </div>
  {/each}
  <div class="w-full sticky bottom-0 py-2 px-1 flex items-center opacity-50 hover:opacity-100 transition-opacity duration-300">
    <input
      type="range"
      min="0"
      max={pageElements.length -1}
      bind:value
      on:input={handleChange}
      class="range range-accent range-sm"
      step="1"
    />
  </div>
</div>

<style>
  .shifted {
    margin-right: 300px;
  }
</style>
