<script context="module" lang="ts">
  export interface ToastProps {
    message: string;
    color?: string;
    duration?: number;
    icon?: string;
  }
</script>

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
  import formatNumber, { debounce } from '$utils/common';
  import { onDestroy, onMount, setContext } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  import Toast from '$components/daisyui/toast.svelte';
  import http from '$utils/http';
  import type { LayoutData } from './$types';

  import { initializeApp } from 'firebase/app';
  import { getMessaging, getToken, onMessage } from 'firebase/messaging';
  import firebaseConfig from '~/firebase.json';
  import { PUBLIC_FIREBASE_VAPID_KEY } from '$env/static/public';
  import { dev } from '$app/environment';
  import type NotificationModel from '$models/Notification';
  import Time from 'svelte-time/Time.svelte';

  const vapidKey = PUBLIC_FIREBASE_VAPID_KEY;

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  onMessage(messaging, function (payload) {
    console.log('Received Notification: ', payload);
    loadNotifications();
  });
  const broadcast = new BroadcastChannel('yomikaze-worker');
  broadcast.onmessage = (event) => {
    if (event.data && event.data.type === 'notification') {
      console.log('Received Notification from worker:', event.data);
      loadNotifications();
    }
  };
  async function registerToken() {
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js', {
      type: dev ? 'module' : 'classic'
    });
    const options = {
      vapidKey,
      serviceWorkerRegistration
    };
    const fcmToken = await getToken(messaging, options);
    localStorage.setItem('fcm', fcmToken);
    const formData = new FormData();
    formData.set('fcmToken', fcmToken);
    await http.post('/notification/subscribe', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: $token ? `Bearer ${$token}` : undefined
      }
    });
  }
  async function requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notification!');
      return;
    }
    if (Notification.permission === 'granted') {
      registerToken();
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        registerToken();
      }
    }
  }

  let notifications: NotificationModel[] = [];
  let unreadCount: number = 0;
  async function loadNotifications() {
    const response = await http.get('/notification', {
      headers: {
        Authorization: $token ? `Bearer ${$token}` : undefined
      }
    });
    notifications = response.data;
    unreadCount = notifications.filter((notification) => !notification.read).length;
  }

  onMount(() => {
    loadNotifications();
  });

  async function readNotification(notificationId: string) {
    await http.put(`/notification/${notificationId}/read`, null, {
      headers: {
        Authorization: $token ? `Bearer ${$token}` : undefined
      }
    });
  }

  export let data: LayoutData;
  const user: Writable<Profile | null> = writable();
  const token: Writable<string | null> = writable();
  const isAuthenticated: Writable<boolean> = writable(false);
  const preferences = data.preferences;
  $: user.set(data.user);
  $: token.set(data.token);
  $: isAuthenticated.set(data.isAuthenticated);
  setContext('auth', { user, token, isAuthenticated } as AuthDataStore);
  if (localStorage.getItem('token')) {
    token.set(localStorage.getItem('token'));
  }

  const toasts = writable<ToastProps[]>([]);
  setContext('toasts', toasts);
  function addSuccessToast(message: string, duration: number = 5000) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-success', duration, icon: 'lucide--check' }
    ]);
  }
  function addErrorToast(message: string, duration: number = 5000) {
    toasts.update((toasts) => [
      ...toasts,
      { message, color: 'alert-error', duration, icon: 'lucide--alert-circle' }
    ]);
  }
  setContext('addSuccessToast', addSuccessToast);
  setContext('addErrorToast', addErrorToast);
  let path: string;
  $: path = $page.url.pathname;

  let drawerOpened: boolean = data.drawerOpened;

  interface InlineSearch {
    focused: boolean;
    element: HTMLInputElement | undefined;
    value?: string;
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
        if (inlineSearch.focused) inlineSearch.element?.blur();
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

  async function search() {
    if (!inlineSearch.value) {
      searchResults = Promise.resolve([]);
      return;
    }
    searchResults = http
      .get(`/comics?name=${inlineSearch.value}&size=5`)
      .then((res) => res.data.results);
  }
  let searchResults: Promise<Comic[]> = Promise.reject();
  const [debouncedSearch, destroyDebouncedSearch] = debounce<void, void>(search, 300);
  let searchResultsHovering: boolean = false;
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
        <ul class="menu px-4 py-0">
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
            <details id="comics" open>
              <summary class="group font-bold">
                <Icon icon="lucide--book-open" class="text-xl" />
                Comics
              </summary>
              <ul class="menu">
                {#if $user && $user.roles.includes('Publisher')}
                  <li>
                    <a href="/comics/create" class:active={path === '/comics/create'}>
                      Create New Comic
                    </a>
                  </li>
                {/if}
                <li>
                  <a href="/search" class:active={path === '/search'}> Advanced Search </a>
                </li>
                <li>
                  <a href="/recents" class:active={path === '/recents'}> Recently Added </a>
                </li>
                <li>
                  <a href="/updates" class:active={path === '/updates'}> Latest Updates </a>
                </li>
                <li>
                  <a href="/comics/random"> Random </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a href="/shop" class:active={path === '/shop'}>
              <Icon icon="la--coins" class="text-xl" />
              Coins Shop
            </a>
          </li>
          {#if $user && $user.roles.some( (role) => ['Super', 'Administrator', 'Publisher'].includes(role) )}
            <li>
              <details id="management" open>
                <summary class="group font-bold">
                  <Icon icon="lucide--layout-dashboard" class="text-xl" />
                  Management
                </summary>
                <ul class="menu">
                  <li>
                    <a href="/dashboard" class:active={path === '/dashboard'}> Dashboard </a>
                  </li>
                  <li>
                    <a href="/dashboard/comics" class:active={path === '/dashboard/comics'}>
                      Comics
                    </a>
                  </li>
                  {#if $user.roles.some((role) => ['Super', 'Administrator'].includes(role))}
                  <li>
                    <a href="/dashboard/comics/publication-requests" class:active={path === '/dashboard/comics'}>
                      Comics Publication Requests
                    </a>
                  </li>
                    <li>
                      <a href="/dashboard/reports" class:active={path === '/dashboard/reports'}>
                        Reports
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard/users" class:active={path === '/dashboard/users'}>
                        Users
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/role-requests"
                        class:active={path === '/dashboard/role-requests'}
                      >
                        Role Requests
                      </a>
                    </li>
                  {/if}
                  {#if $user.roles.includes('Super')}
                    <li>
                      <a href="/dashboard/tags" class:active={path === '/dashboard/tags'}> Tags </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/withdrawals"
                        class:active={path === '/dashboard/withdrawals'}
                      >
                        Withdrawal requests
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard/coin" class:active={path === '/dashboard/coin'}>
                        Coin Pricing
                      </a>
                    </li>
                  {/if}
                </ul>
              </details>
            </li>
          {/if}
          <li>
            <details id="yomikaze" open>
              <summary class="group font-bold">
                <Icon icon="lucide--pin" class="text-xl" />
                Yomikaze
              </summary>
              <ul class="menu">
                <li>
                  <a href="/about-us" class:active={path === '/about-us'}> About Us </a>
                </li>
                <li>
                  <a href="/privacy-policy" class:active={path === '/privacy-policy'}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/term-of-service" class:active={path === '/term-of-service'}>
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
            role="combobox"
            aria-haspopup="listbox"
            class="dropdown transition-[flex] duration-150"
            aria-controls="inline-search-listbox"
            aria-expanded="true"
            id="inline-search-container"
            class:grow={inlineSearch.focused}
          >
            <div class="dropdown dropdown-end w-full" class:dropdown-open={inlineSearch.focused}>
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
                    bind:value={inlineSearch.value}
                    bind:this={inlineSearch.element}
                    on:focus={() => (inlineSearch.focused = true)}
                    on:blur={() => searchResultsHovering || (inlineSearch.focused = false)}
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
              <div
                role="dialog"
                class="dropdown-content mt-4 w-full max-h-96 overflow-y-scroll bg-base-200 rounded shadow-lg"
                on:mouseenter={() => (searchResultsHovering = true)}
                on:mouseleave={() => (searchResultsHovering = false)}
              >
                <ul
                  id="inline-search-listbox"
                  role="listbox"
                  aria-label="Search Results"
                  class="flex flex-col gap-2 p-2"
                  data-sveltekit-reload
                >
                  {#await searchResults}
                    {#each { length: 5 } as _}
                      <li>
                        <div
                          class="flex items-center max-w-full gap-2 p-2 bg-base-100 h-fit shadow-sm"
                        >
                          <div class="w-12 h-16 aspect-cover rounded-lg shrink-0 skeleton"></div>
                          <div class="flex flex-col grow w-full gap-1 justify-between">
                            <div class="h-4 w-4/5 skeleton"></div>
                            <div class="h-4 w-24 skeleton"></div>
                          </div>
                        </div>
                      </li>
                    {/each}
                  {:then comics}
                    {#each comics as comic, index (comic.id)}
                      <li role="option" aria-selected={index === 0}>
                        <a
                          href={`/comics/${comic.id}`}
                          class="flex items-center max-w-full gap-2 p-2 bg-base-100/50 hover:bg-accent/50 hover:text-accent-content shadow-sm hover:shadow transition duration-200 rounded"
                        >
                          <Picture
                            src={comic.cover}
                            useCdn={true}
                            alt="Cover"
                            class="w-fit h-20 aspect-cover bg-base-200 rounded-lg shrink-0"
                            imgClass="rounded object-cover w-full h-full"
                          />
                          <div class="flex flex-col gap-1 justify-between">
                            <div
                              class="text-lg font-bold text-ellipsis max-h-full line-clamp-2 grow"
                            >
                              {comic.name}
                            </div>
                            <div class="text-sm shrink-0">{comic.authors.join(', ')}</div>
                          </div>
                        </a>
                      </li>
                    {:else}
                      <li class="flex items-center p-4">No results found</li>
                    {/each}
                    {#if comics.length > 0}
                      <li class="flex items-center p-4">
                        <a
                          href="/search?name={inlineSearch.value ?? ''}"
                          class="btn btn-sm btn-block flex items-center justify-center gap-2"
                        >
                          View all results <Icon icon="lucide--external-link" class="text-lg" />
                        </a>
                      </li>
                    {/if}
                  {:catch}
                    <li class="flex items-center p-4">Start typing to search</li>
                  {/await}
                </ul>
              </div>
            </div>
          </div>
          <div class="flex gap-4 items-center pe-2">
            {#if !!$token}
              <details class="dropdown dropdown-end">
                <summary class="btn btn-circle" on:click={() => requestPermission()}>
                  <div class="indicator">
                    {#if unreadCount > 0}
                      <span class="indicator-item indicator-end badge badge-sm badge-error">
                        {formatNumber(unreadCount)}
                      </span>
                    {/if}
                    <Icon icon="lucide--bell" class="text-2xl" />
                  </div>
                </summary>
                <div
                  class="dropdown-content bg-base-100 mt-2 rounded z-[1] w-80 min-h-16 p-2 shadow flex justify-center items-center"
                >
                  <div class="flex flex-col gap-2 max-h-64 overflow-y-scroll">
                    {#each notifications as notification (notification.id)}
                      <button
                        type="button"
                        class="flex flex-col gap-1 w-full rounded p-2 justify-start shadow hover:bg-base-200 hover:shadow-lg border transition-colors duration-150"
                        class:active:shadow-inner={!notification.read}
                        class:bg-base-300={!notification.read}
                        disabled={notification.read}
                        on:click={() =>
                          notification.read
                            ? undefined
                            : readNotification(notification.id).then(() => loadNotifications())}
                      >
                        <div class="text-sm font-medium">
                          {notification.title}
                        </div>
                        <div class="text-xs text-left">
                          {notification.content}
                        </div>
                        <div class="flex gap-1 justify-end text-xs self-end">
                          <Icon icon="lucide--clock" class="text-sm" />
                          <Time timestamp={notification.creationTime} relative />
                        </div>
                      </button>
                    {/each}
                  </div>
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
              <ul class="menu w-72 shadow bg-base-200 mt-4 dropdown-content rounded">
                <li>
                  <a
                    href="/profile"
                    class="rounded p-4 min-h-[0] w-full h-fit flex flex-col gap-2 items-center justify-center"
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
                  <div class="flex items-center !bg-transparent">
                   
                    <details class="dropdown dropdown-end w-full">
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
      <div class="toast toast-end">
        {#each $toasts as toast}
          <Toast {...toast} />
        {/each}
      </div>
    </main>
  </div>
</div>
