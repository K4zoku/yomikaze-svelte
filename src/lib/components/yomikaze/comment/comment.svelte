<script lang="ts">
  import Icon from '$components/icon.svelte';
  import Picture from '$components/picture.svelte';
  import type Comment from '$models/Comment';
  import { Reaction, type ComicComment } from '$models/Comment';
  import type Profile from '$models/Profile';
  import type { ComicCommentManagement } from '$utils/comment-utils';
  import insane from 'insane';
  import { marked } from 'marked';
  import { onMount, tick } from 'svelte';
  import Time from 'svelte-time/Time.svelte';
  import { fade, slide } from 'svelte/transition';
  import CommentReport from '../report/comment-report.svelte';
  import CommentDeleteModal from './comment-delete-modal.svelte';

  export let currentUser: Profile | undefined = undefined;
  export let comicId: string = '';
  export let comment: Comment;
  export let commentManager: ComicCommentManagement;
  export let parentReplyTexarea: HTMLTextAreaElement | undefined = undefined;
  export let parentComment: Comment | undefined = undefined;
  let currentReplyTexarea: HTMLTextAreaElement;
  function initReplyTextarea(textarea: HTMLTextAreaElement) {
    currentReplyTexarea = textarea;
    currentReplyTexarea.focus();
  }
  onMount(() => {
    comicId ||= (parentComment ? parentComment.comicId : comment.comicId) ?? '0';
  });
  let editing = false;
  let newContent = '';

  async function saveEditComment() {
    comment.content = newContent;
    comment.comicId = comicId;
    let isOk = await commentManager
      .updateComment(comment as ComicComment)
      .then(() => true)
      .catch(() => {
        console.error('Failed to edit comment');
        return false;
      });
    if (!isOk) return;
    editing = false;
  }

  function cancelEditComment() {
    editing = false;
  }

  async function likeComment() {
    let isOk = await commentManager
      .reactComment(comicId, comment.id, { type: Reaction.Like })
      .then(() => true)
      .catch(() => {
        console.error('Failed to react to comment');
        return false;
      });
    if (!isOk) return;
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
    let isOk = await commentManager
      .reactComment(comicId, comment.id, { type: Reaction.Dislike })
      .then(() => true)
      .catch(() => {
        console.error('Failed to react to comment');
        return false;
      });
    if (!isOk) return;
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
    if (parentReplyTexarea) {
      parentReplyTexarea.focus();
      return;
    }

    replies = await commentManager
      .getComicCommentReplies(comicId, comment.id)
      .then((response) => response.results);
  }

  async function postReply() {
    if (!currentReplyTexarea.value) return;
    let newReply = await commentManager.replyComment(
      comicId,
      comment.id,
      currentReplyTexarea.value
    );
    newReply = await commentManager.getComment(comicId, newReply.id);
    replies = [newReply, ...replies];
    currentReplyTexarea.value = '';
    comment.totalReplies++;
    await tick();
  }

  let isDeleting = false;
  let isDeleted = false;
  let reportOpen = false;
</script>

