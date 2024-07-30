<script lang="ts">
  import http from '$lib/utils/http';
  import { onMount, tick } from 'svelte';
  import type ComicReport from '$models/ComicReport';

  import type Comment from '$models/Comment';
  import type { AxiosError } from 'axios';
  import type Problem from '$models/ProblemResponse.js';
  import DefaultAvatar from '$components/default-user-avatar.svelte';
  import Time from 'svelte-time/Time.svelte';

  export let data;
  let { token } = data;
  http.defaults.headers.common.Authorization = 'Bearer ' + token;

  let comicReports: Array<ComicReport> = [];
  let cover = 'https://i.yomikaze.org';
  let deleteModal: any;
  let comicName = '';
  let comicCover = '';
  let comicId = '';
  let reportToDelete: any = null;
  let reportDetails: ComicReport | null = null;

  let comments: Array<Comment & { editing: boolean; reacted?: boolean }> = [];
  let commentText = '';
  let replyContent = '';
  const comicChapterId = '68638295025815553';
  const number = '1';
  let commentModal: any;
  let contentErr = '';
  let errorMess = '';
  let error = '';
  let errorRep = '';

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

  async function postReply(commentId: string) {
    try {
      if (replyContent.trim() === '') {
        errorRep = 'Please enter a reply before posting.';
        return;
      }

      await http.post(
        `/comics/${comicChapterId}/chapters/${number}/comments/${commentId}/replies`,
        { content: replyContent }
      );
      
      // Cập nhật danh sách bình luận
      comments = comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, replyContent: '', showReplySection: false }; // Xóa nội dung đã gửi và đóng phần phản hồi
        }
        return comment;
      });

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

  async function getReplies(commentId: string) {
    try {
      const response = await http.get(
        `/comics/${comicChapterId}/chapters/${number}/comments/${commentId}/replies`
      );
      const replies = response.data.results;

      // Cập nhật danh sách bình luận với phản hồi
      comments = comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, replies }; // Thêm phản hồi vào bình luận
        }
        return comment;
      });
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  }

  // Hàm để toggle phần phản hồi
  function toggleReplySection(commentId: string) {
    // Gọi getReplies nếu phần phản hồi chưa được mở và chưa có dữ liệu phản hồi
    const comment = comments.find((c) => c.id === commentId);
    if (comment && !comment.showReplySection) {
      getReplies(commentId);
    }

    comments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, showReplySection: !comment.showReplySection }; // Chuyển đổi trạng thái hiển thị phần phản hồi
      }
      return comment;
    });
  }

  async function deleteComment(commentId: string | bigint) {
    try {
      await http.delete(`/comics/${comicChapterId}/chapters/${number}/comments/${commentId}`);
      comments = comments.filter((comment) => comment.id !== commentId);
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
          op: 'replace',
          path: '/content',
          value: newContent
        }
      ];
      const response = await http.patch(
        `/comics/${comicChapterId}/chapters/${number}/comments/${commentId}`,
        patchData
      );
      comments = comments.map((comment) =>
        comment.id === commentId ? { ...response.data, editing: false } : comment
      );
      await tick();
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  }

  async function reactComment(commentId: string, reactionType: string) {
    try {
      // Gửi yêu cầu đến API để thêm hoặc gỡ bỏ phản ứng
      const response = await http.post(
        `/comics/${comicChapterId}/chapters/${number}/comments/${commentId}/react`,
        { type: reactionType }
      );

      // Lấy thông tin phản hồi từ API
      const { isReacted, myReaction } = response.data;

      // Cập nhật danh sách comments
      comments = comments.map((comment) => {
        if (comment.id === commentId) {
          // Tính toán số lượng phản ứng mới
          let newTotalLikes = comment.totalLikes;
          if (isReacted) {
            // Nếu phản ứng đã được thêm, cộng thêm
            if (!comment.reacted) {
              newTotalLikes += 1;
            }
          } else {
            // Nếu phản ứng bị gỡ bỏ, trừ đi
            if (comment.reacted) {
              newTotalLikes -= 1;
            }
          }

          return {
            ...comment,
            myReaction,
            reacted: isReacted,
            totalLikes: newTotalLikes
          };
        }
        return comment;
      });

      // Đảm bảo giao diện cập nhật sau khi thay đổi dữ liệu
      await tick();
    } catch (error) {
      console.error('Failed to react to comment:', error);
    }
  }

  function toggleEditComment(comment: any) {
    comment.editing = !comment.editing;
    comments = [...comments];
  }

  function openCommentModal() {
    getComments();
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

<div class="container mt-16">
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

              <td><Time timestamp={report.creationTime} relative /></td>
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
                <button class="btn btn-sm btn-error" on:click={() => openDeleteModal(report)}>
                  <span>Delete Comic</span>
                </button>
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="5" class="text-center text-base-300 italic font-bold">
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
  <div class="modal-box w-11/12 max-w-5xl">
    <h3 class="text-xl font-bold">Comments for Chapter {number}</h3>
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl">✕</button>
    </form>

    <div class="mt-6">
      {#if comments.length > 0}
        <ul class="max-h-96 overflow-x-auto">
          {#each comments as comment (comment.id)}
            <li class=" py-2">
              <div class="flex flex-col border-2 rounded-lg border p-4">
                <div class="flex justify-between border-b pb-2">
                  <div class="flex gap-4 items-center">
                    <div class="avatar">
                      <div class="w-8 ring-2 ring-offset-2 ring-neutral rounded-full">
                        <DefaultAvatar></DefaultAvatar>
                      </div>
                    </div>
                    <p class=" leading-none font-medium">{comment.author.name}</p>
                  </div>

                  <div class="my-auto flex items-center gap-2">
                    <p class="text-xs text-gray-500 text-center">
                      <Time timestamp={comment.creationTime} relative />
                    </p>
                    <details class="dropdown dropdown-end">
                      <summary class="btn btn-sm btn-square"
                        ><span class="iconify lucide--ellipsis-vertical text-xl"></span></summary
                      >
                      <ul
                        class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        <li><button on:click={() => deleteComment(comment.id)}>Delete</button></li>
                        <li><button on:click={() => toggleEditComment(comment)}>Edit</button></li>
                      </ul>
                    </details>
                  </div>
                </div>

                {#if comment.editing}
                  <textarea bind:value={comment.content} class="textarea textarea-bordered w-full"
                  ></textarea>
                  <div class="flex items-center gap-2 mt-2 justify-end">
                    <button
                      class="btn btn-sm btn-success flex items-center gap-1"
                      on:click={() => editComment(comment.id, comment.content)}
                      ><span class="iconify lucide--send text-xl"></span> Save</button
                    >
                    <button class="btn btn-sm" on:click={() => toggleEditComment(comment)}
                      >Cancel</button
                    >
                  </div>
                {:else}
                  <div class="my-2">
                    <p class="mt-1">{comment.content}</p>
                  </div>

                  <div class="flex gap-2 mt-2">
                    <button
                      class="btn btn-sm btn-square flex"
                      on:click={() => reactComment(comment.id, 'Like')}
                    >
                      <div class="flex gap-1">
                        <p
                          class="iconify {comment.reacted
                            ? 'fluent--thumb-like-20-filled'
                            : 'fluent--thumb-like-16-regular'} text-xl"
                        ></p>
                        <p class="flex items-center">{comment.totalLikes}</p>
                      </div>
                    </button>

                    <button class="btn btn-sm" on:click={() => toggleReplySection(comment.id)}>
                      {#if comment.showReplySection}
                        Hide Replies
                      {/if}
                      {#if !comment.showReplySection}
                        Show Replies
                      {/if}
                    </button>
                  </div>

                  <div class="mt-4"></div>
                {/if}

                {#if comment.showReplySection}
                  <!-- Danh sách phản hồi -->
                  {#if comment.replies && comment.replies.length > 0}
                    <ul class="ml-4 mt-2">
                      {#each comment.replies as reply (reply.id)}
                        <li class="py-4 border-b">
                          <div class="flex flex-col border-2 rounded-lg border p-2">
                            <div class="flex justify-between border-b pb-2">
                              <div class="flex gap-4 items-center">
                                <div class="avatar">
                                  <div class="w-6 ring-2 ring-offset-2 ring-neutral rounded-full">
                                    <DefaultAvatar></DefaultAvatar>
                                  </div>
                                </div>
                                <p class=" leading-none font-medium text-sm">
                                  {comment.author.name}
                                </p>
                              </div>

                              <div class="my-auto flex items-center gap-2">
                                <p class="text-xs text-gray-500 text-center">
                                  <Time timestamp={comment.creationTime} relative />
                                </p>
                              </div>
                            </div>
                            <div class="my-2">
                              <p>{reply.content}</p>
                            </div>
                          </div>
                        </li>
                      {/each}
                    </ul>
                  {:else}
                    <p class="text-base italic text-center">No Replies yet.</p>
                  {/if}

                  <!-- Form phản hồi -->
                  <div class="mt-4">
                    <textarea
                      bind:value={replyContent}
                      placeholder="Write a reply..."
                      class="textarea textarea-bordered w-full"
                    ></textarea>
                    {#if !!contentErr}
                      <div class="label">
                        <span class="label-text text-error font-semibold">{contentErr}</span>
                      </div>
                    {:else if !!errorMess}
                      <div class="label">
                        <span class="label-text text-error font-semibold">{errorMess}</span>
                      </div>
                    {:else if errorRep}
                      <div class="label">
                        <span class="label-text text-error font-semibold">{errorRep}</span>
                      </div>
                    {/if}
                    <div class="flex justify-end">
                      <button
                        class="btn btn-sm btn-primary mt-2"
                        on:click={() => postReply(comment.id)}
                      >
                        <span class="iconify lucide--send text-xl"></span> Post
                      </button>
                    </div>
                  </div>
                {/if}
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
