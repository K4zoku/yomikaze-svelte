<script lang="ts">
    import ProfileContainer from "$components/profile.svelte";
    import type Profile from "$models/Profile";
    
    export let data;
    const { profile } = data;
</script>

<ProfileContainer {profile} />