{#if !isDeleted}
  <div class="w-full flex items-start gap-2">
    <div class="p-2 flex items-center justify-center">
      <a
        href="/profile/{comment.author.id}"
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
      </a>
    </div>
    <div class="flex flex-col w-full gap-4">
      <div
        class="flex flex-col w-full justify-between bg-base-100 border-2 border-neutral rounded-lg"
      >
        <div class="flex items-center justify-between gap-2 p-2">
          <div class="flex flex-col">
            <span class="flex gap-4 items-center">
              <a href="/profile/{comment.author.id}" class="font-bold">{comment.author.name}</a>
              <span class="flex gap-1 items-center">
                {#each comment.author.roles as role}
                  <span class="badge badge-sm badge-outline">{role}</span>
                {/each}
              </span>
            </span>
            <Time timestamp={comment.creationTime} relative class="text-sm italic" />
          </div>
          {#if currentUser}
            <div class="flex flex-col justify-start items-start">
              <details class="dropdown dropdown-end">
                <summary class="btn btn-sm btn-circle">
                  <Icon icon="lucide--ellipsis-vertical" class="text-xl" />
                </summary>
                <ul class="dropdown-content menu menu-sm bg-base-200 shadow rounded w-40">
                  {#if currentUser.id === comment.author.id}
                    <li>
                      <button
                        class="flex items-center gap-1"
                        on:click={() => ((editing = !editing), (newContent = comment.content))}
                      >
                        <Icon icon="lucide--edit" class="text-lg shrink-0" />
                        Edit
                      </button>
                    </li>
                  {/if}
                  {#if currentUser.id === comment.author.id || currentUser.roles.includes('Administrator')}
                    <li class="text-error">
                      <button
                        class="active:bg-error active:text-error-content hover:bg-error hover:text-error-content flex items-center gap-1"
                        on:click={() => (isDeleting = !isDeleting)}
                      >
                        <Icon icon="lucide--trash" class="text-lg shrink-0" />
                        Delete
                      </button>
                    </li>
                  {/if}
                  <li>
                    <button class="flex items-center gap-1" on:click={() => (reportOpen = true)}>
                      <Icon icon="lucide--flag" class="text-lg shrink-0" />
                      Report
                    </button>
                  </li>
                </ul>
              </details>
              <CommentDeleteModal
                target={comment}
                {commentManager}
                {comicId}
                bind:open={isDeleting}
                on:deleted={() => {
                  isDeleted = true;
                  isDeleting = false;
                  if (parentComment) parentComment.totalReplies--;
                }}
              />
              <CommentReport bind:target={comment} http={commentManager.http} bind:open={reportOpen}  />
            </div>
          {/if}
        </div>
        <hr class="border-1 mx-2" />
        <div class="p-2 flex flex-col gap-2">
          {#if editing}
            <textarea
              class="textarea textarea-bordered focus:textarea-accent w-full resize-none"
              rows="3"
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
              <button type="button" class="btn btn-sm btn-accent" on:click={saveEditComment}>
                Save
              </button>
              <button type="button" class="btn btn-sm hover:btn-error" on:click={cancelEditComment}>
                Cancel
              </button>
            </div>
          {:else}
            <div class="prose">
              {@html insane(marked(comment.content).toString())}
              <!-- {comment.content} -->
            </div>
          {/if}
        </div>
        <div class="flex justify-start p-2 gap-2">
          <div class="flex gap-2 items-center">
            <button
              type="button"
              class="btn btn-xs"
              class:btn-accent={comment.myReaction === Reaction.Like}
              on:click={likeComment}
            >
              <Icon icon="lucide--thumbs-up" class="text-lg" />
              <span>{comment.totalLikes}</span>
            </button>
            <button
              type="button"
              class="btn btn-xs"
              class:btn-accent={comment.myReaction === Reaction.Dislike}
              on:click={dislikeComment}
            >
              <Icon icon="lucide--thumbs-down" class="text-lg" />
              <span>{comment.totalDislikes}</span>
            </button>
          </div>
          <button
            type="button"
            class="btn btn-xs"
            class:btn-accent={showReplies}
            on:click={() =>
              parentReplyTexarea ? parentReplyTexarea.focus() : (showReplies = !showReplies)}
          >
            <Icon icon="lucide--reply" class="text-lg" />
            <span>Replies ({comment.totalReplies})</span>
          </button>
        </div>
      </div>
      {#if showReplies && !parentReplyTexarea}
        <div class="flex flex-col w-full gap-4">
          <div
            class="flex flex-col gap-2"
            in:slide|global={{ duration: 150 }}
            out:slide|global={{ duration: 150 }}
          >
            <!-- svelte-ignore a11y-autofocus -->
            <textarea
              class="textarea textarea-bordered focus:textarea-accent w-full resize-none"
              placeholder="Write a reply..."
              rows="3"
              use:initReplyTextarea
              on:keydown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  postReply();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  currentReplyTexarea.value = '';
                }
              }}
            ></textarea>
            <div class="flex justify-end gap-2">
              <button type="button" class="btn btn-sm btn-accent" on:click={postReply}>
                Reply
              </button>
            </div>
          </div>
          {#await loadReplies()}
            <div class="flex items-center gap-2" in:fade|global={{ duration: 150 }}>
              <span class="loading"></span>
              Loading replies...
            </div>
          {:then}
            <!-- do nothing -->
          {/await}
          <div
            class="flex flex-col w-full gap-4"
            in:slide|global={{ duration: 150 }}
            out:slide|global={{ duration: 150 }}
          >
            <!-- Load new replies -->
            <!-- <button class="btn btn-block active:btn-accent" on:click={() => loadReplies()}>
              <Icon icon="lucide--refresh-cw" class="text-lg" />
              Refresh
            </button> -->
            {#each replies as reply (reply.id)}
              <svelte:self
                {currentUser}
                {commentManager}
                comment={reply}
                parentReplyTexarea={parentReplyTexarea ?? currentReplyTexarea}
                bind:parentComment={comment}
              />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
