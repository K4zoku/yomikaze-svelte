<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  import { PUBLIC_BASE_URL } from '$env/static/public';
  import type Login from '$models/Login.js';
  import { login } from '$utils/auth-utils.js';
  import { getContext, onDestroy, onMount, tick } from 'svelte';

  import type AuthDataStore from '$models/AuthDataStore.js';
  import type Problem from '$models/ProblemResponse.js';
  import type { AxiosError } from 'axios';
  import { debounce } from '$utils/common.js';

  export let data;
  const { isAuthenticated } = getContext('auth') as AuthDataStore;
  const { returnUrl, error } = data;
  enum errorsMap {
    invalid_token = 'Invalid credentials',
    missing_token = 'Login with Google failed',
    forbidden = 'You are banned from the platform',
    unknown = 'An unknown error occurred'
  }

  function buildGoogleReturnUrl(): string {
    let url = returnUrl ?? '/';
    return encodeURIComponent(`${PUBLIC_BASE_URL}/login/success?returnUrl=${encodeURI(url)}`);
  }

  let showPassword = false;

  let form = {
    errors: {
      _: [] as string[],
      username: '',
      password: ''
    },
    values: {
      username: '',
      password: ''
    } as Login
  };

  function triggerReactivity() {
    form = { ...form };
  }

  async function validateUserName() {
    const { username } = form.values;
    const { errors } = form;
    let validateOk = false;
    if (!username) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else {
      validateOk = true;
      errors.username = '';
    }
    triggerReactivity();
    return validateOk;
  }

  let [debouncedValidateUserName, destroyDebouncedValidateUserName] = debounce<void>(validateUserName, 500);

  async function validatePassword() {
    const { password } = form.values;
    const { errors } = form;
    let validateOk = false;
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else {
      validateOk = true;
      errors.password = '';
    }
    triggerReactivity();
    return validateOk;
  }

  let [debouncedValidatePassword, destroyDebouncedValidatePassword] = debounce<void>(validatePassword, 500);

  onDestroy(() => {
    destroyDebouncedValidateUserName();
    destroyDebouncedValidatePassword();
  });

  async function handleSubmit() {
    loggingIn = true;
    if ((await validateUserName()) && (await validatePassword())) {
      try {
        let response = await login(form.values);
        await goto(
          `/login/success?returnUrl=${encodeURIComponent(returnUrl || '/')}&token=${response.token}`
        );
      } catch (error) {
        const axiosError = error as AxiosError;
        const { response } = axiosError;
        if (response) {
          let data = response.data as Problem;
          for (let key of Object.keys(data.errors)) {
            switch (key) {
              case 'Username':
                form.errors.username = data.errors[key].at(0) ?? '';
                break;
              case 'Password':
                form.errors.password = data.errors[key].at(0) ?? '';
                break;
              default:
                form.errors._ = [errorsMap.unknown];
                break;
            }
          }
        } else {
          form.errors._ = [errorsMap.unknown];
        }
      }
    }
    loggingIn = false;
  }

  let loggingIn = false;

  onMount(() => {
    if (error) {
      switch (error) {
        case 'invalid_token':
          form.errors._ = [errorsMap.invalid_token];
          break;
        case 'missing_token':
          form.errors._ = [errorsMap.missing_token];
          break;
        case 'forbidden':
          form.errors._ = [errorsMap.forbidden];
          break;
        default:
          form.errors._ = [errorsMap.unknown];
          break;
      }
    }
    if ($isAuthenticated) {
      goto('/');
    }
  });
</script>

