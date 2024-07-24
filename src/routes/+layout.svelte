<script lang="ts">
  import '~/app.postcss';

  import { version } from '$app/environment';
  import { page } from '$app/stores';
  import Brand from '$components/brand.svelte';
  import DefaultAvatar from '$components/default-user-avatar.svelte';
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import ThemeSwitch from '$components/theme-switch.svelte';
  import type AuthDataStore from '$models/AuthDataStore';
  import type Comic from '$models/Comic';
  import type Profile from '$models/Profile';
  import { debounce } from '$utils/common';
  import { onDestroy, onMount, setContext, tick } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { preferences } from '~/store';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
  const user: Writable<Profile | null> = writable();
  const token: Writable<string | null> = writable();
  const isAuthenticated: Writable<boolean> = writable(false);
	$: user.set(data.user);
  $: token.set(data.token);
  $: isAuthenticated.set(data.isAuthenticated);
  setContext('auth', { user, token, isAuthenticated } as AuthDataStore);


  let path: string;
  $: path = $page.url.pathname;

  let drawerOpened: boolean = false;

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

  function handleOnClickOutside(event: MouseEvent) {
    document.querySelectorAll('details.dropdown[open]').forEach((dropdown) => {
      if (dropdown instanceof HTMLDetailsElement) {
        const target = event.target as HTMLElement;
        if (!dropdown.contains(target)) dropdown.open = false;
      }
    });
  }

  onMount(async () => {
    await tick();
    let screenWidth = window.innerWidth;
    drawerOpened = screenWidth > 1280;
  });

  async function search() {
    console.log('searching...');
  }
  let searchResults: Comic[] = [];
  const [debouncedSearch, destroyDebouncedSearch] = debounce<void, void>(search, 500);

  onDestroy(() => {
    destroyDebouncedSearch();
  });
</script>

<svelte:window bind:scrollY on:keydown={onKeyDown} on:mousedown={handleOnClickOutside} />

<div
  data-theme={$preferences.theme}
  class="drawer xl:drawer-open"
  class:xl:drawer-open={drawerOpened}
