<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    onMount(async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('fcmToken');
        await goto('/', { invalidateAll: true });
    });
</script>

<div class="container h-screen w-full flex items-center justify-center">
    <div class="loading loading-lg loading-ring text-warning"></div>
</div>