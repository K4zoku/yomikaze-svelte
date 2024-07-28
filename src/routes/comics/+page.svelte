<script lang="ts">
    import Sublayout from '$components/yomikaze/sublayout.svelte';
    import type Pagination from '$models/Pagination';
    import { getComics } from '$utils/comic-utils';
    import ComicList from '$components/yomikaze/common/comic/comic-list.svelte';
    let pageName = 'All Comics';
    let dataOfRecentComic = [];
    async function loadFn(pagination: Pagination) {
      pagination.size = 12;
      return await getComics({...pagination, orderBy:["Name"]});
    }
  </script>
  <svelte:head>
    <title>{pageName}</title>
  </svelte:head>
  <Sublayout {pageName}>
      <ComicList {loadFn}></ComicList>
  </Sublayout>
  