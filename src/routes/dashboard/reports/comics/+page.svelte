<script lang="ts">
  import http from '$lib/utils/http';
  import { onMount, tick } from 'svelte';
  import type ComicReport from '$models/ComicReport';

  import type Comment from '$models/Comment';
  import type { AxiosError } from 'axios';
  import type Problem from '$models/ProblemResponse.js';
  import DefaultAvatar from '$components/default-user-avatar.svelte';

  let comicReports: Array<ComicReport> = [];
  let cover = 'https://i.yomikaze.org';
  let comicToDelete = null;
  let deleteModal: any;
  let comicName = '';
  let comicCover = '';
  let comicId = '';
  let reportToDelete: any = null;
  let reportDetails: ComicReport | null = null;

  let comments: Array<Comment  & { editing: boolean }> = [];
  let commentText = '';
  const comicChapterId = '68638295025815553';
  const number = '1';
  let commentModal: any;
  let contentErr = '';
  let errorMess = '';
  let error = '';

  // test comment Chapter
  async function getComments() {
    try {
      const response = await http.get(`/comics/${comicChapterId}/chapters/${number}/comments`);
      comments = response.data.results;
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  async function postComment() {
    error = '';
    try {
      if (commentText.trim() === '') {
        error = 'Please enter a comment before posting.';
        return;
      }
      const response = await http.post(`/comics/${comicChapterId}/chapters/${number}/comments`, {
        content: commentText
      });
      comments = [response.data, ...comments];
      commentText = '';

      await tick();
    } catch (error) {
      const axiosError = error as AxiosError;
      const { response } = axiosError;
      if (response && response.status === 400) {
        let data = response.data as Problem;
        for (let key of Object.keys(data.errors)) {
          switch (key) {
            case 'Content':
              contentErr = data.errors[key].at(0) ?? '';
              break;
            default:
              errorMess = 'An unknown error occurred';
              break;
          }
        }
      } else {
        errorMess = 'An unknown error occurred';
      }
    }
  }

  async function deleteComment(commentId: string | bigint) {
    try {
      await http.delete(`/comics/${comicChapterId}/chapters/${number}/comments/${commentId}`);
      comments = comments.filter(comment => comment.id !== commentId);
      console.log('Delete success');
    } catch (error) {
      const axiosError = error as AxiosError;
      const { response } = axiosError;
      if (response) {
        console.error('API error:', response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  async function editComment(commentId: string, newContent: string) {
    try {
      const patchData = [
        {
          "op": "replace",
          "path": "/content",
          "value": newContent
        }
      ];
      const response = await http.patch(`/comics/${comicChapterId}/chapters/${number}/comments/${commentId}`, patchData);
      comments = comments.map(comment => comment.id === commentId ? { ...response.data, editing: false } : comment);
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  }

  function toggleEditComment(comment) {
    comment.editing = !comment.editing;
  }

  function openCommentModal() {
    getComments();
    // postComment();
    commentModal.showModal();
  }

  async function getComicReports() {
    try {
      const response = await http.get('/reports/comics');
      comicReports = response.data.results;
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  async function getComicReportDetails(key: string) {
    try {
      const response = await http.get(`/reports/comics/${key}`);
      reportDetails = response.data;
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  const deleteReport = async (key: string) => {
    try {
      await http.delete(`/reports/comics/${key}`);
      comicReports = comicReports.filter((report) => report.id !== key);
      console.log('Delete success');
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      reportToDelete = null;
      comicName = '';
      comicId = '';
      comicCover = '';
      reportDetails = null;
      deleteModal.close();
    }
  };

  async function openDeleteModal(report: any) {
    reportToDelete = report;
    comicName = report.comic.name;
    comicCover = cover + report.comic.cover;
    comicId = report.comic.id;
    await getComicReportDetails(report.id);
    deleteModal.showModal();
  }

  async function updateReportStatus(key: string | bigint, newStatus: string) {
    const patchData = [
      {
        value: newStatus,
        path: '/status',
        op: 'replace'
      }
    ];

    try {
      console.log(`Sending PATCH request to /reports/comics/${key} with payload:`, patchData);
      const response = await http.patch(`/reports/comics/${key}`, patchData);
      console.log('Status updated successfully:', response.data);
      // Update the local comicReports array
      const updatedReport = response.data;
      comicReports = comicReports.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      );
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  onMount(() => {
    getComicReports();
    getComments();
  });
</script>

<div class="container mx-auto mt-20">
  <div class="mt-6">
    <!-- TODO test comment chapter -->
    <div class="mt-6">
      <button class="btn btn-primary mt-2" on:click={openCommentModal}>View Comments</button>
    </div>
    <!-- TODO test comment chapter -->

    <table class="table lg:table-lg sm:table-sm xs:table-xs md:table-md">
      <thead>
        <tr class="text-base font-medium">
          <th>Detail</th>
          <th> Time </th>
          <th>Reporter</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#if comicReports.length > 0}
          {#each comicReports as report (report.id)}
            <tr>
              <td
                ><div class="flex gap-2">
                  <div class=" w-28 h-36">
                    <picture class="w-24 h-32"
                      ><source srcset={cover + report.comic.cover} />
                      <img class="float-left" src="https://placehold.co/84x120" alt="" />
                    </picture>
                  </div>

                  <div class="flex flex-col justify-between">
                    <div>
                      <span class="font-bold text-ellipsis line-clamp-2 p-1">
                        {report.comic.name}
                      </span>
                      <span class="text-sm text-ellipsis line-clamp-1">
                        {report.comic.aliases}
                      </span>
                    </div>

                    <span class="text-ellipsis line-clamp-1 italic">{report.comic.authors}</span>
                  </div>
                </div>
              </td>
              <td class="min-w-16 max-w-26">{report.creationTime}</td>
              <!-- <td><Time timestamp={report.creationTime} relative/></td> -->
              <td> {report.reporter.name}</td>
              <td>{report.description}</td>
              <td>
                <select
                  class="select select-bordered font-semibold"
                  on:change={(e) => updateReportStatus(report.id, e.target.value)}
                >
                  <option selected disabled>{report.status}</option>
                  <option value="Pending" class="text-warning font-semibold">Pending</option>
                  <option value="Resolved" class="text-success font-semibold">Resolved</option>
                  <option value="Dismissed" class="text-error font-semibold">Dismissed</option>
                </select></td
              >
              <td>
                <button class="btn btn-sm" on:click={() => openDeleteModal(report)}>
                  <span>Delete Comic</span>
                </button>
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="5" class="text-center text-base-300 italic font-semibold">
              <span>No Report Comic.</span></td
            >
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>

<!--! modal delete Comic -->
<dialog id="delete_modal" class="modal" bind:this={deleteModal}>
  <div class="modal-box">
    <h3 class="text-xl font-bold">Are you sure you want to delete this comic?</h3>
    <div class="flex gap-2 pt-3">
      <picture class="w-24 h-32 float-left"
        ><source class="w-24 h-32" srcset={comicCover} />
        <img class="float-left" src="https://placehold.co/84x120" alt="" />
      </picture>
      <div>
        <p>Comic: <strong>{comicName}</strong></p>
        {#if reportDetails}
          <p>Reporter: {reportDetails.reporter.name}</p>
          <p>Reason: {reportDetails.description}</p>
        {/if}
      </div>
    </div>

    <div class="modal-action">
      <button
        class="btn btn-error btn-sm"
        on:click={() => {
          deleteReport(reportToDelete.id);
        }}>Confirm</button
      >
      <form method="dialog">
        <button class="btn btn-sm">Cancel</button>
      </form>
    </div>
  </div>
</dialog>

<!-- ToDo Modal Comment Chapter -->
<dialog id="comment_modal" class="modal" bind:this={commentModal}>
  <div class="modal-box">
    <!-- <div class="flex justify-between"> -->
    <h3 class="text-xl font-bold">Comments for Chapter {number}</h3>
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl">✕</button>
    </form>
    <!-- </div> -->

    <div class="mt-6">
      {#if comments.length > 0}
        <ul class="max-h-96 overflow-x-auto">
          {#each comments as comment (comment.id)}
            <li class="border-b border-gray-200 py-2">
              <div class="flex flex-col border-2 rounded-lg border-accent-content p-4">
                <div class="flex justify-between border-b-2 border-base-200 pb-2">
                  <div class="flex gap-4 items-center">
                    <div class="avatar">
                      <div class="w-8 ring-2 ring-offset-2 ring-neutral rounded-full">
                        <DefaultAvatar></DefaultAvatar>
                      </div>
                    </div>
                    <p class=" leading-none font-medium">{comment.author.name}</p>
                  </div>

                  
                  <div class="my-auto flex items-center gap-2">
                    <p class="text-xs text-gray-500 text-center">{new Date(comment.creationTime).toLocaleString()}</p>
                    <details class="dropdown dropdown-end">
                      <summary class="btn btn-sm btn-square"><span class="iconify lucide--ellipsis-vertical text-xl"></span></summary>
                      <ul
                        class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <li><button on:click={() => deleteComment(comment.id)} >Delete</button></li>
                        <li><button>Edit</button></li>
                      </ul>
                    </details>
                  </div>
                </div>

                <!-- {#if comment.editing}
                <textarea
                  class="textarea textarea-bordered w-full"
                  bind:value={comment.content}
                ></textarea>
                <button class="btn btn-primary btn-sm mt-2" on:click={() => updateComment(comment.id, comment.content)}>
                  Save
                </button>
                <button class="btn btn-sm mt-2" on:click={() => (comment.editing = false)}>
                  Cancel
                </button>
              {:else}
                <p>{comment.content}</p>
                <div class="dropdown">
                  <button class="btn btn-sm">Options</button>
                  <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <a on:click={() => enableEditMode(comment.id)}>Edit</a>
                    </li>
                    <li>
                      <a on:click={() => deleteComment(comment.id)}>Delete</a>
                    </li>
                  </ul>
                </div>
              {/if} -->

                <div class="mt-1 break-words"><p>{comment.content}</p></div>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-500 italic">No comments yet.</p>
      {/if}
    </div>

    <!-- TODO Post Comment Chapter -->
    <div class="mt-4">
      <textarea
        class="textarea textarea-bordered w-full"
        placeholder="Add a comment..."
        bind:value={commentText}
        on:input={() => {
          error = '';
          contentErr = '';
          errorMess = '';
        }}
      ></textarea>
      {#if !!contentErr}
        <div class="label">
          <span class="label-text text-error font-semibold">{contentErr}</span>
        </div>
      {:else if !!errorMess}
        <div class="label">
          <span class="label-text text-error font-semibold">{errorMess}</span>
        </div>
      {:else if error}
        <div class="label">
          <span class="label-text text-error font-semibold">{error}</span>
        </div>
      {/if}

      <div class="flex justify-end">
        <button class="btn btn-primary btn-sm mt-2" on:click={postComment}
          ><span class="iconify lucide--send text-xl"></span> Post
        </button>
      </div>
    </div>
    <!-- TODO Post Comment Chapter -->
  </div>
</dialog>
