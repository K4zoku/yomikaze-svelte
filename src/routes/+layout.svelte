<script lang="ts">
  import '~/app.postcss';

  import Brand from '$components/brand.svelte';
  import DefaultAvatar from '$components/default-user-avatar.svelte';
  import { localStorageWritable } from '@babichjacob/svelte-localstorage';
  import type { Writable } from 'svelte/store';
  import { version } from '$app/environment';
  import { page } from '$app/stores';
    import Icon from '$components/icon.svelte';
  let path: string;
  $: path = $page.url.pathname;

  let theme: Writable<string> = localStorageWritable('theme', '');
  let screenWidth: number;
  let drawerOpened: boolean = true;

  $: drawerOpened = screenWidth >= 1280; // xl:breakpoint
  
  interface InlineSearch {
    focused: boolean;
    element: HTMLInputElement | undefined;
  }
  let inlineSearch: InlineSearch = {
    focused: false,
    element: undefined
  };

  let scrollY: number;
  function onKeyDown(event: KeyboardEvent) {
    const { key, ctrlKey, repeat } = event;
    if (repeat) return;

    switch (key) {
      case 'k':
        if (ctrlKey) {
          event.preventDefault();
          inlineSearch.element?.focus();
        }
        break;
      case 'Escape':
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        break;
    }
  }
</script>

