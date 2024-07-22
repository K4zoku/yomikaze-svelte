<script lang="ts">
    import ProfileContainer from "$components/profile.svelte";
    import type Profile from "$models/Profile";
    import { user } from "~/store";

    export let data;
    const { profile } = data;
    let currentUser: Profile | false;
    user.subscribe((value) => {
        currentUser = value;
    });

</script>

<ProfileContainer {profile} isSelf={currentUser && currentUser.id === profile.id} />