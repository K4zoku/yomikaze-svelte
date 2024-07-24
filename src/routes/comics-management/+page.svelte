<script lang="ts">
  import http from '$lib/utils/http';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let cover = 'https://i.yomikaze.org';
  // let comics = [
  // 	{
  // 		cover: '../banner.jpg',
  // 		title: 'One Piece',
  // 		authors: ['Kishimoto Masashi', 'Oda'],
  // 		genres: ['Action', 'Adventure'],
  // 		rating: '16',
  // 		bookmark: '22',
  // 		comment: '46',
  // 		description: 'Description of Story 1'
  // 	},
  // 	{
  // 		// cover: 'link_to_cover_image_2',
  // 		title: 'Kimetsu no Yaiba',
  // 		authors: ['Kishimoto Masashi'],
  // 		genres: ['ACtion', 'Medical', 'Drama'],
  // 		rating: '16',
  // 		bookmark: '22',
  // 		comment: '46',
  // 		description: 'Description of Story 2'
  // 	}
  // ];
  let comics = [];
  let totals = 0;

 

  const getComics = async () => {
    try {
      const response = await http.get('/management');
      if (response.status === 200) {
        console.log('Comics retrieved successfully:', response.data.results);
        return {
          results: response.data.results,
          totals: response.data.totals
        };
      } else {
        console.error('Unexpected response status:', response.status);
        return {
          results: [],
          totals: 0
        };
      }
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      return {
        results: [],
        totals: 0
      };
    }
  };

  const deleteComic = async (key) => {
    try {
      const response = await http.delete(`/comics/${key}`);
      if (response.status === 200) {
        comics = comics.filter(comic => comic.id !== key);
        
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error('API error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const fetchComics = async () => {
    const data = await getComics();
    comics = data.results;
    totals = data.totals;
  };

  onMount(() => {
    fetchComics();
  });

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/'); // Điều hướng về trang chủ nếu không có lịch sử
    }
  }
</script>

<div class="container mx-auto mt-16">
  <div class="flex my-3 gap-2">
    <button on:click={goBack}>
      <span class="iconify lucide--arrow-left text-4xl text-center"></span>
    </button>
    <div>
      <span class="text-3xl font-semibold">Comics Management</span>
    </div>
  </div>

  <div class="ml-8">
    <a href="../create-comic" class="btn btn-warning"
      ><span class="iconify lucide--plus text-2xl"></span></a
    >
  </div>

  <h1 class="text-3xl font-semibold ml-8 mt-14">{totals} title</h1>

  <div class="mt-5 mb-10 flex flex-col gap-3 mx-auto w-11/12">
    {#each comics as comic (comic.id)}
      <div class="card ">
        <div class="card-body p-3 bg-base-100 rounded-lg drop-shadow-lg h-44">
          <div class="flex gap-1">
            <a href=""
              ><div class="w-24 h-32">
                <picture class="w-24 h-32">
                  <source class="w-24 h-32 object-cover " srcset={cover + comic.cover} />
                  <img class="float-left" src="https://placehold.co/84x120" alt="" />
                </picture>
              </div></a
            >

            <div class="flex-grow flex flex-col justify-evenly ml-2 ">
              <div class="flex justify-between ">
                <div class="flex gap-3 items-center">
                  <span class="font-bold text-lg max-w-xl">{comic.name}</span>
                  <span class="font-normal text text-lg text-center max-w-30 overflow-hidden max-h-14"
                    >{comic.authors}</span
                  >
                </div>

                <div class="flex gap-3">
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--star text-xl"></span>
                    <span class="text-lg">{comic.totalRatings}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--bookmark text-xl"></span>
                    <span class="text-base">{comic.totalFollows}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--eye text-xl"></span>
                    <span class="text-lg">{comic.totalViews}</span>
                  </div>
                  <div class="flex gap-1 items-center">
                    <span class="iconify lucide--message-square text-xl"></span>
                    <span class="text-lg">{comic.totalComments}</span>
                  </div>
                  <div class="flex gap-1 items-center my-auto bg-base-200 rounded px-2">
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
                    <span class="text-base font-semibold">{comic.status}</span>
                  </div>
                  <div class="dropdown dropdown-bottom dropdown-left flex items-center">
                    <div tabindex="0" role="button" class="btn btn-sm text-base">
                      <span class="iconify lucide--ellipsis-vertical text-xl"></span>
                    </div>
                    <ul
                      tabindex="0"
                      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                      <li>
                        <a
                          ><span class="iconify lucide--pencil text-xl"></span><span
                            class="text-base font-medium">Edit</span
                          >
                        </a>
                      </li>
                      <li>
                        <button on:click={() => deleteComic(comic.id)}
                          ><span class="iconify lucide--trash-2 text-xl"></span><span
                            class="text-base font-medium">Delete</span
                          ></button
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="flex gap-1 items-center py-2 border-t-2">
                {#each comic.tags.filter(tag => tag.category.name === 'Genre') as genreTag}
                  <span class="badge badge-outline">{genreTag.name}</span>
                {/each}
              </div>

              <div class="text-sm font-normal mt-2 md:max-h-14 sm:max-h-1 overflow-x-auto">
                <span class="text-base">{comic.description} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
