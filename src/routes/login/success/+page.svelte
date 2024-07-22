<script lang="ts">
    import { token, user } from '~/store.js';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data;
    const { returnUrl, profile } = data;
    const t = data.token;

    onMount(async () => {
        token.set(t);
        user.set(profile);
        await goto(returnUrl ?? '/');
    });
</script>

<div class="container max-h-screen h-screen flex items-center justify-center">
    <div class="flex flex-col items-center justify-center">
        <div class="text-2xl font-bold">Logging in...</div>
        <div class="mt-4">
            <a href="/">Click here if you are not redirected</a>
        </div>
    </div>
</div>