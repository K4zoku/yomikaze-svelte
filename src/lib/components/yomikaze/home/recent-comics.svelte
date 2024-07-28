<script lang="ts">
  import ComicCard from '$components/yomikaze/common/comic/comic-card.svelte';
  import type Comic from '$models/Comic';
  import { debounce } from '$utils/common';
  import { onDestroy, onMount } from 'svelte';

  export let comics: Comic[];

  let container: HTMLDivElement;
  let hovering = false;
  let accumulatedDelta = 0;
  
  async function handleOnWheel(event: WheelEvent) {
    if (event.deltaY === 0) return;
    event.preventDefault();
    accumulatedDelta += event.deltaY;
  }

  const autoScroll = () => {
    if (hovering || accumulatedDelta !== 0) {
      scheduleAutoScroll(); // reschedule
      return;
    }
    if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
      accumulatedDelta = -container.scrollWidth;
    } else {
      accumulatedDelta += 200;
    }
    scheduleAutoScroll();
  };
  let [scheduleAutoScroll, destroyAutoScroll] = debounce<void>(autoScroll, 2000);
  
  let scroller: NodeJS.Timeout;
  onMount(() => {
    scroller = setInterval(() => {
      if (accumulatedDelta === 0) return;
      container.scrollBy({
        left: accumulatedDelta,
        behavior: 'smooth'
      });
      accumulatedDelta = 0;
    }, 100);
    scheduleAutoScroll();
  });

  onDestroy(() => {
    destroyAutoScroll();
    clearInterval(scroller);
  });
</script>

<div
  class="overflow-x-scroll max-w-full w-full flex gap-6 snap-x scroll-smooth pb-6 h-fit"
  role="list"
  bind:this={container}
  on:wheel={handleOnWheel}
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  on:touchstart={() => (hovering = true)}
  on:touchend={() => (hovering = false)}
>
  {#each comics as comic (comic.id)}
    <ComicCard {comic} />
  {/each}
</div>
