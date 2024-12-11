<script lang="ts">
  import { PUBLIC_CDN_BASE_URL } from '$env/static/public';

  export let src: string | Array<string | undefined> | undefined;

  export let useCdn = false;
  export let fetchpriority: string | undefined;
  const cdn = PUBLIC_CDN_BASE_URL ?? 'https://i.yomikaze.org';

  function mayAppendCdn(src: string | undefined): string {
    if (!src) return '';
    let url;
    try {
      url = new URL(src);
    } catch (error) {
      url = new URL(src, cdn);
    }
    return url.toString();
  }

  // add loading effect
  async function loadImage(src: string | Array<string | undefined> | undefined): Promise<string> {
    if (!src) throw new Error('No image source provided');
    const array = Array.isArray(src) ? src : [src];
    const errors = [];
    for (let src of array) {
      if (!src) continue;
      src = useCdn ? mayAppendCdn(src) : src;
      // chaining next source on error
      const img = new Image();
      img.src = src;
      try {
        await new Promise<string>((resolve, reject) => {
          img.onload = () => resolve(src);
          img.onerror = (error) => reject(error);
        });
        return src;
      } catch (error) {
        errors.push(error);
      }
    }
    throw errors;
  }
  export let imgClass = `w-full h-full`;
</script>

{#key src}
  {#each (Array.isArray(src) ? src : [src]) as s}
    <link rel="preload" fetchpriority={fetchpriority} as="image" href={s} />
  {/each}
  {#await loadImage(src)}
    <slot name="loading">
      <div class={$$props.class ? $$props.class : ''}>
        <div class="flex justify-center items-center {imgClass}">
          <span class="loading loading-dots"></span>
        </div>
      </div>
    </slot>
  {:then src}
    <picture class={$$props.class ? $$props.class : ''} data-src={src} draggable="false">
      <source class={imgClass} srcset={src} draggable="false" />
      <slot name="fallback">
        <source class={imgClass} src="/images/broken-image.svg" type="image/svg+xml" draggable="false"/>
        <img class={imgClass} src="/images/broken-image@2x.png" alt="" draggable="false"/>
      </slot>
    </picture>
  {:catch}
    <slot name="error">
      <picture class={$$props.class ? $$props.class : ''} data-src={src} draggable="false">
        <source class={imgClass} src="/images/broken-image.svg" type="image/svg+xml" draggable="false"/>
        <img class={imgClass} src="/images/broken-image@2x.png" alt="" draggable="false"/>
      </picture>
    </slot>
  {/await}
{/key}
