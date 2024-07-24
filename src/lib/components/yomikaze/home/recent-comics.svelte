<script lang="ts">
  import type Comic from '$models/Comic';
  import { onMount, tick } from 'svelte';
  import ComicCard from '$components/yomikaze/common/comic/comic-card.svelte';

  export let comics: Comic[];

  let recentContainer: HTMLDivElement;
  let recentContainerHovering = false;
  let accumulatedDelta = 0;
  let accumulatedItem = 0;
  async function handleOnRecentWheel(event: WheelEvent) {
    if (event.deltaY === 0) return;
    event.preventDefault();
    await tick();
    accumulatedDelta += event.deltaY;
    if (accumulatedDelta > 0) {
      ++accumulatedItem;
    } else {
      --accumulatedItem;
    }
  }
  onMount(() => {
    setInterval(() => {
      if (accumulatedDelta === 0) return;
      const delta = accumulatedDelta;
      accumulatedDelta = 0;
      const scrollLeftMax = recentContainer.scrollWidth - recentContainer.clientWidth;
      if (delta > 0 && recentContainer.scrollLeft + 1 >= scrollLeftMax) {
        // scroll down when reaching the end
        recentContainer.scrollTo({
          left: 0
        });
        return;
      }
      if (delta < 0 && recentContainer.scrollLeft <= 0) {
        // scroll up when reaching the start
        recentContainer.scrollTo({
          left: scrollLeftMax
        });
        return;
      }

      recentContainer.scrollBy({
        left: delta,
        behavior: 'smooth'
      });
    }, 100);

    // auto scroll when not hovering
    setInterval(() => {
      if (!recentContainer) return;
      if (recentContainerHovering || accumulatedDelta !== 0) return;
      if (recentContainer.scrollLeft >= recentContainer.scrollWidth - recentContainer.clientWidth) {
        recentContainer.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
        return;
      }
      recentContainer.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }, 2000);
  });
</script>

<div
  class="overflow-x-scroll max-w-full w-full flex gap-6 snap-x scroll-smooth"
  bind:this={recentContainer}
  role="list"
  on:mouseenter={() => (recentContainerHovering = true)}
  on:mouseleave={() => (recentContainerHovering = false)}
  on:wheel={handleOnRecentWheel}
>
  {#each comics as comic (comic.id)}
    <ComicCard {comic} />
  {/each}
</div>
