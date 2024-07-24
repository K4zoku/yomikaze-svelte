<script lang="ts">
  import ComicList from '$components/yomikaze/common/comic/comic-list.svelte';
  import Sublayout from '$components/yomikaze/sublayout.svelte';
  import type Pagination from '$models/Pagination';
  import { getComics } from '$utils/comic-utils';

  async function loadComics(pagination: Pagination) {
    pagination.size = 18;
    return await getComics(pagination);
  }

</script>

<Sublayout pageName="Drafts">
  <ComicList loadFn={loadComics}>
    <div slot="title" class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Drafts</h1>
    </div>
  </ComicList>
</Sublayout>
