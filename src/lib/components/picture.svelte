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
      <div class="flex justify-center items-center bg-base-300 {imgClass}">
        <span class="loading loading-ring loading-lg"></span>
      </div>
    </div>
  </slot>
{:then src}
  <picture class={$$props.class ? $$props.class : ''}>
    <source
      class={imgClass}
      srcset={src}
    />
    <slot name="fallback">
        <img class={imgClass} src="/images/default.svg" alt="" />
    </slot>
  </picture>
{:catch}
  <slot name="error">
    <div class={$$props.class ? $$props.class : ''}>
      <div class="flex flex-col gap-2 justify-center items-center bg-base-200 {imgClass}">
        <span class="iconify lucide--triangle-alert text-6xl text-warning"></span>
        <span class="text-lg font-bold text-neutral">Failed to load image</span>
      </div>
    </div>
  </slot>
{/await}
