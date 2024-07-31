<script lang="ts">
    import Picture from '$components/picture.svelte';
  import type Profile from '$models/Profile';
  export let profile: Profile;
</script>

<a href="/profile/{profile.id}" class="flex items-center gap-3 px-2 py-3">
  <div class="avatar w-8 h-8 shrink-0">
    <div
      class="ring-4 ring-offset-4 ring-neutral ring-offset-base-100 w-8 aspect-square rounded-full bg-base-100 shrink-0"
    >
      {#if profile.avatar}
        <div>
          <Picture
            src={profile.avatar}
            alt="Avatar"
            class="max-w-8 max-h-14"
            imgClass="w-20 h-24 rounded-full"
            useCdn={true}
          />
        </div>
      {:else}
        <div class="w-full h-full flex justify-center items-center bg-gray-100 rounded-full">
          <span class="iconify lucide--user text-8xl !text-base-content"></span>
        </div>
      {/if}
    </div>
  </div>
  <span class="flex items-center font-semibold">{profile.name}</span>
</a>
