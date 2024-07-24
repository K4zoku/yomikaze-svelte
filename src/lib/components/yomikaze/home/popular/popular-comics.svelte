<script lang="ts">
  import PopularComicItem from '$components/yomikaze/home/popular/popular-comic-item.svelte';
  import type Comic from '$models/Comic';
  import Carousel from 'svelte-carousel';

  export let comics: Comic[];
  interface CarouselData {
    goToPrev: () => void;
    goToNext: () => void;
    currentPageIndex: number;
  }

  let carousel: CarouselData = {
    goToNext: () => {},
    goToPrev: () => {},
    currentPageIndex: 0
  };

  let eventHolder: HTMLElement;
  function handleOnPopularWheel(event: WheelEvent) {
    const target = event.target as HTMLElement;
    if (event.deltaY === 0) return;
    let depth = 3;
    let elem = target;
    do {
      if (elem.scrollHeight > elem.clientHeight || elem.scrollWidth > elem.clientWidth) {
        return;
      }
      if (!elem.parentElement) {
        break;
      }
      elem = elem.parentElement;
      if (elem.id === eventHolder.id) {
        break;
      }
    } while (elem && depth--);

    event.preventDefault();
    (event.deltaY > 0 ? carousel.goToNext : carousel.goToPrev)();
  }
</script>

<div class="w-full h-fit" bind:this={eventHolder} on:wheel={handleOnPopularWheel}>
  <div class="absolute z-10 w-full top-16">
    <div class="container">
      <h2 class="font-bold text-2xl">Popular Comics</h2>
    </div>
  </div>
  <Carousel
    swiping={true}
    autoplay
    autoplayDuration={5000}
    pauseOnFocus
    dots={false}
    bind:goToPrev={carousel.goToPrev}
    bind:goToNext={carousel.goToNext}
    on:pageChange={(event) => (carousel.currentPageIndex = event.detail)}
  >
    {#each comics as comic (comic.id)}
      <PopularComicItem {comic} />
    {/each}
    <div slot="prev"></div>
    <div slot="next" class="absolute bottom-14 right-8 z-10">
      <div class="hidden md:flex gap-4 items-center justify-center">
        <span class="shrink-0 font-bold text-lg" class:text-accent={!carousel.currentPageIndex}
          >No.{carousel.currentPageIndex + 1}</span
        >
        <div class="flex gap-2">
          <button class="btn btn-circle btn-sm btn-ghost" on:click={() => carousel.goToPrev()}>
            <span class="iconify lucide--chevron-left font-extrabold text-2xl"></span>
          </button>
          <button class="btn btn-circle btn-sm btn-ghost" on:click={() => carousel.goToNext()}>
            <span class="iconify lucide--chevron-right font-extrabold text-2xl"></span>
          </button>
        </div>
      </div>
    </div>
  </Carousel>
  <div class="flex gap-2 md:hidden items-center justify-between p-2">
    <button class="btn btn-circle btn-sm" on:click={() => carousel.goToPrev()}>
      <span class="iconify lucide--chevron-left font-extrabold text-2xl"></span>
    </button>
    <div class="grow btn btn-circle btn-sm no-animation">
      <span class="text-xs">
        <span class:text-accent={!carousel.currentPageIndex}
          >{carousel.currentPageIndex + 1}
        </span>/{comics.length}
      </span>
    </div>
    <button class="btn btn-circle btn-sm" on:click={() => carousel.goToNext()}>
      <span class="iconify lucide--chevron-right font-extrabold text-2xl"></span>
    </button>
  </div>
</div>
