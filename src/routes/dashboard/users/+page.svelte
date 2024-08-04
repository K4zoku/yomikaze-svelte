<script lang="ts">
  import http from '$utils/http';
  import { onMount } from 'svelte';
  import { getAllUsers } from '$utils/profile-utils';
  import type Profile from '$models/Profile';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import InlineProfile from '../reports/inline-profile.svelte';
  import Time from 'svelte-time/Time.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let users: Profile[] = [];

  onMount(async () => {
    try {
      users = await getAllUsers(token);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  });
</script>

<Sublayout pageName="Users management">
  <table class="table table-lg">
    <thead>
      <tr class="text-base font-medium">
        <th>User</th>
        <th>Roles</th>
        <th>Bio</th>
        <th>Birthday</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr class="hover">
          <td><InlineProfile profile={user} /></td>
          <td>
            {#each user.roles as role}
              <span class="badge badge-outline mx-1">{role} </span>
            {/each}</td
          >
          <td
            >{#if user.bio}
              {user.bio}
            {:else}
              <span class="text-neutral italic">No bio provied.</span>
            {/if}</td
          >
          <td>
            {#if user.birthday}
              <Time timestamp={user.birthday} />
            {:else}
              <span class="text-neutral italic">No birthday provided</span>
            {/if}
          </td>
          <td><button class="btn btn-error btn-sm">Ban</button></td>
        </tr>
      {:else}
        <tr>
          <td colspan="4" class="text-center">No users found.</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Sublayout>
