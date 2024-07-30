<script lang="ts">
    import { goto } from '$app/navigation';

    export let data;
    const { redirect } = data;

    goto(redirect, { replaceState: true, invalidateAll: true });
</script>