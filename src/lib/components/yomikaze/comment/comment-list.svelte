<script lang="ts">
  import type PagedResult from '$models/PagedResult';
  import type { ComicCommentManagement } from '$utils/comment-utils';
  import PaginationComponent from '../common/pagination.svelte';
  import type Comment from '$models/Comment';
  import type PaginationModel from '$models/Pagination';
  import { tick } from 'svelte';
  import CommentComponent from './comment.svelte';

  export let comicId: string;
  export let commentManager: ComicCommentManagement;
  export let initialData: PagedResult<Comment> | null = null;
  export let loadFn: (pagination: PaginationModel) => Promise<PagedResult<Comment>> = async (pagination: PaginationModel) => {
    return await commentManager.getComicComments(comicId, { page: pagination.page, size: 3 });
  };
  export let currentPage = 1;

  async function middleware(paged: PagedResult<Comment>): Promise<PagedResult<Comment>> {
    await tick();
    comments = paged.results;
    totalPages = paged.totalPages;
    totals = paged.totals;
    currentPage = paged.currentPage;
    return paged;
  }

  async function init() {
    if (!initialData) {
      return await loadFn({ page: currentPage }).then(middleware);
    }
    return initialData;
  }

  let totalPages = 0;
  let task: Promise<PagedResult<Comment>> = init().then(middleware);
  let comments: Comment[] = [];
  let totals = 0;
  async function handlePageChange(event: CustomEvent<number>) {
    currentPage = event.detail;
    task = loadFn({ page: currentPage }).then(middleware);
  }
</script>
<div class="w-full flex flex-col gap-6">
    <div class="flex flex-col gap-4">
        {#each comments as comment (comment.id)}
            <CommentComponent {comment} {commentManager} />
        {/each}
    </div>
    <PaginationComponent bind:currentPage bind:totalPages on:page={handlePageChange} />
</div>
