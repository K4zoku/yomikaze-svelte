<script lang="ts">
  import type PagedResult from '$models/PagedResult';
  import type { ComicCommentManagement } from '$utils/comment-utils';
  import PaginationComponent from '../common/pagination.svelte';
  import type Comment from '$models/Comment';
  import type PaginationModel from '$models/Pagination';
  import { tick } from 'svelte';
  import CommentComponent from './comment.svelte';
  import { createEventDispatcher } from 'svelte';
  import type Profile from '$models/Profile';

  const dispatch = createEventDispatcher();

  export let currentUser: Profile;
  export let comicId: string;
  export let commentManager: ComicCommentManagement;
  export let initialData: PagedResult<Comment> | null = null;
  export let loadFn: (pagination: PaginationModel) => Promise<PagedResult<Comment>> = async (
    pagination: PaginationModel
  ) => {
    pagination ??= { page: 1, size: 3 };
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

  let content: string;
  async function postComment() {
    if (!content) {
      return;
    }
    await commentManager.createComment(comicId, content);
    content = '';
    task = loadFn({ page: currentPage }).then(middleware).then((r) => {
      dispatch('comments', r.totals);
      return r;
    });
  }
</script>

<div class="w-full flex flex-col gap-6">
  <div class="w-full flex flex-col gap-4">
    <div class="p-2 flex flex-col gap-2">
      <textarea
        class="textarea textarea-bordered focus:textarea-accent w-full resize-none"
        rows="3"
        placeholder="Write a comment..."
        bind:value={content}
        on:keydown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            postComment();
          }
        }}
      ></textarea>
      <div class="flex justify-end gap-2">
        <button class="btn btn-sm btn-accent" on:click={postComment}> Post comment </button>
      </div>
    </div>
    {#each comments as comment (comment.id)}
      <CommentComponent {comment} {commentManager} {comicId} {currentUser} />
    {/each}
  </div>
  {#if totalPages > 1}
    <div class="flex w-full items-center justify-center mt-4 py-2">
      <PaginationComponent
        class="bg-base-200/50 rounded shadow-inner p-2"
        {currentPage}
        {totalPages}
        on:page={handlePageChange}
      />
    </div>
  {/if}
</div>
