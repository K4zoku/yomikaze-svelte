<script lang="ts">
  import Swap from '$components/daisyui/actions/swap.svelte';
  import Icon from '$components/icon.svelte';
  import { trySetBaseUrl } from '$utils/comic-utils';
  import axios from 'axios';
  import { onMount, tick } from 'svelte';
  import type { OCRPage } from './ocr';
  import Wrapper from './wrapper.svelte';
  import ColorPicker from 'svelte-awesome-color-picker';
    import Picture from '$components/picture.svelte';
  export let data;
  let chapter = data.chapter;

  interface Geometry {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface TranslationBox {
    original: string;
    translated: string;
    geometry: Geometry;
    textFormat: TextFormat;
  }

  interface TextFormat {
    font?: string;
    fontSize?: string;
    lineHeight?: number;
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    stroke?: number;
    strokeColor?: string;
    letterSpacing?: number;
  }

  const DEFAULT_TEXT_FORMAT: TextFormat = {
    font: 'Comic Neue',
    fontSize: 'text-xl',
    lineHeight: 1.1,
    color: '#000000',
    backgroundColor: '#ffffffff',
    textAlign: 'center',
    bold: false,
    italic: false,
    underline: false,
    stroke: 0,
    strokeColor: '#000000',
    letterSpacing: 0.1
  };

  interface Translations {
    boxes: TranslationBox[];
    image: string;
    width: number;
    height: number;
  }

  let pages: Translations[] = [];
  let currentPage: Translations;
  function listFontFamilies() {
    const fontFaces = [...document.fonts.values()];
    const families = fontFaces.map((font) => font.family).filter((family) => family !== 'Lexend'); // remove Lexend as it's a website display font
    // converted to set then to array to remove duplicates
    return [...new Set(families)];
  }

  onMount(async () => {
    pages = await Promise.all(
      chapter.pages.map(async (page) => {
        let image = trySetBaseUrl(page);
        let { width, height } = await new Promise<{ width: number; height: number }>(
          (resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              let { naturalWidth, naturalHeight } = img;
              resolve({ width: naturalWidth, height: naturalHeight });
            };
            img.onerror = reject;
            img.src = image;
          }
        );
        return {
          image,
          width,
          height,
          boxes: []
        } as Translations;
      })
    );
    currentPage = pages[0];
    zoomCenter = { x: currentPage.width / 2, y: currentPage.height / 2 };
    zoomFactor = svgContainer.clientHeight / currentPage.height;
    svgPosition = {
      x: svgContainer.clientWidth / 2 - currentPage.width * zoomFactor / 2,
      y: svgContainer.clientHeight / 2 - currentPage.height * zoomFactor / 2
    };
  });
  const ocr = axios.create({
    baseURL: 'https://ocr.yomikaze.org/'
  });

  async function runOcr() {
    const page = (await ocr
      .post('/translate', {
        url: currentPage.image
      })
      .then((response) => response.data)) as OCRPage;
    for (let ocrBox of page.details) {
      const box: TranslationBox = {
        original: ocrBox.text.originalText,
        translated: ocrBox.text['ENG'],
        geometry: {
          x: ocrBox.minX,
          y: ocrBox.minY,
          width: ocrBox.maxX - ocrBox.minX,
          height: ocrBox.maxY - ocrBox.minY
        },
        textFormat: { ...DEFAULT_TEXT_FORMAT }
      };
      currentPage.boxes.push(box);
    }
    currentPage = currentPage; // trigger reactive
  }

  let ocrAwaiter: Promise<void> = Promise.resolve();
  function handleTranslateButtonClick() {
    if (currentPage.boxes.length > 0) return;
    ocrAwaiter = runOcr();
  }

  let textFormat: TextFormat;

  function resetFormat() {
    textFormat = { ...DEFAULT_TEXT_FORMAT, textAlign: undefined };
  }

  resetFormat();

  let currentBox: TranslationBox | undefined;
  let awaitSave = Promise.resolve();

  function initBox(elem: HTMLSpanElement, box: TranslationBox) {
    awaitSave.then(() => {
      // load box format from box
      textFormat = box.textFormat || DEFAULT_TEXT_FORMAT;
    });

    let savingComplete: () => void;
    awaitSave = new Promise((resolve) => (savingComplete = resolve));
    return {
      destroy() {
        // save box format to box
        box.textFormat = textFormat;
        resetFormat();
        savingComplete();
      }
    };
  }

  let svg: SVGSVGElement;
  let svgPoint: DOMPoint;

  $: if (svg) {
    svgPoint = svg.createSVGPoint();
  }
  function cursorPoint(evt: MouseEvent) {
    svgPoint.x = evt.clientX;
    svgPoint.y = evt.clientY;
    const screenCTM = svg.getScreenCTM();
    if (screenCTM) {
      return svgPoint.matrixTransform(screenCTM.inverse());
    }
    console.log('screenCTM is null');
    return svgPoint;
  }

  let resizeType: 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se' | 'ns' | 'ew' | undefined;
  function startResize(
    event: MouseEvent,
    type: 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se' | 'ns' | 'ew'
  ) {
    resizeType = type;
  }
  let moving = false;
  let offset: { x: number; y: number };
  function startMove(event: MouseEvent) {
    if (!currentBox) return;
    moving = true;
    const { x, y } = cursorPoint(event);
    offset = { x: x - currentBox.geometry.x, y: y - currentBox.geometry.y };
  }

  const resize = async (event: MouseEvent) => {
    if (!currentBox || !resizeType) return;

    const { x, y, width, height } = currentBox.geometry;
    const { x: cursorX, y: cursorY } = cursorPoint(event);

    let newWidth = width;
    let newHeight = height;
    let newX = x;
    let newY = y;
    switch (resizeType) {
      case 'nw':
        newWidth = width + (x - cursorX);
        newHeight = height + (y - cursorY);
        newX = cursorX;
        newY = cursorY;
        break;
      case 'n':
        newHeight = height + (y - cursorY);
        newY = cursorY;
        break;
      case 'ne':
        newWidth = cursorX - x;
        newHeight = height + (y - cursorY);
        newY = cursorY;
        break;
      case 'w':
        newWidth = width + (x - cursorX);
        newX = cursorX;
        break;
      case 'e':
        newWidth = cursorX - x;
        break;
      case 'sw':
        newWidth = width + (x - cursorX);
        newHeight = cursorY - y;
        newX = cursorX;
        break;
      case 's':
        newHeight = cursorY - y;
        break;
      case 'se':
        newWidth = cursorX - x;
        newHeight = cursorY - y;
        break;
      case 'ns':
        newHeight = cursorY - y;
        newY = y;
        break;
      case 'ew':
        newWidth = cursorX - x;
        newX = x;
        break;
    }

    // Ensure dimensions are positive
    if (newWidth < 10) {
      newWidth = 10;
      newX = x + width; // Adjust x if width is negative
    }
    if (newHeight < 10) {
      newHeight = 10;
      newY = y + height; // Adjust y if height is negative
    }

    currentBox.geometry = { x: newX, y: newY, width: newWidth, height: newHeight };
    currentPage = currentPage; // trigger reactive
    await tick();
  };

  const move = (event: MouseEvent) => {
    if (!currentBox) return;
    const { width, height } = currentBox.geometry;
    const { x: offsetX, y: offsetY } = offset;
    const { x: mouseX, y: mouseY } = cursorPoint(event);

    currentBox.geometry = {
      x: mouseX - offsetX,
      y: mouseY - offsetY,
      width,
      height
    };
  };

  const handleMouseUp = () => {
    resizeType = undefined;
    moving = false;
    offset = { x: 0, y: 0 };
    dragging = false;
    draggingOffset = { x: 0, y: 0 };
  };

  $: currentPage, currentBox = undefined; // reset currentBox if currentPage changes

  let zoomFactor = 1;
  let zoomCenter = { x: 0, y: 0 };
  let svgPosition = { x: 0, y: 0 };
  let dragging = false;
  let draggingOffset = { x: 0, y: 0 };
  let svgContainer: HTMLDivElement;
  function startDragView(event: MouseEvent) {
    let { clientX: mouseX, clientY: mouseY } = event;
    draggingOffset = { x: mouseX - svgPosition.x, y: mouseY - svgPosition.y };
    dragging = true;
    console.log('dragging');
  }
  $: if (currentPage) { 
    zoomCenter = { x: currentPage.width / 2, y: currentPage.height / 2 };
    svgPosition = {
      x: svgContainer.clientWidth / 2 - currentPage.width * zoomFactor / 2,
      y: svgContainer.clientHeight / 2 - currentPage.height * zoomFactor / 2
    };
  }
  const handleMouseMove = (event: MouseEvent) => {
    if (resizeType && currentBox) {
      resize(event);
    } else if (moving && currentBox) {
      move(event);
    } else if (dragging) {
      dragView(event);
    }
  };

  function dragView(event: MouseEvent) {
    if ((event.buttons === 1 && event.ctrlKey) || event.buttons === 4) {
      event.preventDefault();
      const { clientX: mouseX, clientY: mouseY } = event;      
      svgPosition = {
        x: mouseX - draggingOffset.x,
        y: mouseY - draggingOffset.y
      };
    }
  }

  function handleMouseWheel(event: WheelEvent) {
    if (event.ctrlKey) {
      event.preventDefault();
      
      const { pageX: mouseX, pageY: mouseY } = event;
      zoomCenter = { x: mouseX - svgPosition.x, y: mouseY - svgPosition.y };
      if (event.deltaY < 0) {
        zoomFactor = Math.min(2, zoomFactor + 0.05);
      } else {
        zoomFactor = Math.max(0.1, zoomFactor - 0.05);
      }
      zoomCenter = { x: currentPage.width / 2, y: currentPage.height / 2 };
    }
  }
  let thumbnailsContainer: HTMLDivElement;
  let accumulatedWheel = 0;
  function handleThumbnailsWheel(event: WheelEvent) {
    if (event.deltaY === 0) return;
    event.preventDefault();
    accumulatedWheel += event.deltaY;
  }

  onMount(() => {
    setInterval(() => {
      if (accumulatedWheel !== 0) {
        thumbnailsContainer.scrollBy({ left: accumulatedWheel, behavior: 'smooth' });
        accumulatedWheel = 0;
      }
    }, 100);
  });
