<script lang="ts">
  import Carousel from 'svelte-carousel';
  import LongStripMode from './long-strip-mode.svelte';
  import SinglePageMode from './single-page-mode.svelte';
  import { goto } from '$app/navigation';
  import Icon from '$components/icon.svelte';
  export let data;
  import http from '$utils/http'
  let { chapter, chapters, comic, comicId, number } = data;
  let active = false;
  import { onMount, tick } from 'svelte';
  interface CarouselData {
    goToPrev: () => void;
    goToNext: () => void;
    currentPageIndex: number;
  }
  let carousel: CarouselData = {
    goToNext: () => {},
    goToPrev: () => {},
    currentPageIndex: 0
  };

  let progressBar;

  function toggleSidebar() {
    active = !active;
  }
  let buttonText = 'Single Page';
  function toggleButtonState() {
    buttonText = buttonText === 'Single Page' ? 'Long Strip' : 'Single Page';
    if (buttonText === 'Single Page') {
      //startSplide();
    }
  }
  // Hàm xử lý sự kiện khi người dùng chọn ảnh
  const handleSelectChange = (event) => {};

  const goToPrevPage = () => {};

  const goToNextPage = () => {};

  const readingModes = {
    'Single Page': {
      component: SinglePageMode
    },
    'Long Strip': {
      component: LongStripMode
    }
  };
  let scrollY: number;
// comment
  let comments: Array<Comment & { editing: boolean; reacted?: boolean }> = [];
  let commentText = '';
  let replyContent = '';
  let commentModal: any;
  let contentErr = '';
  let errorMess = '';
  let error = '';
  let errorRep = '';

  // test comment Chapter
  async function getComments() {
    try {
      const response = await http.get(`/comics/${comicId}/chapters/${number}/comments`);
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

      const response = await http.post(`/comics/${comicId}/chapters/${number}/comments`, {
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
</script>

<svelte:window bind:scrollY />
<div class="h-16"></div>
<div class="flex justify-center h-screen relative">
  <button class="fixed top-15 right-0 btn btn-circle btn-ghost" on:click={toggleSidebar}>
    <span class="duration-150 iconify lucide--bar-chart text-2xl transform rotate-90 scale-flip"
    ></span>
  </button>
  <aside class:active class="pt-2 bg-base-200">
    <div class="flex justify-between pr-2">
      <button class="btn btn-circle btn-ghost" on:click={toggleSidebar}>
        {#if active}
          <span class="duration-150 iconify lucide--x text-2xl"></span>
        {/if}
      </button>
      <button class="btn btn-circle btn-ghost">
        <span class="duration-150 iconify lucide--flag text-2xl"></span>
      </button>
    </div>
    <div class="pl-4 pr-4">
      <div class="flex gap-5 mt-5">
        <span class="iconify lucide--book-open text-2xl self-center"></span>
        <a class="self-center" href={`/comics/${comic.id}`}>
          {comic.name}
        </a>
      </div>
      <div class="flex gap-5 mt-5">
        <span class="iconify lucide--file-image text-2xl self-center"></span>
        <p class="self-center">{chapter.name}</p>
      </div>

      <div class="flex gap-3 mt-5">
        <div class="flex w-8 h-14 bg-base-200 justify-center rounded-md btn btn-ghost">
          <button class="flex" on:click={goToPrevPage}>
            <span class="iconify lucide--chevron-left text-2xl self-center"></span>
          </button>
        </div>
        <div class="grow h-14 flex rounded-md">
          <select
            class="bg-base-200 select select-bordered h-full w-full max-w-xs select-page self-center"
            on:change={handleSelectChange}
          >
            {#each chapter.pages as image, index}
              <option class="bg-base-200" value={index}>Pg.{index + 1}</option>
            {/each}
          </select>
        </div>
        <div class="flex w-8 h-14 bg-base-200 justify-center rounded-md btn btn-ghost">
          <button class="flex" on:click={goToNextPage}>
            <span class="iconify lucide--chevron-right text-2xl self-center"></span>
          </button>
        </div>
      </div>
      <div class="flex gap-3 mt-3">
        <div class="w-8 h-14 bg-base-200 rounded-md btn btn-ghost">
          <button class="flex" on:click={goToPrevPage}>
            <span class="iconify lucide--chevron-left text-2xl self-center"></span>
          </button>
        </div>
        <div class="grow h-14 flex rounded-md">
          <select
            class="bg-base-200 select select-bordered h-full w-full max-w-xs select-page self-center"
            on:change={(event) => {
              if (event.target) goto(event.target.value);
            }}
          >
            {#each chapters as chapter, index}
              <option value="/comics/{chapter.comicId}/chapters/{chapter.number}"
                >Chapter {index + 1}</option
              >
            {/each}
          </select>
        </div>
        <div class="w-8 h-14 bg-base-200 rounded-md btn btn-ghost">
          <button class="flex" on:click={goToNextPage}>
            <span class="iconify lucide--chevron-right text-2xl self-center"></span>
          </button>
        </div>
      </div>
      <div class="flex gap-5 mt-5">
        <div><p class="font-bold my-auto text-lg">Reading Mode</p></div>
        <div>
          <button class="flex gap-3" on:click={toggleButtonState}>
            {#if buttonText == 'Single Page'}
              <span class="iconify lucide--file text-2xl"></span>
              <p class="text-sm font-bold self-center">{buttonText}</p>
            {:else}
              <span class="iconify lucide--gallery-vertical text-2xl"></span>
              <p class="text-sm font-bold self-center">{buttonText}</p>
            {/if}
          </button>
        </div>
      </div>
      <div class="flex gap-5 mt-5">
        <a
          href="/comics/{comic.id}/chapters/{chapter.number}/translations"
          class="btn btn-block btn-primary"
        >
          <Icon icon="lucide--languages" class="text-2xl" />
          Translate
        </a>
      </div>
    </div>
  </aside>
  <div class="h-screen">
    <svelte:component
      this={readingModes[buttonText].component}
      bind:pages={chapter.pages}
      bind:active
    />
  </div>
</div>

<style>
  aside {
    position: fixed;
    right: -300px;
    transition: all 0.15s;
    height: 100%;
    width: 300px;
  }
  .active {
    right: 0px;
  }
</style>