{#if $isAuthenticated}
  <div class="container flex flex-col items-center justify-center h-screen">
    <h2 class="text-4xl font-bold">You are already logged in</h2>
    <div class="mt-6 italic text-2xl text-neutral flex items-center justify-center gap-2">
      <span>Redirecting you to the home page</span>
      <span class="loading loading-md loading-dots"></span>
    </div>
    <a href="/" class="link link-accent mt-4">Click here if you are not redirected</a>
  </div>
{:else}
  <section class="container pt-16 h-screen flex items-center justify-start">
    <!-- Background image container -->

    <object
      data="/images/mascot_tanuki.svg"
      type="image/svg+xml"
      aria-label="Tanuki"
      class="object-contain w-128 h-128"
    />

    <!-- Form container -->

    <form
      on:submit|preventDefault={handleSubmit}
      class=" bg-base-200 rounded-lg shadow-lg w-full max-w-md p-7 shrink-0"
    >
      <div class="flex flex-col items-center justify-center">
        <p class="text-2xl font-semibold">Login</p>
      </div>
      {#each form.errors._ as error}
        <div role="alert" class="alert alert-error">
          <Icon icon="lucide--circle-alert" class="text-lg" />
          <span>{error}</span>
        </div>
      {/each}
      <!-- username input -->
      <label class="form-control">
        <div class="label">
          <span class="label-text">Username</span>
        </div>
        <div
          class="input input-bordered flex items-center gap-2 invalid:input-error invalid:required:input-error"
          class:input-error={!!form.errors.username}
        >
          <Icon icon="lucide--user" class="text-lg" />
          <input
            type="text"
            class="grow"
            placeholder="Enter your username"
            required
            bind:value={form.values.username}
            on:change={validateUserName}
            on:input={() => debouncedValidateUserName()}
            disabled={loggingIn}
          />
        </div>

        <div class="label">
          <span class="label-text-alt text-error">
            {form.errors.username}
          </span>
        </div>
      </label>
      <!-- Password input -->
      <label class="form-control">
        <div class="label">
          <span class="label-text">Password</span>
        </div>
        <div
          class="input input-bordered flex items-center gap-2 invalid:input-error"
          class:input-error={!!form.errors.password}
        >
          <Icon icon="lucide--key" class="text-lg" />
          {#if showPassword}
            <input
              type="text"
              class="grow"
              placeholder="Enter your password"
              required
              bind:value={form.values.password}
              on:change={validatePassword}
              on:input={() => debouncedValidatePassword()}
              disabled={loggingIn}
            />
          {:else}
            <input
              type="password"
              class="grow"
              placeholder="Enter your password"
              required
              bind:value={form.values.password}
              on:change={validatePassword}
              on:input={() => debouncedValidatePassword()}
              disabled={loggingIn}
            />
          {/if}
          <button
            type="button"
            class="flex items-center justify-center"
            on:click={() => (showPassword = !showPassword)}
          >
            {#if showPassword}
              <Icon icon="lucide--eye-off" class="text-xl" />
            {:else}
              <Icon icon="lucide--eye" class="text-xl" />
            {/if}
          </button>
        </div>

        <div class="label">
          <span class="label-text-alt text-error">
            {form.errors.password}
          </span>
        </div>
      </label>

      <!-- Remember me and forgot password -->
      <div class="flex items-center justify-end w-full pb-4">
        <!-- <div class="form-control">
        <label class="label cursor-pointer flex gap-2">
          <span class="label-text">Remember me</span>
          <input type="checkbox" checked class="checkbox checkbox-sm" />
        </label>
      </div> -->
        <a href="/password/reset" class="link link-accent text-sm link-hover">Forgot password?</a>
      </div>

      <!-- Login button -->
      <div class="flex flex-col items-center py-2">
        <button
          type="submit"
          class="btn btn-md btn-wide btn-accent flex gap-2"
          disabled={loggingIn}
        >
          {#if loggingIn}
            <div class="loading loading-dots"></div>
            Logging in
          {:else}
            Login
          {/if}
        </button>

        <div class="divider w-64 mx-auto my-2 text-xs">Or</div>

        <!-- Login with Google button -->
        <a
          href="https://api.yomikaze.org/authentication/login/external/Google?returnUrl={buildGoogleReturnUrl()}"
          type="button"
          class="btn btn-md btn-wide btn-outline mx-auto"
          class:btn-disabled={loggingIn}
        >
          <object
            aria-label="Google"
            data="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
            type="image/svg+xml"
          />
          Login with Google
        </a>
      </div>

      <!-- Register link -->
      <div class="flex flex-col text-center mt-4 text-sm">
        <span class="text-sm">Don't have an account?</span>
        <a href="/register" class="link link-accent link-hover">Register Now</a>
      </div>
    </form>
  </section>
{/if}
