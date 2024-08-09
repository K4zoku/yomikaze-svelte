<script lang="ts">
    import Icon from '$components/icon.svelte';
  import { ComicStatus } from '$models/Comic';

  const statuses: { [key: string]: { icon: string, color: string } } = {
    [ComicStatus.OnGoing]: {
        icon: 'fluent--presence-busy-16-filled',
        color: 'text-success',
    },
    [ComicStatus.Completed]: {
        icon: 'fluent--presence-available-16-filled',
        color: 'text-success',
    },
    [ComicStatus.Cancelled]: {
        icon: 'fluent--presence-dnd-16-filled', 
        color: 'text-error',
    },
    [ComicStatus.Hiatus]: {
        icon: 'fluent--presence-away-16-filled',
        color: 'text-warning',
    },
    [ComicStatus.Pending]: {
        icon: 'fluent--presence-away-16-filled',
        color: 'text-warning',
    },
  };

  export let status: ComicStatus | ComicStatus.OnGoing | ComicStatus.Completed | ComicStatus.Cancelled | ComicStatus.Hiatus;
</script>

<div class="flex items-center justify-center gap-1 bg-base-300 px-2 py-1 select-none rounded">
  <Icon icon={statuses[status].icon} class="text-sm {statuses[status].color}" />
  <span class="text-xs">{status}</span>
</div>
