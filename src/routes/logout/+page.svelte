<script lang="ts">
    import { goto } from '$app/navigation';
    import http from '$utils/http';
    import { onMount } from 'svelte';
    onMount(async () => {
        await http.post('/notification/unsubscribe', { fcmToken: localStorage.getItem('fcmToken') }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        }).catch(() => {});
        localStorage.removeItem('token');
        localStorage.removeItem('fcmToken');
        http.defaults.headers.common['Authorization'] = '';
        await goto('/', { invalidateAll: true });
    });
</script>

<div class="container h-screen w-full flex items-center justify-center">
    <div class="loading loading-lg loading-ring text-warning"></div>
</div>