>
  <input id="drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpened} />
  <div class="drawer-side z-40">
    <label for="drawer" class="drawer-overlay" aria-label="Close drawer"></label>
    <aside
      class="bg-base-200 h-screen max-h-screen flex flex-col gap-2 md:gap-4 w-80 max-w-full shadow-inner fixed"
    >
      <div
        data-sveltekit-preload-data="hover"
        class="items-center gap-2 px-4 py-2 flex justify-between transition-opacity duration-150 shrink-0"
      >
        <Brand autoHideBrandName={false} />

        <label for="drawer" class="btn btn-circle btn-ghost">
          <span class="iconify lucide--x text-2xl"></span>
        </label>
      </div>
      <div class="overflow-y-scroll h-full max-h-full">
        <ul class="menu menu-sm px-4 py-0">
          <li>
            <a href="/" class="font-bold" class:active={path === '/'}>
              <Icon icon="lucide--home" class="text-xl" />
              Home
            </a>
          </li>
          <li>
            <details id="me" open>
              <summary class="group font-bold">
                <Icon icon="lucide--user" class="text-xl" />
                Me
              </summary>
              <ul class="menu">
                <li>
                  <a href="/profile" class:active={path.startsWith('/profile')}> Profile </a>
                </li>
                <li>
                  <a href="/library" class:active={path === '/library'}> Following </a>
                </li>
                <li>
                  <a href="/history" class:active={path === '/history'}> History </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details id="titles" open>
              <summary class="group font-bold">
                <Icon icon="lucide--book-open" class="text-xl" />
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
                <Icon icon="lucide--wallet" class="text-xl" />
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
                <Icon icon="lucide--pin" class="text-xl" />
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
      <footer class="shrink-0 pb-4">
        <ul class="menu py-2">
          <li></li>
        </ul>
        <div class="flex justify-center items-center gap-4 py-2">
          <a
            href="https://facebook.com"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="Facebook"
            target="_blank"
          >
            <Icon icon="hugeicons--facebook-02" class="text-lg" />
          </a>
          <a
            href="https://x.com"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="X"
            target="_blank"
          >
            <Icon icon="hugeicons--new-twitter" class="text-lg" />
          </a>
          <a
            href="mailto:contact@yomikaze.org"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="Mail"
            target="_blank"
          >
            <Icon icon="lucide--mail" class="text-lg" />
          </a>
          <a
            href="https://status.yomikaze.org"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="Status"
            target="_blank"
          >
            <Icon icon="lucide--activity" class="text-lg" />
          </a>
        </div>
        <div class="w-full flex flex-col justify-center items-center py-2">
          <div class="text-xs">v{version}</div>
          <div class="text-xs">&copy; YomiKaze {new Date().getFullYear()}</div>
        </div>
      </footer>
    </aside>
  </div>
  <div class="drawer-content">
    <div
      class="text-base-content w-drawer-content fixed transition-[background-color,border-color,width,margin] duration-100 top-0 right-0 z-30 flex h-16 justify-center"
      class:bg-base-100={scrollY > 0}
      class:border-accent={scrollY > 0}
      class:border-b-2={scrollY > 0}
      class:shadow={scrollY > 0}
      class:w-full={!drawerOpened}
      class:w-drawer-content={drawerOpened}
    >
      <nav class="navbar container">
        <div class="navbar-start">
          <div
            class="gap-4 justify-between items-center hidden"
            class:flex={!drawerOpened}
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
            class="dropdown transition-[flex] duration-150"
            aria-controls="inline-search-listbox"
            aria-expanded="true"
            id="inline-search-container"
            class:grow={inlineSearch.focused}
          >
            <form action="/search">
              <label
                class="input input-bordered input-sm hidden md:flex items-center gap-2 w-full max-w-full transition-colors duration-150 ease-in-out backdrop-blur"
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
                  on:input={() => debouncedSearch()}
                />
                <div
                  class="flex-none flex items-center gap-1 transition-opacity duration-300"
                  class:opacity-0={inlineSearch.focused}
                >
                  <kbd class="kbd kbd-sm" class:hidden={inlineSearch.focused}>Ctrl</kbd>
                  <kbd class="kbd kbd-sm" class:hidden={inlineSearch.focused}>K</kbd>
                </div>
                <div class="flex-none flex items-center">
                  <Icon icon="lucide--search" class="text-lg" />
                </div>
              </label>
              <button class="hidden" type="submit"></button>
            </form>
          </div>
          <div class="flex gap-4 items-center pe-2">
            {#if !!$token}
              <details class="dropdown dropdown-end">
                <summary class="btn btn-circle">
                  <Icon icon="lucide--bell" class="text-2xl" />
                </summary>
                <div
                  class="dropdown-content bg-base-100 mt-2 rounded-box z-[1] w-80 min-h-16 p-2 shadow flex flex-col justify-center items-center"
                >
                  <div></div>
                </div>
              </details>
            {/if}
            <details class="dropdown dropdown-end">
              <summary class="avatar btn btn-circle btn-ghost">
                <div
                  class="ring-2 ring-offset-2 ring-neutral ring-offset-base-100 w-8 h-8 rounded-full bg-base-100"
                >
                  {#if $user && $user.avatar}
                    <Picture
                      src={$user.avatar}
                      useCdn={true}
                      alt="User Avatar"
                      class="rounded-full w-full h-full"
                      imgClass="rounded-full w-full h-full"
                    >
                      <DefaultAvatar slot="error" />
                    </Picture>
                  {:else}
                    <DefaultAvatar />
                  {/if}
                </div>
              </summary>
              <ul class="menu w-72 shadow bg-base-200 mt-4 dropdown-content rounded-lg">
                <li>
                  <a
                    href="/profile"
                    class="rounded-lg p-4 min-h-[0] w-full h-fit flex flex-col gap-2 items-center justify-center"
                  >
                    <div
                      class="ring-2 ring-offset-2 ring-neutral w-12 h-12 rounded-full bg-base-100"
                    >
                      {#if $user && $user.avatar}
                        <Picture
                          src={$user.avatar}
                          useCdn={true}
                          alt="User Avatar"
                          class="rounded-full w-full h-full"
                          imgClass="rounded-full w-full h-full"
                        >
                          <DefaultAvatar slot="error" />
                        </Picture>
                      {:else}
                        <DefaultAvatar />
                      {/if}
                    </div>
                    <div class="flex flex-col gap-2 items-center justify-center">
                      <div class="font-bold text-lg">{$user ? $user.name : 'Guest'}</div>
                      {#if $user}
                        <div class="flex gap-2">
                          {#each $user.roles as role}
                            <span class="badge badge-outline badge-ghost">{role}</span>
                          {/each}
                        </div>
                        <div class="flex gap-2 badge text-warning">
                          <Icon icon="la--coins" class="text-lg" />
                          <span>{$user ? $user.balance : 0}</span>
                        </div>
                      {/if}
                    </div>
                  </a>
                </li>
                <li></li>
                <li>
                  <a href="/profile">
                    <Icon icon="lucide--user" class="text-xl" />
                    My Profile
                  </a>
                </li>
                <li>
                  <a href="/library">
                    <Icon icon="lucide--bookmark" class="text-xl" />
                    My Follows
                  </a>
                </li>
                <li>
                  <a href="/history">
                    <Icon icon="lucide--history" class="text-xl" />
                    My History
                  </a>
                </li>
                {#if $user && $user.roles.some( (role) => ['Super', 'Administrator', 'Publisher'].includes(role) )}
                  <li>
                    <a href="/dashboard">
                      <Icon icon="lucide--layout-dashboard" class="text-xl" />
                      Dashboard
                    </a>
                  </li>
                {/if}
                {#if $user && $user.roles.some( (role) => ['Super', 'Administrator', 'Publisher'].includes(role) )}
                  <li>
                    <a href="/withdrawal">
                      <Icon icon="lucide--receipt" class="text-xl" />
                      Withdrawal
                    </a>
                  </li>
                {/if}
                <li></li>
                {#if $isAuthenticated}
                  <li>
                    <a href="/logout" class="text-error hover:bg-error hover:text-base-100">
                      <Icon icon="lucide--log-out" class="text-xl" />
                      Logout
                    </a>
                  </li>
                {:else}
                  <li>
                    <div class="grid grid-cols-2 gap-2 !bg-transparent">
                      <a href="/login" class="btn btn-ghost btn-sm btn-block active:btn-accent">
                        <Icon icon="lucide--log-in" class="text-xl" />
                        Login
                      </a>
                      <a href="/register" class="btn btn-ghost btn-sm btn-block !active:btn-accent">
                        <Icon icon="lucide--user-plus" class="text-xl" />
                        Register
                      </a>
                    </div>
                  </li>{/if}
                <li></li>
                <li>
                  <div class="grid grid-cols-2 gap-2 !bg-transparent">
                    <a href="/profile/settings" class="btn btn-ghost btn-sm btn-block">
                      <Icon icon="lucide--settings" class="text-xl" />
                      Settings
                    </a>
                    <details class="dropdown dropdown-end">
                      <summary class="btn btn-ghost btn-sm btn-block">
                        <Icon icon="lucide--droplet" class="text-xl" />
                        Theme
                      </summary>
                      <ul
                        class="dropdown-content mt-1 bg-base-200 rounded-box z-[2] w-52 p-2 shadow-2xl"
                      >
                        <li>
                          <ThemeSwitch />
                        </li>
                        <li>
                          <ThemeSwitch label="Light" value="ayu-light" />
                        </li>
                        <li>
                          <ThemeSwitch label="Dark" value="ayu-mirage" />
                        </li>
                        <li>
                          <ThemeSwitch label="Midnight" value="ayu-dark" />
                        </li>
                      </ul>
                    </details>
                  </div>
                </li>
              </ul>
            </details>
          </div>
        </div>
      </nav>
    </div>
    <main
      class="absolute transition-[background-color,border-color,width,margin] duration-100 top-0 right-0 w-drawer-content"
      class:w-full={!drawerOpened}
      class:w-drawer-content={drawerOpened}
    >
      <slot />
    </main>
  </div>
</div>
