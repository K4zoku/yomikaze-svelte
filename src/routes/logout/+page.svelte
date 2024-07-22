<script lang="ts">
    import { goto } from '$app/navigation';
    import { delay } from '$utils/common';
    import { onMount } from 'svelte';

    import { token, user } from '~/store';

    onMount(async () => {
        token.set(false);
        user.set(false);
        await delay(1000);
        goto('/');
    });
</script>

<div class="container h-screen flex items-center justify-center">
    <div class="loading loading-xl loading-ring"></div>
</div>