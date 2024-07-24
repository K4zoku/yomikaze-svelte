<script lang="ts">
    import { goto } from '$app/navigation';
    import { delay } from '$utils/common.js';
    import { onMount } from 'svelte';

    export let data;
    const { returnUrl } = data;

    onMount(async () => {
        if (returnUrl) {
            await goto(returnUrl, { invalidateAll: true }).catch(() => goto('/', { invalidateAll: true }));
        }
        await delay(2000);
        await goto('/', { invalidateAll: true });
    });
</script>

<div class="container h-screen w-full flex items-center justify-center">
    <div class="loading loading-lg loading-ring text-success"></div>
</div>