</script>

<svelte:window on:mouseup={handleMouseUp}/>

<div class="flex max-w-full w-full h-screen pt-16">
  <div class="flex flex-col w-full max-w-full min-w-[0]">
    <div class="relative bg-base-300 w-full h-full grow-0">
       <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="w-full h-full overflow-scroll relative" bind:this={svgContainer} on:mousedown={startDragView} on:mousemove={handleMouseMove} on:wheel={handleMouseWheel} on:click={() => (currentBox = undefined)}>
        {#if currentPage}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <svg
            bind:this={svg}
            class="absolute"
            style="transform: translate({svgPosition.x}px, {svgPosition.y}px)"
            width={currentPage.width * zoomFactor}
            height={currentPage.height * zoomFactor}
            viewBox={`0 0 ${currentPage.width} ${currentPage.height}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <image href={currentPage.image} width={currentPage.width} height={currentPage.height} />
            {#each currentPage.boxes as box, i (`${box.geometry.x}-${box.geometry.y}`)}
              <foreignObject
                x={box.geometry.x - 8}
                y={box.geometry.y - 8}
                width={box.geometry.width + 16}
                height={box.geometry.height + 16}
                class="p-2"
              >
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <label
                  for="box-{i}"
                  class="w-full h-full indicator border-dashed select-none cursor-move p-1"
                  style:background-color={box === currentBox
                    ? textFormat.backgroundColor
                    : box.textFormat.backgroundColor}
                  class:border-2={box === currentBox}
                  class:border-primary={currentBox === box}
                  on:mousedown={(event) => {
                    currentBox = box;
                    startMove(event);
                  }}
                >
                  {#if box === currentBox}
                    <div
                      on:mousedown={(e) => startResize(e, 'nw')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-top indicator-start cursor-nw-resize"
                    ></div>
                    <div
                      on:mousedown={(e) => startResize(e, 'n')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-top indicator-center cursor-ns-resize"
                    ></div>
                    <div
                      on:mousedown={(e) => startResize(e, 'ne')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-top indicator-end cursor-ne-resize"
                    ></div>
                    <div
                      on:mousedown={(e) => startResize(e, 'w')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-middle indicator-start cursor-ew-resize"
                    ></div>
                    <div
                      on:mousedown={(e) => startResize(e, 'e')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-middle indicator-end cursor-ew-resize"
                    ></div>
                    <div
                      on:mousedown={(e) => startResize(e, 'sw')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-bottom indicator-start cursor-sw-resize"
                    ></div>
                    <div
                      on:mousedown={(e) => startResize(e, 's')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-bottom indicator-center cursor-ns-resize"
                    ></div>
                    <div
                      on:mousedown={(e) => startResize(e, 'se')}
                      class="border-2 w-4 h-4 aspect-square bg-white border-black indicator-item indicator-bottom indicator-end cursor-se-resize"
                    ></div>
                    <div
                      use:initBox={box}
                      class="w-full h-full {textFormat.fontSize} flex items-center"
                      style:font-family={textFormat.font}
                      style:text-align={textFormat.textAlign}
                      style:line-height={textFormat.lineHeight}
                      style:color={textFormat.color}
                      style:font-weight={textFormat.bold ? 'bold' : 'normal'}
                      style:font-style={textFormat.italic ? 'italic' : 'normal'}
                      style:text-decoration={textFormat.underline ? 'underline' : 'none'}
                      style:-webkit-text-stroke={textFormat.stroke
                        ? `${textFormat.stroke}px ${textFormat.strokeColor}`
                        : 'none'}
                      style:letter-spacing="{textFormat.letterSpacing}em"
                    >
                      <span class="grow">
                        {box.translated}
                      </span>
                    </div>
                  {:else}
                    <div
                      class="w-full h-full {box.textFormat.fontSize} flex items-center w-full"
                      style:font-family={box.textFormat.font}
                      style:text-align={box.textFormat.textAlign}
                      style:line-height={box.textFormat.lineHeight}
                      style:color={box.textFormat.color}
                      style:font-weight={box.textFormat.bold ? 'bold' : 'normal'}
                      style:font-style={box.textFormat.italic ? 'italic' : 'normal'}
                      style:text-decoration={box.textFormat.underline ? 'underline' : 'none'}
                      style:-webkit-text-stroke={box.textFormat.stroke
                        ? `${box.textFormat.stroke}px ${box.textFormat.strokeColor}`
                        : 'none'}
                      style:letter-spacing="{box.textFormat.letterSpacing}em"
                    >
                      <span class="grow">
                        {box.translated}
                      </span>
                    </div>
                  {/if}
                </label>
              </foreignObject>
            {/each}
          </svg>
        {/if}
      </div>
      <div class="absolute bottom-4 right-4 z-10 w-full">
        <div class="flex justify-end mb-2 w-full">
          <div class="flex flex-col justify-end items-end gap-2 opacity-40 hover:opacity-100 transition-opacity duration-200">
            <div class="join">
              <button
                class="join-item btn btn-square btn-sm"
                class:btn-disabled={zoomFactor === 0.1}
                on:click={() => (zoomFactor = Math.max(0.1, zoomFactor - 0.1))}
              >
                <Icon icon="lucide--zoom-out" class="text-2xl" />
              </button>
              <button
                class="join-item btn btn-square btn-sm"
                class:btn-disabled={zoomFactor === 2}
                on:click={() => (zoomFactor = Math.min(2, zoomFactor + 0.1))}
              >
                <Icon icon="lucide--zoom-in" class="text-2xl" />
              </button>
            </div>
            <input type="range" min="0.1" max="2" step="0.01" bind:value={zoomFactor} class="range range-xs range-primary" />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-72 overflow-x-scroll bg-base-200 p-4 snap-x" on:wheel={handleThumbnailsWheel} bind:this={thumbnailsContainer}>
      <div class="flex h-full gap-2">
        {#each pages as page, i (i)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="flex items-center gap-2 p-2 rounded snap-start"
            class:bg-primary={currentPage === page}
            class:bg-opacity-20={currentPage === page}
            class:cursor-pointer={currentPage !== page}
            on:click={() => (currentPage = page)}
          >
            <Picture src={page.image} class="w-fit h-full aspect-cover" imgClass="w-full h-full object-cover"/>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <aside class="w-128 h-full py-4 px-6 bg-base-200 flex flex-col gap-2 shrink-0">
    <div class="flex justify-between gap-6">
      <!-- font -->
      <div class="flex items-center gap-2">
        <Icon icon="lucide--type" class="text-2xl" />
        <select
          class="select select-bordered w-44"
          bind:value={textFormat.font}
          disabled={currentBox === undefined}
        >
          {#each listFontFamilies() as font (font)}
            <option value={font}>{font}</option>
          {/each}
        </select>
      </div>
      <!-- font size -->
      <div class="flex items-center gap-2">
        <Icon icon="majesticons--font-size-line" class="text-2xl shrink-0" />
        <select
          class="select select-bordered w-20"
          bind:value={textFormat.fontSize}
          disabled={currentBox === undefined}
        >
          <option value="text-xs">xs</option>
          <option value="text-sm">sm</option>
          <option value="text-base">md</option>
          <option value="text-lg">lg</option>
          <option value="text-xl">xl</option>
          <option value="text-2xl">2xl</option>
          <option value="text-3xl">3xl</option>
          <option value="text-4xl">4xl</option>
          <option value="text-5xl">5xl</option>
          <option value="text-6xl">6xl</option>
        </select>
      </div>
      <!-- text color -->
      <div class="flex items-center">
        <Icon icon="lucide--droplets" class="text-2xl shrink-0" />
        <ColorPicker 
          bind:hex={textFormat.color} 
          label=""
          components={{wrapper: Wrapper}}
        />
      </div>
    </div>
    <div class="flex gap-6 mt-4 items-center justify-center">
      <!-- background color -->
      <div class="flex items-center gap-2">
        <Icon icon="fluent--color-background-24-regular" class="text-2xl shrink-0" />
        <ColorPicker 
          bind:hex={textFormat.backgroundColor} 
          position="responsive" label="" 
          components={{wrapper: Wrapper}}
          --focus-color="var(--fallback-a, oklch(var(--a) / 1))"
          --cp-bg-color="var(--fallback-b1, oklch(var(--b1) / 1))"
          --cp-border-color="var(--fallback-n, oklch(var(--n) / 1))"
          --cp-text-color="var(--fallback-bc, oklch(var(--bc) / 1))"
          --cp-input-color="var(--fallback-b2, oklch(var(--b2) / 1))"
          --cp-button-hover-color="var(--fallback-b2, oklch(var(--b2) / 0.7))"
        />
      </div>
      <!-- text align -->
      <div class="rounded join">
        <button
          class="btn btn-square btn-outline join-item"
          class:btn-active={textFormat.textAlign === 'left'}
          on:click={() => (textFormat.textAlign = 'left')}
          disabled={currentBox === undefined}
        >
          <Icon icon="lucide--align-left" class="text-2xl" />
        </button>
        <button
          class="btn btn-square btn-outline join-item"
          class:btn-active={textFormat.textAlign === 'center'}
          on:click={() => (textFormat.textAlign = 'center')}
          disabled={currentBox === undefined}
        >
          <Icon icon="lucide--align-center" class="text-2xl" />
        </button>
        <button
          class="btn btn-square btn-outline join-item"
          class:btn-active={textFormat.textAlign === 'right'}
          on:click={() => (textFormat.textAlign = 'right')}
          disabled={currentBox === undefined}
        >
          <Icon icon="lucide--align-right" class="text-2xl" />
        </button>
      </div>

      <!-- text style -->
      <div class="flex items-center gap-1">
        <div>
          <Swap bind:active={textFormat.bold} disabled={currentBox === undefined}>
            <span
              slot="on"
              class="btn btn-square shadow-inner bg-base-300"
              class:btn-disabled={currentBox === undefined}
            >
              <Icon icon="lucide--bold" class="text-2xl" />
            </span>
            <span
              slot="off"
              class="btn btn-square shadow bg-base-100"
              class:btn-disabled={currentBox === undefined}
            >
              <Icon icon="lucide--bold" class="text-2xl" />
            </span>
          </Swap>
        </div>
        <button>
          <Swap bind:active={textFormat.italic} disabled={currentBox === undefined}>
            <span
              slot="on"
              class="btn btn-square shadow-inner bg-base-300"
              class:btn-disabled={currentBox === undefined}
            >
              <Icon icon="lucide--italic" class="text-2xl" />
            </span>
            <span
              slot="off"
              class="btn btn-square shadow bg-base-100"
              class:btn-disabled={currentBox === undefined}
            >
              <Icon icon="lucide--italic" class="text-2xl" />
            </span>
          </Swap>
        </button>
        <button>
          <Swap bind:active={textFormat.underline} disabled={currentBox === undefined}>
            <span
              slot="on"
              class="btn btn-square shadow-inner bg-base-300"
              class:btn-disabled={currentBox === undefined}
            >
              <Icon icon="lucide--underline" class="text-2xl" />
            </span>
            <span
              slot="off"
              class="btn btn-square shadow bg-base-100"
              class:btn-disabled={currentBox === undefined}
            >
              <Icon icon="lucide--underline" class="text-2xl" />
            </span>
          </Swap>
        </button>
      </div>
    </div>
    <div class="flex justify-center mt-4 gap-6">
      <!-- text stroke -->
      <div class="flex items-center gap-2">
        <Icon icon="lucide--type-outline" class="text-2xl shrink-0" />
        <select
          class="select select-bordered w-13"
          bind:value={textFormat.stroke}
          disabled={currentBox === undefined}
        >
          <option value="0" selected={textFormat.stroke === 0}>0</option>
          <option value="1" selected={textFormat.stroke === 1}>1</option>
          <option value="2" selected={textFormat.stroke === 2}>2</option>
          <option value="3" selected={textFormat.stroke === 3}>3</option>
          <option value="4" selected={textFormat.stroke === 4}>4</option>
          <option value="5" selected={textFormat.stroke === 5}>5</option>
        </select>
      </div>
      <!-- stroke color -->
      <div class="flex items-center gap-2">
        <Icon icon="lucide--droplet" class="text-2xl shrink-0" />
        <ColorPicker 
          bind:hex={textFormat.strokeColor} 
          position="responsive" label="" 
          components={{wrapper: Wrapper}}
          --focus-color="var(--fallback-a, oklch(var(--a) / 1))"
          --cp-bg-color="var(--fallback-b1, oklch(var(--b1) / 1))"
          --cp-border-color="var(--fallback-n, oklch(var(--n) / 1))"
          --cp-text-color="var(--fallback-bc, oklch(var(--bc) / 1))"
          --cp-input-color="var(--fallback-b2, oklch(var(--b2) / 1))"
          --cp-button-hover-color="var(--fallback-b2, oklch(var(--b2) / 0.7))"
        />
      </div>
      <!-- letter spacing -->
      <div class="flex gap-2 items-center">
        <Icon icon="material-symbols--format-letter-spacing-2-outline-rounded" class="text-2xl" />
        <select
          class="select select-bordered w-13"
          bind:value={textFormat.letterSpacing}
          disabled={currentBox === undefined}
        >
          <option>0.1</option>
          <option>0.2</option>
          <option>0.3</option>
        </select>
      </div>
      <!-- line height -->
      <div class="flex items-center gap-2">
        <Icon icon="majesticons--line-height-line" class="text-2xl shrink-0" />
        <select
          class="select select-bordered w-fit shrink-0"
          bind:value={textFormat.lineHeight}
          disabled={currentBox === undefined}
        >
          <option value="1.1">1.1</option>
          <option value="1.2">1.2</option>
          <option value="1.33">1.33</option>
        </select>
      </div>
    </div>
    <!-- action -->
    <div class="flex justify-end mt-4">
      {#await ocrAwaiter}
        <button class="btn btn-accent btn-block btn-disabled">
          <span class="loading loading-infinity"></span>
          Translating...
        </button>
      {:then _}
        <button class="btn btn-accent btn-block" on:click={handleTranslateButtonClick}>
          <Icon icon="lucide--sparkles" class="text-2xl" />
          <span>Auto translate (AI)</span>
        </button>
      {/await}
    </div>
    <!-- translations -->
    <div class="max-h-full overflow-y-scroll my-4 border-y-2 p-4 grow h-full">
      <div class="flex flex-col gap-4 grow max-h-full py-4 min-h-[0]">
        {#if currentPage}
          {#each currentPage.boxes as box, i (i)}
            <div class="flex flex-col gap-1">
              <label for="box-{i}" class="text-lg font-bold" class:text-accent={currentBox === box}
                >Box {i + 1}</label
              >
              <div class="join join-vertical shadow">
                <textarea
                  class="join-item textarea textarea-bordered"
                  class:textarea-accent={currentBox === box}
                  rows="3"
                  spellcheck="false"
                  disabled>{box.original}</textarea
                >
                <textarea
                  id="box-{i}"
                  class="join-item textarea textarea-bordered"
                  class:textarea-accent={currentBox === box}
                  on:focus={() => {
                    if (currentBox !== box) currentBox = box;
                  }}
                  rows="3"
                  spellcheck="false"
                  bind:value={box.translated}
                ></textarea>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </aside>
</div>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Acme&family=Bangers&family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Delius&display=swap');

  * {
    --focus-color: var(--fallback-a, oklch(var(--a) / 1));
    --cp-bg-color: var(--fallback-b1, oklch(var(--b1) / 1));
    --cp-border-color: var(--fallback-n, oklch(var(--n) / 1));
    --cp-text-color: var(--fallback-bc, oklch(var(--bc) / 1));
    --cp-input-color: var(--fallback-b2, oklch(var(--b2) / 1));
    --cp-button-hover-color: var(--fallback-b2, oklch(var(--b2) / 0.7));
  }
</style>