<svelte:window bind:scrollY on:keydown={onKeyDown} bind:innerWidth={screenWidth}/>
<div data-theme={$theme} class="drawer xl:drawer-open" class:xl:drawer-open={drawerOpened}>
  <input id="drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpened} />
  <div class="drawer-side z-40">
    <label for="drawer" class="drawer-overlay" aria-label="Close drawer"></label>
    <aside
      class="bg-base-200 h-screen max-h-screen flex flex-col gap-2 md:gap-4 w-80 max-w-full shadow-inner fixed"
    >
      <div
        data-sveltekit-preload-data="hover"
        class="items-center gap-2 px-4 py-2 flex justify-between transition-opacity duration-200 shrink-0"
      >
        <div class="transition-transform duration-500" class:translate-x-50={!drawerOpened}>
          <Brand autoHideBrandName={false} />
        </div>
        <label for="drawer" class="btn btn-circle btn-ghost">
          <span class="duration-500 iconify lucide--x text-2xl"></span>
        </label>
      </div>
      <div class="overflow-y-scroll h-full max-h-full scrollbar">
        <ul class="menu px-4 py-0">
          <li>
            <a href="/" class="font-bold" class:active={path === '/'}>
              <Icon icon="lucide--home" class="text-xl"/>
              
              Home
            </a>
          </li>
          <li>
            <details id="me" open>
              <summary class="group font-bold">
                <Icon icon="lucide--user" class="text-xl"/>
                Me
              </summary>
              <ul class="menu">
                <li>
                  <a href="/profile/@me" class:active={path.startsWith('/profile')}> Profile </a>
                </li>
                <li>
                  <a href="/library" class:active={path.startsWith('/library')}> Following </a>
                </li>
                <li>
                  <a href="/history" class:active={path.startsWith('/history')}> History </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details id="titles" open>
              <summary class="group font-bold">
                <Icon icon="lucide--book-open" class="text-xl"/>
                Titles
              </summary>
              <ul class="menu">
                <li>
                  <a href="/search" class:active={path.startsWith('/search')}> Advanced Search </a>
                </li>
                <li>
                  <a href="/recents" class:active={path.startsWith('/recents')}> Recently Added </a>
                </li>
                <li>
                  <a href="/updates" class:active={path.startsWith('/updates')}> Latest Updates </a>
                </li>
                <li>
                  <a href="/comics/random"> Random </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details id="transactions" open>
              <summary class="group font-bold">
                <Icon icon="lucide--wallet" class="text-xl"/>
                Transactions
              </summary>
              <ul class="menu">
                <li>
                  <a href="/shop" class:active={path.startsWith('/shop')}> Coins Shop </a>
                </li>
                <li>
                  <a href="/widrawal" class:active={path.startsWith('/widrawal')}> Withdrawal </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details id="transactions" open>
              <summary class="group font-bold">
                <Icon icon="lucide--pin" class="text-xl"/>
                Yomikaze
              </summary>
              <ul class="menu">
                <li>
                  <a href="/about-us" class:active={path.startsWith('/about-us')}> About Us </a>
                </li>
                <li>
                  <a href="/privacy-policy" class:active={path.startsWith('/privacy-policy')}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/term-of-service" class:active={path.startsWith('/term-of-service')}>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <!-- <ul class="menu py-0">
        <li></li>
      </ul>
      <div class="flex justify-center items-center py-1">
        <div class="w-48 h-48">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 670" class="object-contain object-center w-full h-full"
            ><defs
              ><style>
                @import url(https://fonts.googleapis.com/css2?family=Sedgwick+Ave%3Aital%2Cwght%400%2C400&amp;display=swap);
              </style></defs
            ><g class="layer" transform="translate(-63.228 -92.754)"
              ><path
                id="svg_1"
                fill="#572a1a"
                d="M390.51 569a240.37 240.37 0 0 1-23.54-7.6c13.85-22.3 15.42-38.41 13.85-48.6 7 .83 14.33 2 21.44 3.49 2.91 9.25 4.03 26.71-11.75 52.71z"
                class="cls-1"
              /><path
                id="svg_2"
                fill="#cb7244"
                d="M367 561.41c-12.78-4.8-22.51-9.46-24.69-10.52-11.52-5.6-41.24-20.07-38.92-30.08 2.4-10.4 38-10 48.88-9.9a278.6 278.6 0 0 1 28.58 1.9c1.54 10.19-.03 26.3-13.85 48.6z"
                class="cls-2"
              /><path
                id="svg_3"
                fill="#572a1a"
                d="M444.29 564.25c-6.62 8.17-18.81 10.06-32.54 8.75 14.37-23.3 15.33-39.8 13.37-49.83 12.43 5.18 21.72 12.37 23.77 22.25a23.41 23.41 0 0 1-4.6 18.83z"
                class="cls-1"
              /><path
                id="svg_4"
                fill="#cb7244"
                d="M411.75 573a136.38 136.38 0 0 1-21.24-4c15.78-26 14.66-43.47 11.75-52.71a133.57 133.57 0 0 1 22.86 6.87c1.96 10.04 1 26.54-13.37 49.84z"
                class="cls-2"
              /><path
                id="svg_5"
                fill="#cb7244"
                d="M272.74 281.84c-4.93.79-9.75 1.82-14.42 3.05-3.35-4.5-17.64-21.8-32.93-12.39-14.27 8.78-7.57 23.43-4.62 28.52a109.89 109.89 0 0 0-9.83 7c-14.12-11-19.07-29.49-12.55-44.23 6.8-15.34 23.85-21.72 37.5-20.46 18.23 1.72 34.01 17.49 36.85 38.51z"
                class="cls-2"
              /><path
                id="svg_6"
                fill="#f9d6c0"
                d="M258.32 284.89A133.19 133.19 0 0 0 220.77 301c-3-5.09-9.65-19.74 4.62-28.52 15.29-9.39 29.61 7.91 32.93 12.41z"
                class="cls-3"
              /><path
                id="svg_7"
                fill="#cb7244"
                d="M396 317.68a117.77 117.77 0 0 0-10.6-8.67c3.26-4.82 13.74-22.9-3.43-34.49-17.84-12.06-35.87 8.71-39.46 13.21q-8-2.55-16.51-4.35c4.27-24.64 23.6-42.43 45.13-43.52 16-.81 35.7 7.51 42.9 25.81 7.08 17.98-.03 39.99-18.03 52.01z"
                class="cls-2"
              /><path
                id="svg_8"
                fill="#f9d6c0"
                d="M385.42 309a148.82 148.82 0 0 0-42.89-21.28c3.59-4.5 21.62-25.27 39.46-13.21 17.17 11.6 6.69 29.68 3.43 34.49z"
                class="cls-3"
              /><path
                id="svg_9"
                fill="none"
                stroke="#cb7244"
                stroke-miterlimit="10"
                d="M314.33 387.92c-23.48 23.24-50.88 4-52.06 3.12l-1.17 1.62-1.18 1.62c.2.14 12.62 8.93 28.29 8.93 9.13 0 19.38-3 28.93-12.45l-2.81-2.84zm-73 51.31c3 1.18 6.08 2.28 9.23 3.26-.66-.25-4.12-1.49-9.23-3.26z"
                class="cls-4"
              /><path
                id="svg_10"
                fill="#cb7244"
                d="M397.6 333.11q6.7 2.38 12.94 5.15a81 81 0 0 0-19.68-26.83 100.07 100.07 0 0 0-9-7.39 126.79 126.79 0 0 0-36.58-18.15 145.15 145.15 0 0 0-14.08-3.71 163.16 163.16 0 0 0-59.42-1.34c-4.93.79-9.75 1.82-14.42 3.05A133.19 133.19 0 0 0 219.77 300a109.89 109.89 0 0 0-9.83 7c-11.23 9-19.84 19.76-25 31.62 40.84-13.44 78.13-9.69 85.5 9.46C278.37 368.63 249 399 204.88 416l-.73.28a117 117 0 0 0 37.07 22.9h.11c5.11 1.72 8.57 3 9.23 3.26h.12a157.05 157.05 0 0 0 47.17 7.08c30 0 57.41-8.08 78.26-21.4a103.89 103.89 0 0 0 17.32-13.74 177.62 177.62 0 0 1-22.43-6.3c-44.55-15.82-74.7-45.43-67.35-66.14s49.4-24.66 93.95-8.83zm-110.47 27.38c5.5 0 10 3 10 6.61s-4.46 6.6-10 6.6-9.95-2.95-9.95-6.6 4.46-6.61 9.95-6.61zm27.2 27.43 2.81 2.84c-9.55 9.46-19.8 12.45-28.93 12.45-15.67 0-28.09-8.79-28.29-8.93l1.18-1.62 1.17-1.62c1.18.85 28.58 20.12 52.06-3.12z"
                class="cls-2"
              /><path
                id="svg_11"
                fill="#572a1a"
                d="M416.08 364.17c0 18.81-8.4 36.2-22.65 50.3a177.62 177.62 0 0 1-22.43-6.39c-44.55-15.82-74.7-45.43-67.35-66.14s49.43-24.66 94-8.83q6.7 2.38 12.94 5.15a63.93 63.93 0 0 1 5.49 25.91z"
                class="cls-1"
              /><path
                id="svg_12"
                fill="#572a1a"
                d="m204.88 416-.73.28c-15.39-14.42-24.54-32.49-24.54-52.12a64 64 0 0 1 5.39-25.5c40.84-13.44 78.13-9.69 85.5 9.46C278.37 368.63 249 399 204.88 416z"
                class="cls-1"
              /><path
                id="svg_13"
                fill="#572a1a"
                d="M297.09 367.1c0 3.65-4.46 6.6-10 6.6s-9.95-2.95-9.95-6.6 4.46-6.61 9.95-6.61 10 2.96 10 6.61z"
                class="cls-1"
              /><path
                id="svg_14"
                fill="#572a1a"
                d="M314.33 387.92c-23.48 23.24-50.88 4-52.06 3.12l-1.17 1.62-1.18 1.62c.2.14 12.62 8.93 28.29 8.93 9.13 0 19.38-3 28.93-12.45l-2.81-2.84z"
                class="cls-1"
              /><path
                id="svg_15"
                fill="#cb7244"
                stroke="#cb7244"
                stroke-miterlimit="10"
                d="M348.17 477.36h-1.36c6.81 18 17.88 52.11 7.49 59.16-24.52 17.11-14.56 49-14.56 55.66-6.89 13.79-44.17 9.45-44.73 3.58s0-39.32 0-39.32l-7.35-.51s2.29 30.38 0 39.06-46 12.26-44.17-6.13 4.34-20.93-13-53.36c-10.89-20.33-2.2-42.47 5.79-56.15l-.43-.1c-13.34 32.49-20.6 38.35-24.77 37.61-9.15-1.62-16.82-37.37-1.53-59 6.28-8.86 21.39-22.37 31.69-18.68h.11c3 1.18 6.08 2.28 9.23 3.26h.12a157.05 157.05 0 0 0 47.17 7.08c30 0 57.41-8.08 78.26-21.4 0 0 31.54-10.08 37.88 8.13s-28.57 40.6-65.84 41.11z"
                class="cls-5"
              /><path
                id="svg_16"
                fill="none"
                stroke="#cb7244"
                stroke-miterlimit="10"
                d="M236.26 479.34c1.65.31 8.38 1.13 25-2"
                class="cls-4"
              /><path
                id="svg_17"
                fill="none"
                stroke="#cb7244"
                stroke-miterlimit="10"
                d="M335 476.39a61.06 61.06 0 0 0 11.79 1"
                class="cls-4"
              /><path
                id="svg_18"
                fill="none"
                stroke="#cb7244"
                stroke-miterlimit="10"
                d="M346.81 477.35c-2.55-6.78-4.51-11.3-4.51-11.3"
                class="cls-4"
              /><path
                id="svg_19"
                fill="none"
                stroke="#cb7244"
                stroke-miterlimit="10"
                d="M245.53 466.05a94.46 94.46 0 0 0-9.27 13.29"
                class="cls-4"
              /><ellipse
                id="svg_20"
                cx="290.28"
                cy="505.69"
                fill="#fcd9c3"
                class="cls-6"
                rx="38.14"
                ry="30.93"
              /><path
                id="svg_21"
                fill="none"
                stroke="#fcd9c3"
                stroke-miterlimit="10"
                stroke-width="5"
                d="M321.86 355.17a12.32 12.32 0 0 1 22.58-.92"
                class="cls-7"
              /><path
                id="svg_22"
                fill="none"
                stroke="#fcd9c3"
                stroke-miterlimit="10"
                stroke-width="5"
                d="M233.39 359.75a12.33 12.33 0 0 1 22.45-2.68"
                class="cls-7"
              /><path
                id="svg_23"
                fill="#fcd9c3"
                d="M126.53 441.66h344.22v96.53H126.53z"
                class="cls-6"
                transform="rotate(-1.111)"
              /><ellipse
                id="svg_24"
                cx="199.74"
                cy="538.97"
                fill="#cb7244"
                stroke="#cb7244"
                stroke-miterlimit="10"
                class="cls-5"
                rx="18.28"
                ry="9.36"
                transform="rotate(-1.11 198.704 536.719)"
              /><ellipse
                id="svg_25"
                cx="396.63"
                cy="440.95"
                fill="#cb7244"
                stroke="#cb7244"
                stroke-miterlimit="10"
                class="cls-5"
                rx="18.28"
                ry="9.36"
                transform="rotate(-1.11 395.294 438.995)"
              /><text
                id="svg_26"
                x="310.72"
                y="498.71"
                fill="#913b0b"
                stroke-width="0"
                font-family="Sedgwick Ave"
                font-size="49"
                style="white-space:pre"
                text-anchor="middle">Support Here!!</text
              ></g
            ></svg
          >
        </div>
      </div> -->
      <footer class="shrink-0 pb-4">
        <ul class="menu py-2">
          <li></li>
        </ul>
        <div class="flex justify-center items-center gap-4">
          <a
            href="https://facebook.com"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="Facebook"
            target="_blank"
          >
            <Icon icon="hugeicons--facebook-02" class="text-xl"/>
          </a>
          <a
            href="https://x.com"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="X"
            target="_blank"
          >
            <Icon icon="hugeicons--new-twitter" class="text-xl"/>
          </a>
          <a
            href="mailto:contact@yomikaze.org"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="Mail"
            target="_blank"
          >
            <Icon icon="lucide--mail" class="text-xl"/>
          </a>
          <a
            href="https://status.yomikaze.org"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="Status"
            target="_blank"
          >
            <Icon icon="lucide--activity" class="text-xl"/>
          </a>
        </div>
        <div class="w-full flex flex-col justify-center items-center">
          <div class="text-xs">v{version}</div>
          <div class="text-xs">&copy; YomiKaze {new Date().getFullYear()}</div>
        </div>
      </footer>
    </aside>
  </div>
  <div class="drawer-content">
    <div
      class="ml-auto text-base-content fixed transition-[background-color,border-color,width,margin] duration-300 top-0 right-0 z-30 flex h-16 justify-center"
      class:bg-base-100={scrollY > 0}
      class:border-accent={scrollY > 0}
      class:border-b-2={scrollY > 0}
      class:shadow={scrollY > 0}
      class:ml-auto={drawerOpened}
      class:w-full={!drawerOpened}
      class:w-drawer-content={drawerOpened}
    >
      <nav class="navbar container">
        <div class="navbar-start">
          <div
            class="flex gap-4 justify-between items-center transition-opacity duration-200"
            class:hidden={drawerOpened}
          >
            <label for="drawer" class="btn btn-circle btn-ghost">
              <span class="iconify lucide--bar-chart text-2xl transform rotate-90 scale-x-flip"
              ></span>
            </label>
            <Brand />
          </div>
        </div>
        <div class="navbar-end gap-4">
          <div
            data-svelte-typeahead=""
            role="combobox"
            aria-haspopup="listbox"
            class="dropdown transition-[flex] duration-200"
            aria-controls="inline-search-listbox"
            aria-expanded="true"
            id="inline-search-container"
            class:grow={inlineSearch.focused}
          >
            <form action="/search">
              <label
                class="input input-bordered input-sm hidden md:flex items-center gap-2 w-full max-w-full transition-colors duration-200 ease-in-out backdrop-blur"
                id="inline-search-label"
                for="inline-search"
                class:input-accent={inlineSearch.focused}
                class:bg-opacity-50={!inlineSearch.focused}
              >
                <input
                  name="name"
                  type="search"
                  placeholder="Search…"
                  autocomplete="off"
                  spellcheck="true"
                  aria-autocomplete="list"
                  aria-controls="inline-search-listbox"
                  aria-labelledby="inline-search-label"
                  id="inline-search"
                  class="grow"
                  bind:this={inlineSearch.element}
                  on:focus={() => (inlineSearch.focused = true)}
                  on:blur={() => (inlineSearch.focused = false)}
                />
                <div
                  class="flex-none flex items-center gap-1 transition-opacity duration-200"
                  class:opacity-0={inlineSearch.focused}
                >
                  <kbd class="kbd kbd-sm" class:hidden={inlineSearch.focused}>Ctrl</kbd>
                  <kbd class="kbd kbd-sm" class:hidden={inlineSearch.focused}>K</kbd>
                </div>
                <div class="flex-none flex items-center">
                  <Icon icon="lucide--search" class="text-lg"/>
                </div>
              </label>
              <button class="hidden" type="submit"></button>
            </form>
          </div>
          <div class="flex gap-4 items-center pe-2">
            <details class="dropdown dropdown-end">
              <summary class="btn btn-sm md:btn-md btn-circle">
                <Icon icon="lucide--bell" class="md:text-2xl" />
              </summary>
              <div
                class="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow flex flex-col justify-center items-center"
              >
                <div></div>
              </div>
            </details>
            <details class="dropdown dropdown-end">
              <summary class="avatar btn btn-circle btn-ghost">
                <div
                  class="ring-2 ring-offset-2 ring-neutral ring-offset-base-100 w-8 rounded-full"
                >
                  <DefaultAvatar />
                </div>
              </summary>
              <ul
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a class="justify-between" href="/profile">
                    Profile
                    <span class="badge">New</span>
                  </a>
                </li>
                <li><a href="/settings">Settings</a></li>
                <li><a href="/logout">Logout</a></li>
              </ul>
            </details>
          </div>
        </div>
      </nav>
    </div>
    <div
      class="absolute transition-[background-color,border-color,width,margin] duration-200 top-0 right-0 w-drawer-content"
      class:w-full={!drawerOpened}
      class:w-drawer-content={drawerOpened}
    >
      <slot />
    </div>
  </div>
</div>
