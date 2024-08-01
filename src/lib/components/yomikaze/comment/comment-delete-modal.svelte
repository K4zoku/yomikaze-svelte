<script lang="ts">
  import type Comment from '$models/Comment';
  import type { ComicCommentManagement } from '$utils/comment-utils';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let target: Comment;
  export let comicId: string;
  export let commentManager: ComicCommentManagement;

  async function handleDelete() {
    await commentManager.deleteComment(comicId ?? target.comicId, target.id);
    modal.close();
    dispatch('deleted', target);
  }
  let modal: HTMLDialogElement;
  export let open = false;

  $: if (modal) {
    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  }

</script>

<dialog class="modal" bind:this={modal} on:close={() => open = false}>
  <div class="modal-box">
    <h2 class="text-lg font-bold">Are you sure you want to delete this comment?</h2>
    <p class="italic text-sm">This action cannot be undone.</p>
    <p class="p-4 bg-base-200 rounded mt-2">
        {target.content}
    </p>
    <div class="modal-action">
      <button type="button" class="btn btn-sm btn-error" on:click={handleDelete}>Delete</button>
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
