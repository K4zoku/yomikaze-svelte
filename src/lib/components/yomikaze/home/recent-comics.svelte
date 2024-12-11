<script lang="ts">
  import ComicCard from '$components/yomikaze/common/comic/comic-card.svelte';
  import type Comic from '$models/Comic';
  import { debounce } from '$utils/common';
  import { onDestroy, onMount, tick } from 'svelte';
  import { spring } from 'svelte/motion';

  export let comics: Comic[];

  let container: HTMLDivElement;
  let hovering = false;
  let scrollX = spring(0);
  scrollX.stiffness = 0.44;
  let targetScrollX = {
    _value: 0,
    get value() {
      return this._value;
    },
    set value(value: number) {
      if (container) {
        const end = container.scrollWidth - container.clientWidth;
        value = Math.max(0, Math.min(end, value));
      }
      this._value = value;
    }
  };
  scrollX.subscribe((value) => {
    if (!container) return;
    container.scrollLeft = value;
  });
  async function handleOnWheel(event: WheelEvent) {
    if (event.deltaX) return;
    const sign = Math.sign(event.deltaY);
    if (sign === 0) return;
    event.preventDefault();
    targetScrollX.value += sign * scrollDelta;
    scrollX.set(targetScrollX.value);
    await tick();
  }

  const autoScroll = () => {
    scheduleAutoScroll(); // reschedule
    if (!container || hovering) return;
    const { top, bottom } = container.getBoundingClientRect();
    const isVisible = top < window.innerHeight && bottom > 0;
    if (!isVisible) return;
    const scrollEnd = container.scrollWidth - container.clientWidth;
    targetScrollX.value =
      container.scrollLeft <= scrollEnd ? container.scrollLeft + scrollDelta : 0;
    $scrollX = targetScrollX.value;
  };

  const [scheduleAutoScroll, destroyAutoScroll] = debounce<void>(autoScroll, 2000);

  let scrollDelta = 200; // estimated width of each child
  onMount(() => {
    scrollDelta = container?.children[0]?.clientWidth ?? scrollDelta;
    if (container) {
      const { gap } = getComputedStyle(container);
      scrollDelta += parseFloat(gap);
    }
    scheduleAutoScroll();
  });

  onDestroy(() => {
    destroyAutoScroll();
  });
</script>

<div
  class="overflow-x-scroll max-w-full w-full flex gap-6 pb-6 h-fit rounded shadow-inner bg-base-200 px-3 pt-3"
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
