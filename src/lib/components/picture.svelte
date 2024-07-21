<script lang="ts">
  import { delayedValuePromise } from '$utils/common';

  export let src: string | Array<string | undefined> | undefined;

  // add loading effect
  async function loadImage(src: string | Array<string | undefined> | undefined): Promise<string> {
    if (!src) throw new Error('No image source provided');
    const array = Array.isArray(src) ? src : [src];
    const errors = [];
    for (const src of array) {
      if (!src) continue;
      // chaining next source on error
      const img = new Image();
      img.src = src;
      try {
        await new Promise<string>((resolve, reject) => {
          img.onload = () => resolve(src);
          img.onerror = (error) => reject(error);
        });
        return delayedValuePromise(500, src);
      } catch (error) {
        errors.push(error);
      }
    }
    throw errors;
  }
  export let imgClass = `w-full h-full`;
</script>

{#await loadImage(src)}
  <slot name="loading">
    <div class={$$props.class ? $$props.class : ''}>
      <div class="flex justify-center items-center bg-base-200 {imgClass}">
        <span class="loading loading-dots"></span>
      </div>
    </div>
  </slot>
{:then src}
  <picture class={$$props.class ? $$props.class : ''}>
    <source class={imgClass} srcset={src} />
    <slot name="fallback">
      <img class={imgClass} src="/images/default.svg" alt="" />
    </slot>
  </picture>
{:catch}
  <slot name="error">
    <div class={$$props.class ? $$props.class : ''}>
      <div
        class="{imgClass} flex flex-col gap-2 justify-center items-center bg-base-200 border-2 border-neutral"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-full stroke-warning p-1" viewBox="0 0 24 24">
          <path fill="none" stroke="stroke-warning" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01" />
        </svg>
      </div>
    </div>
  </slot>
{/await}
