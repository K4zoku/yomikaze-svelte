<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import type Comment from '$models/Comment';
  import { Reaction } from '$models/Comment';
  import type Profile from '$models/Profile';
  import type { ComicCommentManagement } from '$utils/comment-utils';
  import { delay } from '$utils/common';
  import Time from 'svelte-time/Time.svelte';

  export let currentUser: Profile;
  export let comment: Comment;
  export let commentManager: ComicCommentManagement;

  let editing = false;
  let newContent = '';

  async function saveEditComment() {
    comment.content = newContent;

    editing = false;
  }

  function cancelEditComment() {
    editing = false;
  }

  async function likeComment() {
    if (comment.isReacted) {
      if (comment.myReaction === Reaction.Like) {
        comment.totalLikes--;
        comment.isReacted = false;
        comment.myReaction = undefined;
      } else if (comment.myReaction === Reaction.Dislike) {
        comment.totalLikes++;
        comment.totalDislikes--;
        comment.myReaction = Reaction.Like;
      }
    } else {
      comment.totalLikes++;
      comment.isReacted = true;
      comment.myReaction = Reaction.Like;
    }
  }

  async function dislikeComment() {
    if (comment.isReacted) {
      if (comment.myReaction === Reaction.Dislike) {
        comment.totalDislikes--;
        comment.isReacted = false;
        comment.myReaction = undefined;
      } else if (comment.myReaction === Reaction.Like) {
        comment.totalLikes--;
        comment.totalDislikes++;
        comment.myReaction = Reaction.Dislike;
      }
    } else {
      comment.totalDislikes++;
      comment.isReacted = true;
      comment.myReaction = Reaction.Dislike;
    }
  }

  let showReplies = false;
  let replies: Comment[] = [];
  $: if (showReplies) loadReplies();
  async function loadReplies() {
    if (replies.length === 0) {
      await delay(1000);
      replies = await commentManager
        .getComicCommentReplies(comment.comicId, comment.id)
        .then((response) => response.results);
    }
  }
</script>

<div class="w-full flex items-start">
  <div class="me-2 p-2 flex items-center justify-center">
    <div
      class="avatar ring-2 ring-offset-2 rounded-full ring-neutral w-10 h-10 flex items-center justify-center"
    >
      {#if comment.author.avatar}
        <Picture
          src={comment.author.avatar}
          alt="Avatar"
          class="w-full h-full"
          imgClass="w-full h-full rounded-full"
          useCdn={true}
        />
      {:else}
        <div class="w-full h-full flex justify-center items-center bg-neutral rounded-full">
          <span class="iconify lucide--user text-3xl text-neutral-content w-full h-full"></span>
        </div>
      {/if}
    </div>
  </div>
  <div class="flex flex-col w-full gap-4">
    <div
      class="flex flex-col w-full justify-between bg-base-100 border-2 border-neutral rounded-lg"
    >
      <div class="flex items-center justify-between gap-2 p-2">
        <div class="flex flex-col">
          <span class="flex gap-4 items-center">
            <span class="font-bold">{comment.author.name}</span>
            <span class="flex gap-1 items-center">
              {#each comment.author.roles as role}
                <span class="badge badge-sm badge-outline">{role}</span>
              {/each}
            </span>
          </span>
          <Time timestamp={comment.creationTime} relative class="text-sm italic" />
        </div>
        <div class="flex flex-col justify-start items-start">
          {#if currentUser && currentUser.id === comment.authorId}
            <details class="dropdown dropdown-end">
              <summary class="btn btn-sm btn-circle">
                <Icon icon="lucide--ellipsis-vertical" class="text-xl" />
              </summary>
              <ul class="dropdown-content menu menu-sm bg-base-100 rounded w-40">
                <li>
                  <button
                    class="flex items-center gap-1"
                    on:click={() => ((editing = !editing), (newContent = comment.content))}
                  >
                    <Icon icon="lucide--edit" class="text-lg shrink-0" />
                    Edit
                  </button>
                </li>
                <li class="text-error">
                  <button class="hover:bg-error hover:text-error-content flex items-center gap-1">
                    <Icon icon="lucide--trash" class="text-lg shrink-0" />
                    Delete
                  </button>
                </li>
              </ul>
            </details>
          {/if}
        </div>
      </div>
      <hr class="border-1 mx-2" />
      <div class="p-2 flex flex-col gap-2">
        {#if editing}
          <textarea
            class="textarea textarea-bordered focus:textarea-accent w-full resize-none"
            bind:value={newContent}
            on:keydown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                saveEditComment();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                cancelEditComment();
              }
            }}
          ></textarea>
          <div class="flex justify-end gap-2">
            <button class="btn btn-sm btn-accent" on:click={saveEditComment}> Save </button>
            <button class="btn btn-sm hover:btn-error" on:click={cancelEditComment}>
              Cancel
            </button>
          </div>
        {:else}
          <p>{comment.content}</p>
        {/if}
      </div>
      <div class="flex justify-start p-2 gap-2">
        <div class="flex gap-2 items-center">
          <button
            class="btn btn-xs"
            class:btn-accent={comment.myReaction === Reaction.Like}
            on:click={likeComment}
          >
            <Icon icon="lucide--thumbs-up" class="text-lg" />
            <span>{comment.totalLikes}</span>
          </button>
          <button
            class="btn btn-xs"
            class:btn-accent={comment.myReaction === Reaction.Dislike}
            on:click={dislikeComment}
          >
            <Icon icon="lucide--thumbs-down" class="text-lg" />
            <span>{comment.totalDislikes}</span>
          </button>
        </div>
        <button class="btn btn-xs" on:click={() => (showReplies = !showReplies)}>
          <Icon icon="lucide--reply" class="text-lg" />
          <span>Replies ({comment.totalReplies})</span>
        </button>
      </div>
    </div>
    {#if showReplies}
      <div class="flex flex-col w-full gap-4">
        {#await loadReplies()}
          <div class="flex items-center gap-2">
            <span class="loading"></span>
            Loading replies...
          </div>
        {:then}
          {#each replies as reply}
            <svelte:self {currentUser} {commentManager} comment={reply} />
          {:else}
            <span class="iconify lucide--chat text-4xl !text-base-content"></span>
            <span>No replies yet</span>
          {/each}
        {/await}
        <div class="flex flex-col gap-2">
            <textarea
                class="textarea textarea-bordered focus:textarea-accent w-full resize-none"
                placeholder="Write a reply..."
            ></textarea>
            <div class="flex justify-end gap-2">
                <button class="btn btn-sm btn-accent"> Reply </button>
            </div>
        </div>
      </div>
    {/if}
  </div>
</div>
