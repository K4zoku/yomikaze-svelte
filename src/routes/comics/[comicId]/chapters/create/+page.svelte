<script lang="ts">
  import http from '$utils/http';
  import { onMount } from 'svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import HistoryManagement from '$utils/history-utils';
  import Picture from '$components/picture.svelte';
  import ComicStatus from '$components/yomikaze/common/comic/comic-status.svelte';
  import Time from 'svelte-time/Time.svelte';
  import type HistoryRecord from '$models/HistoryRecord.js';

  export let data;
  let statOfDeleteButton: boolean;
  let { token } = data;
  const pageName = 'History';
</script>
