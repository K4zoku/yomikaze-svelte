<script lang="ts">
  import '~/app.postcss';
  import Brand from '$components/brand.svelte';

  let drawerOpened: boolean = true;
  let inlineSearchFocused: boolean = false;
  function onInlineSearchFocus() {
    inlineSearchFocused = true;
  }
  function onInlineSearchBlur() {
    inlineSearchFocused = false;
  }
  let scrollY: number = 0;

  function onKeyDown(event: KeyboardEvent) {
    const { key, ctrlKey, repeat } = event;
    if (repeat) return;

    switch (key) {
      case 'k':
        if (ctrlKey) {
          event.preventDefault();
          document.getElementById('inline-search')?.focus();
        }
        break;
      case 'Escape':
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        break;
    }
  }
</script>

<svelte:window bind:scrollY on:keydown={onKeyDown} />
<div class="drawer bg-base-100" class:lg:drawer-open={drawerOpened}>
  <input id="drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpened} />
  <div class="drawer-content">
    <div
      class="ml-auto text-base-content fixed transition-colors duration-300 top-0 right-0 z-30 flex h-16 w-full justify-center"
      class:bg-base-100={scrollY > 0}
      class:border-accent={scrollY > 0}
      class:border-b-2={scrollY > 0}
      class:shadow-sm={scrollY > 0}
      class:bg-gradient-to-b={scrollY === 0}
      class:from-base-100={scrollY === 0}
      class:border-none={scrollY === 0}
      class:max-w-[calc(100%-20rem)]={drawerOpened}
      class:ml-auto={drawerOpened}
    >
      <nav class="navbar max-w-screen-2xl w-full mx-auto px-6">
        <div class="navbar-start">
          {#if !drawerOpened}
            <div class="flex gap-4 justify-between items-center">
              <label for="drawer" class="btn btn-ghost btn-circle" aria-label="Open drawer">
                <span class="iconify lucide--bar-chart text-2xl transform rotate-90 scale-x-flip"
                ></span>
              </label>
              <Brand />
            </div>
          {/if}
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
            class:grow={inlineSearchFocused}
            class:shrink={!inlineSearchFocused}
          >
            <form data-svelte-search="">
              <label
                class="input input-bordered input-sm flex items-center gap-2 w-full transition-colors duration-200 ease-in-out md:mr-28"
                id="inline-search-label"
                for="inline-search"
                class:input-accent={inlineSearchFocused}
              >
                <input
                  name="search"
                  type="search"
                  placeholder="Search…"
                  autocomplete="off"
                  spellcheck="true"
                  aria-autocomplete="list"
                  aria-controls="inline-search-listbox"
                  aria-labelledby="inline-search-label"
                  id="inline-search"
                  class="grow"
                  on:focus={onInlineSearchFocus}
                  on:blur={onInlineSearchBlur}
                />
                <div
                  class="flex-none flex items-center gap-1 transition-opacity duration-200"
                  class:opacity-0={inlineSearchFocused}
                >
                  <kbd class="kbd kbd-sm" class:d-none={inlineSearchFocused}>Ctrl</kbd>
                  <kbd class="kbd kbd-sm" class:d-none={inlineSearchFocused}>K</kbd>
                </div>
                <div class="flex-none flex items-center">
                  <span class="iconify lucide--search text-lg"></span>
                </div>
              </label>
            </form>
            <ul
              role="listbox"
              class="svelte-typeahead-list"
              aria-labelledby="inline-search-label"
              id="inline-search-listbox"
            >
              <!-- <li
        role="option"
        class="svelte-4tg1b1 selected"
        aria-selected="true"
      >
        <div class="py-1 text-sm font-normal">Install</div>
      </li>
      <li
        role="option"
        class="svelte-4tg1b1"
        aria-selected="false"
      >
        <div class="py-1 text-sm font-normal">Config</div>
      </li>
      <li
        role="option"
        class="svelte-4tg1b1"
        aria-selected="false"
      >
        <div class="py-1 text-sm font-normal">Themes</div>
      </li> -->
            </ul>
          </div>
          <div class="flex gap-4 items-center pe-2">
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="avatar">
                <div class="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a class="justify-between">
                    Profile
                    <span class="badge">New</span>
                  </a>
                </li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="container px-6 max-w-screen-2xl w-full mx-auto">
      <slot />
    </div>
    <footer></footer>
  </div>
  <div class="drawer-side z-40">
    <label for="drawer" class="drawer-overlay" aria-label="Close drawer"></label>
    <aside class="bg-base-200 min-h-screen w-80">
      <div
        data-sveltekit-preload-data="hover"
        class="bg-base-200 sticky top-0 z-20 hidden items-center gap-2 bg-opacity-90 px-4 py-2 backdrop-blur lg:flex justify-between"
      >
        <Brand />
        <label for="drawer" class="btn btn-ghost btn-circle" aria-label="Close drawer">
          <span class="iconify lucide--x text-2xl"></span>
        </label>
      </div>
      <div class="h-4"></div>
      <ul class="menu px-4 py-0">
        <li>
          <a href="/" class="font-bold">
            <span class="iconify lucide--home text-xl"></span>
            Home
          </a>
        </li>
        <li>
          <details id="me" open>
            <summary class="group font-bold">
              <span class="iconify lucide--user text-xl"></span>
              Me
            </summary>
            <ul class="menu">
              <li>
                <a href="/profile/@me"> Profile </a>
              </li>
              <li>
                <a href="/library"> Following </a>
              </li>
              <li>
                <a href="/history"> History </a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details id="titles" open>
            <summary class="group font-bold">
              <span class="iconify lucide--book-open text-xl"></span>
              Titles
            </summary>
            <ul class="menu">
              <li>
                <a href="/search"> Advanced Search </a>
              </li>
              <li>
                <a href="/recents"> Recently Added </a>
              </li>
              <li>
                <a href="/updates"> Latest Updates </a>
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
              <span class="iconify lucide--wallet text-xl"></span>
              Transactions
            </summary>
            <ul class="menu">
              <li>
                <a href="/shop"> Coins Shop </a>
              </li>
              <li>
                <a href="/widrawal"> Withdrawal </a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details id="transactions" open>
            <summary class="group font-bold">
              <span class="iconify lucide--pin text-xl"></span>
              Yomikaze
            </summary>
            <ul class="menu">
              <li>
                <a href="/about-us"> About Us </a>
              </li>
              <li>
                <a href="/privacy-policy"> Privacy Policy </a>
              </li>
              <li>
                <a href="/term-of-service"> Terms of Service </a>
              </li>
            </ul>
          </details>
        </li>
        <li></li>
      </ul>
      <!-- <div class="flex justify-center items-center py-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="256"
          height="256"
          id="svg2"
          viewBox="0 0 500 670"
        >
          <desc>Source: openclipart.org/detail/209545</desc>
          <defs>
            <style>
              @import url(https://fonts.googleapis.com/css2?family=Sedgwick+Ave%3Aital%2Cwght%400%2C400&amp;display=swap);
            </style>
          </defs>
          <g class="layer" transform="matrix(1, 0, 0, 1, -63.227559, -92.753847)">
            <title>Layer 1</title>
            <path
              class="cls-1"
              d="m390.51,569a240.37,240.37 0 0 1 -23.54,-7.6c13.85,-22.3 15.42,-38.41 13.85,-48.6c7,0.83 14.33,2 21.44,3.49c2.91,9.25 4.03,26.71 -11.75,52.71z"
              id="svg_1"
              style="fill: rgb(87, 42, 26);"
            />
            <path
              class="cls-2"
              d="m367,561.41c-12.78,-4.8 -22.51,-9.46 -24.69,-10.52c-11.52,-5.6 -41.24,-20.07 -38.92,-30.08c2.4,-10.4 38,-10 48.88,-9.9a278.6,278.6 0 0 1 28.58,1.9c1.54,10.19 -0.03,26.3 -13.85,48.6z"
              id="svg_2"
              style="fill: rgb(203, 114, 68);"
            />
            <path
              class="cls-1"
              d="m444.29,564.25c-6.62,8.17 -18.81,10.06 -32.54,8.75c14.37,-23.3 15.33,-39.8 13.37,-49.83c12.43,5.18 21.72,12.37 23.77,22.25a23.41,23.41 0 0 1 -4.6,18.83z"
              id="svg_3"
              style="fill: rgb(87, 42, 26);"
            />
            <path
              class="cls-2"
              d="m411.75,573a136.38,136.38 0 0 1 -21.24,-4c15.78,-26 14.66,-43.47 11.75,-52.71a133.57,133.57 0 0 1 22.86,6.87c1.96,10.04 1,26.54 -13.37,49.84z"
              id="svg_4"
              style="fill: rgb(203, 114, 68);"
            />
            <path
              class="cls-2"
              d="m272.74,281.84c-4.93,0.79 -9.75,1.82 -14.42,3.05c-3.35,-4.5 -17.64,-21.8 -32.93,-12.39c-14.27,8.78 -7.57,23.43 -4.62,28.52a109.89,109.89 0 0 0 -9.83,7c-14.12,-11 -19.07,-29.49 -12.55,-44.23c6.8,-15.34 23.85,-21.72 37.5,-20.46c18.23,1.72 34.01,17.49 36.85,38.51z"
              id="svg_5"
              style="fill: rgb(203, 114, 68);"
            />
            <path
              class="cls-3"
              d="m258.32,284.89a133.19,133.19 0 0 0 -37.55,16.11c-3,-5.09 -9.65,-19.74 4.62,-28.52c15.29,-9.39 29.61,7.91 32.93,12.41z"
              id="svg_6"
              style="fill: rgb(249, 214, 192);"
            />
            <path
              class="cls-2"
              d="m396,317.68a117.77,117.77 0 0 0 -10.6,-8.67c3.26,-4.82 13.74,-22.9 -3.43,-34.49c-17.84,-12.06 -35.87,8.71 -39.46,13.21q-8,-2.55 -16.51,-4.35c4.27,-24.64 23.6,-42.43 45.13,-43.52c16,-0.81 35.7,7.51 42.9,25.81c7.08,17.98 -0.03,39.99 -18.03,52.01z"
              id="svg_7"
              style="fill: rgb(203, 114, 68);"
            />
            <path
              class="cls-3"
              d="m385.42,309a148.82,148.82 0 0 0 -42.89,-21.28c3.59,-4.5 21.62,-25.27 39.46,-13.21c17.17,11.6 6.69,29.68 3.43,34.49z"
              id="svg_8"
              style="fill: rgb(249, 214, 192);"
            />
            <path
              class="cls-4"
              d="m314.33,387.92c-23.48,23.24 -50.88,4 -52.06,3.12l-1.17,1.62l-1.18,1.62c0.2,0.14 12.62,8.93 28.29,8.93c9.13,0 19.38,-3 28.93,-12.45l-2.81,-2.84zm-73,51.31c3,1.18 6.08,2.28 9.23,3.26c-0.66,-0.25 -4.12,-1.49 -9.23,-3.26z"
              id="svg_9"
              style="fill: none; stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <path
              class="cls-2"
              d="m397.6,333.11q6.7,2.38 12.94,5.15a81,81 0 0 0 -19.68,-26.83a100.07,100.07 0 0 0 -9,-7.39a126.79,126.79 0 0 0 -36.58,-18.15a145.15,145.15 0 0 0 -14.08,-3.71a163.16,163.16 0 0 0 -59.42,-1.34c-4.93,0.79 -9.75,1.82 -14.42,3.05a133.19,133.19 0 0 0 -37.59,16.11a109.89,109.89 0 0 0 -9.83,7c-11.23,9 -19.84,19.76 -25,31.62c40.84,-13.44 78.13,-9.69 85.5,9.46c7.93,20.55 -21.44,50.92 -65.56,67.92l-0.73,0.28a117,117 0 0 0 37.07,22.9l0.11,0c5.11,1.72 8.57,3 9.23,3.26l0.12,0a157.05,157.05 0 0 0 47.17,7.08c30,0 57.41,-8.08 78.26,-21.4a103.89,103.89 0 0 0 17.32,-13.74a177.62,177.62 0 0 1 -22.43,-6.3c-44.55,-15.82 -74.7,-45.43 -67.35,-66.14s49.4,-24.66 93.95,-8.83zm-110.47,27.38c5.5,0 10,3 10,6.61s-4.46,6.6 -10,6.6s-9.95,-2.95 -9.95,-6.6s4.46,-6.61 9.95,-6.61zm27.2,27.43l2.81,2.84c-9.55,9.46 -19.8,12.45 -28.93,12.45c-15.67,0 -28.09,-8.79 -28.29,-8.93l1.18,-1.62l1.17,-1.62c1.18,0.85 28.58,20.12 52.06,-3.12z"
              id="svg_10"
              style="fill: rgb(203, 114, 68);"
            />
            <path
              class="cls-1"
              d="m416.08,364.17c0,18.81 -8.4,36.2 -22.65,50.3a177.62,177.62 0 0 1 -22.43,-6.39c-44.55,-15.82 -74.7,-45.43 -67.35,-66.14s49.43,-24.66 94,-8.83q6.7,2.38 12.94,5.15a63.93,63.93 0 0 1 5.49,25.91z"
              id="svg_11"
              style="fill: rgb(87, 42, 26);"
            />
            <path
              class="cls-1"
              d="m204.88,416l-0.73,0.28c-15.39,-14.42 -24.54,-32.49 -24.54,-52.12a64,64 0 0 1 5.39,-25.5c40.84,-13.44 78.13,-9.69 85.5,9.46c7.87,20.51 -21.5,50.88 -65.62,67.88z"
              id="svg_12"
              style="fill: rgb(87, 42, 26);"
            />
            <path
              class="cls-1"
              d="m297.09,367.1c0,3.65 -4.46,6.6 -10,6.6s-9.95,-2.95 -9.95,-6.6s4.46,-6.61 9.95,-6.61s10,2.96 10,6.61z"
              id="svg_13"
              style="fill: rgb(87, 42, 26);"
            />
            <path
              class="cls-1"
              d="m314.33,387.92c-23.48,23.24 -50.88,4 -52.06,3.12l-1.17,1.62l-1.18,1.62c0.2,0.14 12.62,8.93 28.29,8.93c9.13,0 19.38,-3 28.93,-12.45l-2.81,-2.84z"
              id="svg_14"
              style="fill: rgb(87, 42, 26);"
            />
            <path
              class="cls-5"
              d="m348.17,477.36l-1.36,0c6.81,18 17.88,52.11 7.49,59.16c-24.52,17.11 -14.56,49 -14.56,55.66c-6.89,13.79 -44.17,9.45 -44.73,3.58s0,-39.32 0,-39.32l-7.35,-0.51s2.29,30.38 0,39.06s-46,12.26 -44.17,-6.13s4.34,-20.93 -13,-53.36c-10.89,-20.33 -2.2,-42.47 5.79,-56.15l-0.43,-0.1c-13.34,32.49 -20.6,38.35 -24.77,37.61c-9.15,-1.62 -16.82,-37.37 -1.53,-59c6.28,-8.86 21.39,-22.37 31.69,-18.68l0.11,0c3,1.18 6.08,2.28 9.23,3.26l0.12,0a157.05,157.05 0 0 0 47.17,7.08c30,0 57.41,-8.08 78.26,-21.4c0,0 31.54,-10.08 37.88,8.13s-28.57,40.6 -65.84,41.11z"
              id="svg_15"
              style="fill: rgb(203, 114, 68); stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <path
              class="cls-4"
              d="m236.26,479.34c1.65,0.31 8.38,1.13 25,-2"
              id="svg_16"
              style="fill: none; stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <path
              class="cls-4"
              d="m335,476.39a61.06,61.06 0 0 0 11.79,1"
              id="svg_17"
              style="fill: none; stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <path
              class="cls-4"
              d="m346.81,477.35c-2.55,-6.78 -4.51,-11.3 -4.51,-11.3"
              id="svg_18"
              style="fill: none; stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <path
              class="cls-4"
              d="m245.53,466.05a94.46,94.46 0 0 0 -9.27,13.29"
              id="svg_19"
              style="fill: none; stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <ellipse
              class="cls-6"
              cx="290.28"
              cy="505.69"
              id="svg_20"
              rx="38.14"
              ry="30.93"
              style="fill: rgb(252, 217, 195);"
            />
            <path
              class="cls-7"
              d="m321.86,355.17a12.32,12.32 0 0 1 22.58,-0.92"
              id="svg_21"
              style="fill: none; stroke: rgb(252, 217, 195); stroke-miterlimit: 10; stroke-width: 5px;"
            />
            <path
              class="cls-7"
              d="m233.39,359.75a12.33,12.33 0 0 1 22.45,-2.68"
              id="svg_22"
              style="fill: none; stroke: rgb(252, 217, 195); stroke-miterlimit: 10; stroke-width: 5px;"
            />
            <rect
              class="cls-6"
              height="96.53"
              id="svg_23"
              transform="matrix(1 0 0 1 0 0) matrix(0.999812 -0.0193719 0.0193719 0.999812 0 0)"
              width="344.22"
              x="126.53"
              y="441.66"
              style="fill: rgb(252, 217, 195);"
            />
            <ellipse
              class="cls-5"
              cx="199.74"
              cy="538.97"
              id="svg_24"
              rx="18.28"
              ry="9.36"
              transform="translate(-10.36 3.95) rotate(-1.11)"
              style="fill: rgb(203, 114, 68); stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <ellipse
              class="cls-5"
              cx="396.63"
              cy="440.95"
              id="svg_25"
              rx="18.28"
              ry="9.36"
              transform="translate(-8.43 7.74) rotate(-1.11)"
              style="fill: rgb(203, 114, 68); stroke: rgb(203, 114, 68); stroke-miterlimit: 10;"
            />
            <text
              id="svg_26"
              style="fill: rgb(145, 59, 11); font-family: 'Sedgwick Ave'; font-size: 49px; stroke-width: 0px; text-anchor: middle; white-space: pre;"
              x="310.72"
              y="498.71">Support Here!!</text
            >
          </g>
        </svg>
      </div> -->
      <div class="flex justify-center items-center gap-4 py-4">
        <a
          href="https://facebook.com"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Facebook"
          target="_blank"
        >
          <span class="iconify hugeicons--facebook-02 text-xl"></span>
        </a>
        <a
          href="https://x.com"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="X"
          target="_blank"
        >
          <span class="iconify hugeicons--new-twitter text-xl"></span>
        </a>
        <a
          href="mailto:contact@yomikaze.org"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Mail"
          target="_blank"
        >
          <span class="iconify lucide--mail text-xl"></span>
        </a>
        <a
          href="https://status.yomikaze.org"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Status"
          target="_blank"
        >
          <span class="iconify lucide--activity text-xl"></span>
        </a>
      </div>
    </aside>
  </div>
</div>
