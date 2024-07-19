<script lang="ts">
  import http from '$lib/http';
  // import moment from 'moment';
  import { onDestroy } from 'svelte';
  import DefaultAvatar from '$components/default-user-avatar.svelte' 
  import {page} from '$app/stores'

  export let data;
  let { key } = data;
  let commentId = $page.url.searchParams.get('commentId');
  
  let comic;
  let genreTags;
  let themeTags;
  let loading = true;
  let cover = 'https://i.yomikaze.org';
  let activeContent = commentId?'content2' : 'content1';
  let chapters = [];
  let comments = [];
  let newComment = '';
  let error = '';
  let currentPageChapter = 1;
  let currentPageComment = 1;
  const itemsPerPage = 4;

  (async () => {
    let response = await http.get(`/comics/${key}`);

    if (response.status == 404) {
      return;
    }
    comic = response.data;

    console.log(comic);
    genreTags = comic.tags.filter((tag) => tag.category === 'Genre');
    themeTags = comic.tags.filter((tag) => tag.category === 'Theme');
    setTimeout(() => (loading = false), 500);
  })();

  (async () => {
    let response = await http.get(`/comics/${key}/chapters`);

    if (response.status == 404) {
      return;
    }
    chapters = response.data;
  })();

  (async () => {
    let response = await http.get(`/comics/${key}/comments`);

    if (response.status == 404) {
      return;
    }
    comments = response.data.results;
  })();

  function showContent(content) {
    activeContent = content;
  }

  const formatDate = (dateString) => {
    // return moment(dateString).startOf('minutes').fromNow();
    return dateString;
  };

  async function addComment() {
    if (newComment.trim() === '') {
      error = 'Please enter a comment before posting.';
      return;
    }

    const response = await http.post(`/comics/${key}/comments`, {
      content: newComment
    });

    if (response.status === 200) {
      comments.push(response.data);
      console.log('Comment successfully!');
      newComment = '';
      error = '';
    }
  }

  async function deleteComment(commentId) {
    try {
      const response = await http.delete(`/comics/${key}/comments/${commentId}`);
      if (response.status === 200) {
        comments = comments.filter((comment) => comment.id !== commentId);
        console.log('Comment deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addComment();
    }
  }

  $: if (newComment.trim() !== '') {
    error = '';
  }

  function setPage(listType, page) {
    if (listType === 'chapter') {
      currentPageChapter = page;
    } else if (listType === 'comment') {
      currentPageComment = page;
    }
  }

  function paginatedData(data, currentPage) {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }
</script>

<div class="comic-detail mt-20">
  {#if loading}
    <!-- <p>Loading comic details...</p> -->
    <div class="flex w-52 flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="skeleton h-16 w-16 shrink-0 rounded-full"></div>
        <div class="flex flex-col gap-4">
          <div class="skeleton h-4 w-20"></div>
          <div class="skeleton h-4 w-28"></div>
        </div>
      </div>
      <div class="skeleton h-32 w-full"></div>
    </div>
  {:else}
    <div class=" w-full h-96 border-2 brightness-50">
      <picture>
        <source class="w-full h-full object-cover" srcset={cover + comic.banner} />
        <source class="w-full h-full object-cover" srcset={cover + comic.cover} />
        <img class="w-full h-full object-cover" src="/images/default.webp" alt="" />
      </picture>
    </div>
    <div class=" relative bottom-56 left-10">
      <picture class="w-52 h-72 float-left">
        <source srcset={cover + comic.cover} />
        <img src="/images/default.webp" alt="" />
      </picture>

      <div class="flex-grow flex flex-col justify-evenly">
        <h1
          class="leading-tight break-words text-shadow font-bold text-base-100 text-4xl w-full ml-3 h-20"
        >
          {comic.name}
        </h1>
      </div>
      <div class="flex flex-col gap-20">
        <span
          class="font-normal text-base-100 line-clamp-2 text-base sm:text-xl inline-block leading-5 ml-3 mt-3 h-7"
          >{comic.aliases}</span
        >

        <span class="font-medium text-lg text-base-100 sm:text-base sm:truncate flex-shrink-0 ml-3"
          >{comic.authors.join(', ')}</span
        >
      </div>

      <div class="flex flex-col gap-3">
        <!--! Action for Comic Detail -->
        <div class="flex mt-4">
          <button class="btn btn-warning ml-3"><p class="text-base px-10">Add To Library</p></button
          >
          <button class="btn border-0 ml-3"
            ><p class="text-base">Start Reading</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
              ><path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
              /></svg
            ></button
          >
          <button class="btn border-0 ml-3"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
              ><path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 15s1-1 4-1s5 2 8 2s4-1 4-1V3s-1 1-4 1s-5-2-8-2s-4 1-4 1zm0 7v-7"
              /></svg
            >
            <p class="text-base">Report</p>
          </button>

          <!--! dropdown button manage -->
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"
                ><g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  ><path d="M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16" /><path
                    d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0-12v2m0 18v-2m5 .66l-1-1.73m-5-8.66L7 3.34M20.66 17l-1.73-1M3.34 7l1.73 1M14 12h8M2 12h2m16.66-5l-1.73 1M3.34 17l1.73-1M17 3.34l-1 1.73m-5 8.66l-4 6.93"
                  /></g
                ></svg
              >
              <p class="text-base">Manage</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"
                ><path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m6 9l6 6l6-6"
                /></svg
              >
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a class="text-base">Edit Comic</a></li>
              <li><a class="text-base">Delete Comic</a></li>
            </ul>
          </div>
        </div>

        <div class="flex">
          {#each genreTags as tag}
            <div class="badge badge-secondary ml-3 font-semibold">{tag.name}</div>
          {/each}
          <div class="flex gap-1 ml-3">
            <svg
              data-v-9ba4cb7e=""
              data-v-6ebb56e1=""
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 6.35 6.35"
              class="icon"
              style="color: rgb(0,255,0);"
              ><path
                fill="currentColor"
                d="M4.233 3.175a1.06 1.06 0 0 1-1.058 1.058 1.06 1.06 0 0 1-1.058-1.058 1.06 1.06 0 0 1 1.058-1.058 1.06 1.06 0 0 1 1.058 1.058"
              ></path></svg
            >
            <span class="text-base font-bold"
              >PUBLICATION: {new Date(comic.publicationDate).toLocaleDateString()}</span
            >
          </div>
        </div>

        <div class="flex">
          <div class="flex gap-1 ml-3 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
              ><path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 21l-7-4l-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
              /></svg
            >
            <span>{comic.totalFollows}</span>
          </div>
          <div class="flex gap-1 ml-3 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
              ><g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                ><path d="M2 12s3-7 10-7s10 7 10 7s-3 7-10 7s-10-7-10-7" /><circle
                  cx="12"
                  cy="12"
                  r="3"
                /></g
              ></svg
            >
            <span>{comic.totalViews}</span>
          </div>
          <div class="flex ml-3 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
              ><path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              /></svg
            >
            <span class="ml-1">{comic.totalComments}</span>
          </div>
        </div>
      </div>

      <div class="mt-12 whitespace-pre-wrap">
        <p class="max-h-48 min-h-24 overflow-x-auto">
          {comic.description}
        </p>
      </div>
      <!-- <div class="flex mt-3">
        <button
          on:click={() => showContent('content1')}
          class="rounded-l-lg px-3 py-3 bg-base-300  text-lg font-medium"
          >Chapters</button
        >
        <button
          on:click={() => showContent('content2')}
          class="rounded-r-lg px-3 py-3 bg-base-300 focus:bg-accent-content focus:text-base-100 text-lg font-medium"
          >Comment</button
        >
      </div> -->
      <div role="tablist" class="tabs tabs-boxed w-fit">
        <a
          on:click={() => showContent('content1')}
          class="tab"
          class:tab-active={activeContent === 'content1'}
          >Chapters</a
        >
        <a
          on:click={() => showContent('content2')}
          class="tab"
          class:tab-active={activeContent === 'content2'}
          >Comment</a
        >


      </div>

      <div class="grid grid-cols-3 mt-5">
        <div class="flex flex-col w-96">
          <div class="">
            <div class="text-xl font-bold">Authors</div>

            <div class="grid grid-cols-3 gap-2 mt-2">
              {#each comic.authors as author}
                <span class="rounded bg-accent text-center p-1 font-medium">{author}</span>
              {/each}
            </div>
          </div>

          <div class="mt-4">
            <div class="text-xl font-bold">Genres</div>
            <div class="grid grid-cols-4 gap-2 mt-2">
              {#each genreTags as tag}
                <span class="rounded bg-base-300 text-center p-1 font-medium">{tag.name}</span>
              {/each}
            </div>
          </div>

          <div class="mt-4">
            <div class="text-xl font-bold">Themes</div>
            <div class="grid grid-cols-4 gap-2 mt-2">
              {#each themeTags as tag}
                <span class="rounded bg-base-300 text-center p-1 font-medium">{tag.name}</span>
              {/each}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3 lg:col-span-2 sm:col-span-1">
          <div class="content flex {activeContent === 'content1' ? 'active' : ''}">
            <div class="flex justify-end">
              <p class="text-xl font-semibold">Total: {comic.totalChapters}</p>
            </div>

            <div class="flex flex-col gap-2.5 max-h-80">
              {#each paginatedData(chapters, currentPageChapter) as chapter}
                <a
                  href=""
                  class="flex justify-between bg-base-200 p-2 px-3 w-100 hover:bg-neutral-content hover:text-base-100"
                  ><div class="flex gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 24 24"
                      ><g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        ><path d="M2 12s3-7 10-7s10 7 10 7s-3 7-10 7s-10-7-10-7" /><circle
                          cx="12"
                          cy="12"
                          r="3"
                        /></g
                      ></svg
                    >
                    Chapter {chapter.number}
                  </div>
                  <div class="flex flex-col gap-2">
                    <div class="flex gap-9">
                      <div class="flex gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                          ><g
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            ><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></g
                          ></svg
                        ><span>{formatDate(chapter.creationTime)}</span>
                      </div>

                      <!--! show view chapter -->
                      <div class="flex gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                          ><g
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            ><path d="M2 12s3-7 10-7s10 7 10 7s-3 7-10 7s-10-7-10-7" /><circle
                              cx="12"
                              cy="12"
                              r="3"
                            /></g
                          ></svg
                        > <span>{chapter.views}</span>
                      </div>
                    </div>

                    <!--! show name publisher -->
                    <div class="flex gap-9">
                      <div class="flex gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                          ><g
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            ><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle
                              cx="12"
                              cy="7"
                              r="4"
                            /></g
                          ></svg
                        ><span>Your pinga</span>
                      </div>

                      <!--! show amount comment -->
                      <div class="flex gap-3">
                        <svg
                          class="ml-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                          ><path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                          /></svg
                        ><span>{chapter.totalComments}</span>
                      </div>
                    </div>
                  </div>
                </a>
              {/each}

              <div class="mt-4 flex justify-center">
                {#each Array(Math.ceil(chapters.length / itemsPerPage)).fill(0) as _, i}
                  <button
                    class="btn btn-sm mx-1 {i + 1 === currentPageChapter ? 'btn-active' : ''}"
                    on:click={() => setPage('chapter', i + 1)}
                  >
                    {i + 1}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <div class={activeContent === 'content2' ? 'block' : 'hidden'}>
            {#if comments.length > 0}
              <ul >
                {#each paginatedData(comments, currentPageComment) as comment}
                  <li class="mb-3 w-75">
                    <div class="flex flex-col border-2 rounded-lg border-accent-content p-4">
                      <div class="flex justify-between border-b-2 border-base-200 pb-2">
                        <div class="flex gap-4 items-center">
                          <div class="avatar">
                            <div class="w-8 ring-2 ring-offset-2 ring-neutral rounded-full">
                            <DefaultAvatar></DefaultAvatar>
                            </div>
                          </div>
                          <div class=" leading-none font-medium">{comment.author.name}</div>
                        </div>
                        <div class="my-auto">
                          {formatDate(comment.creationTime)}
                          <div class="dropdown dropdown-end">
                            <button tabindex="0" class="btn btn-sm btn-base-200">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.25em"
                                height="1.25em"
                                viewBox="0 0 24 24"
                                ><g
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  ><circle cx="12" cy="12" r="1" /><circle
                                    cx="19"
                                    cy="12"
                                    r="1"
                                  /><circle cx="5" cy="12" r="1" /></g
                                ></svg
                              >
                            </button>
                            <ul
                              tabindex="0"
                              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                              <li>
                                <button on:click={() => deleteComment(comment.id)}>Delete</button>
                              </li>
                              <li><button>Edit</button></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="mt-1 break-words">
                        <span class="text-balance">{comment.content}</span>
                      </div>
                      <div class="flex">
                        <!--! action comment here -->
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>

              <div class="mt-4 flex justify-center">
                {#each Array(Math.ceil(comments.length / itemsPerPage)).fill(0) as _, i}
                  <button
                    class="btn btn-sm mx-1 {i + 1 === currentPageComment ? 'btn-active' : ''}"
                    on:click={() => setPage('comment', i + 1)}
                  >
                    {i + 1}
                  </button>
                {/each}
              </div>
            {:else}
              <p>No comments available.</p>
            {/if}
            <!--! comment here -->
            <div class="flex flex-col justify-center gap-3 mt-3">
              <div class="text-xl font-bold">Comments</div>
              <div class="flex flex-col gap-3">
                <form on:submit|preventDefault={addComment} class="mt-2">
                  <div class="flex flex-col">
                    <textarea
                      class="comment-box textarea textarea-bordered rounded-2xl focus:border-accent-content focus:border-2 h-28 w-75"
                      bind:value={newComment}
                      placeholder="Write your comment here..."
                      on:keypress={handleKeyPress}
                    ></textarea>
                    {#if error}
                      <p class="text-error font-semibold mt-2">{error}</p>
                    {/if}
                  </div>

                  <div class="flex justify-end mt-3">
                    <button
                      type="submit"
                      class=" flex gap-2 bg-base-300 font-semibold rounded-md px-4 py-2 w-fit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                        ><path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m22 2l-7 20l-4-9l-9-4Zm0 0L11 13"
                        /></svg
                      > <span class="font-bold">Post</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .content {
    display: none;
  }
  .content.active {
    display: block;
  }
</style>
