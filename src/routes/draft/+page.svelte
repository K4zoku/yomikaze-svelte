<script lang="ts">
  import { goto } from '$app/navigation';
  import CommentComponent from '$components/yomikaze/comment/comment.svelte';
  import type AuthDataStore from '$models/AuthDataStore';
  import type Comment from '$models/Comment';
  import type Profile from '$models/Profile';
  import { ComicCommentManagement } from '$utils/comment-utils';
  import { getContext } from 'svelte';

  let auth = getContext<AuthDataStore>('auth');
  let { user, token } = auth;
  let commentManager: ComicCommentManagement;
  if (!$token) throw new Error('Token not found');
  if (!$user) throw new Error('User not found');

  commentManager = new ComicCommentManagement($token);
  let comment: Promise<Comment> = commentManager
    .getComment('68638295025815553', '75830146090663936');
</script>
<div class="container pt-16">
    {#await comment then comment}
      <CommentComponent currentUser={$user} {comment} {commentManager}/>
    {/await}
</div>
