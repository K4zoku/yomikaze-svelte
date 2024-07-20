<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
	let clearHistoryModal:HTMLDialogElement;
	let deleteCategoryModal:HTMLDialogElement;
	let comics = [
		{
			cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
			name: 'Naruto',
			chapter: '1',
			author: 'Kishimoto Masashi',
			description:
				"Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
			tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
			rating: 8.31,
			bookmarks: '13k',
			views: 'N/A',
			comments: 39,
			votes: '5',
			status: 'Completed',
			timeAgo: '22 days ago'
		},
		{
			cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
			chapter: '1',
			name: 'Naruto',
			author: 'Kishimoto Masashi',
			description:
				"Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
			tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
			rating: 8.31,
			bookmarks: '13k',
			views: 'N/A',
			comments: 39,
			votes: '5',
			status: 'Completed',
			timeAgo: '22 days ago'
		},
		{
			cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
			chapter: '1',
			name: 'Naruto',
			author: 'Kishimoto Masashi',
			description:
				"Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
			tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
			rating: 8.31,
			bookmarks: '13k',
			views: 'N/A',
			comments: 39,
			votes: '5',
			status: 'Completed',
			timeAgo: '22 days ago'
		},
		{
			cover: 'https://i.yomikaze.org/images/misc/72733305899966464.webp',
			chapter: '1',
			name: 'Naruto',
			author: 'Kishimoto Masashi',
			description:
				"Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
			tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
			rating: 8.31,
			bookmarks: '13k',
			votes: '5',
			views: 'N/A',
			comments: 39,
			status: 'Completed',
			timeAgo: '22 days ago'
		}
		// Các comic khác...
	];

	let chapters = [
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago',
			publisher: '123'
		},
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago',
			publisher: '123'
		},
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago',
			publisher: '123'
		},
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago',
			publisher: '123'
		},
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago'
		},
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago'
		},
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago'
		},
		{
			title: `Ch. 17 - Let's Have Some Tea`,
			timeAgo: '22 days ago'
		}
	];

	let showAll = false;

	// Function to toggle show all chapters
	function toggleShowAll() {
		showAll = !showAll;
	}

	function showLess() {
		showAll = false;
	}

	// Determine if to show the "Show All" button based on chapters length
	function shouldShowShowAllButton() {
		return chapters.length >= 3;
	}

	function showTags() {
		return tag.length >= 3;
	}

	let activeContent = 'content1';

	function showContent(content) {
		activeContent = content;
	}
</script>

<div class="h-screen container mx-auto p-6 bg-white">
	<div class="label mt-12">
		<a class="btn btn-ghost">
			<svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
				<path
					fill="none"
					stroke="black"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m12 19l-7-7l7-7m7 7H5"
				/>
			</svg>
			<span class="text-xl mb-1">Reading History</span>
		</a>

		<!-- <Alert> -->
			<dialog bind:this={clearHistoryModal} class="modal">
				<div class="modal-box flex flex-col items-center text-center">
					<span class="iconify lucide--alert-circle text-4xl text-error"></span>
					<h3 class="text-lg font-bold">Are you sure you want to clear all history?</h3>
					<div class="modal-action">
						<form method="dialog">
							<button class="btn btn-outline btn-error">Confirm</button>
							<button class="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		<!-- </Alert> -->
	</div>
	<div class="flex justify-end items-end mb-3">
		<a on:click={() => {clearHistoryModal.showModal()}} class="btn btn-outline btn-warning btn-md"
			><span class="text-l">Clear All</span></a
		>
	</div>
	<div class="flex justify-end items-end">
        <button
          on:click={() => showContent('content1')}
          class="rounded-l-lg p-2 btn-outline btn-warning border"
        >
          <span class="iconify lucide--list text-2xl mt-1"></span>
        </button>
        <button
          on:click={() => showContent('content2')}
          class="rounded-r-lg p-2 btn-outline btn-warning border"
        >
          <span class="iconify lucide--stretch-horizontal text-2xl mt-1"></span>
        </button>
      </div>
	<div class="content {activeContent === 'content1' ? 'active' : ''}">
		<div class="mt-5">
			<div class="space-y-4">
				{#each comics as comic}
					<div class="flex p-3 items-center bg-gray-100 rounded-lg shadow-md">
						<img
							src={comic.cover}
							alt={comic.name}
							class="w-42 h-56 rounded-lg object-cover mb-auto"
						/>
						<div class="flex flex-col ml-4 flex-grow object-cover mb-auto">
							<div class="flex items-center">
								<div class="flex items-center space-x-2 mb-0">
									<h2 class="text-l font-bold mb-0">{comic.name}</h2>
									<span class="text-l text-gray-600 mb-0">{comic.author}</span>
								</div>
							</div>
							<div class="divider custom-divider"></div>

							{#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter}
								<div>
									<a
										class="text-lg text-gray-600 mt-2 flex justify-between p-2 px-3 w-100 hover:bg-neutral-content rounded"
									>
										<div class="flex gap-2">
											<span class="iconify lucide--eye mt-1"></span>
											<span>{chapter.title}</span>
										</div>
										<div class="flex flex-col gap-2">
											<div class="flex gap-3">
												<span class="iconify lucide--clock mt-1"></span>
												<span>{chapter.timeAgo}</span>
											</div>
										</div>
									</a>
								</div>
							{/each}

							{#if shouldShowShowAllButton()}
								{#if !showAll}
									<a
										class="text-lg text-gray-600 mt-2 flex justify-center p-2 px-3 w-100 hover:bg-neutral-content rounded"
										on:click={toggleShowAll}
									>
										Show All
									</a>
								{:else}
									<a
										class="text-lg text-gray-600 mt-2 flex justify-center p-2 px-3 w-100 hover:bg-neutral-content rounded"
										on:click={showLess}
									>
										Show Less
									</a>
								{/if}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="content {activeContent === 'content2' ? 'active' : ''}">
		<div class="grid grid-cols-2">
		  {#each comics as comic}
			<div class="card p-2">
			  <div class="card-body items-center rounded-lg shadow-md py-3 px-3">
				<div class="flex">
				  <a href=""
					><div class="w-40 h-56">
					  <img class="float-left rounded" src={comic.cover} alt={comic.name} />
					</div></a
				  >
				  <div class=" flex flex-col justify-evenly ml-2">
					<div class="flex justify-between gap-2">
					  <div class="flex gap-2">
						<span class="font-semibold text-xl">{comic.name}</span>
					  </div>
					  <div class="flex">
						<div class="flex gap-3 me-2 mb-3">
						  <div class="flex gap-1 my-auto bg-base-300 rounded px-2">
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
							<span class="text-base font">{comic.status}</span>
						  </div>
						</div>
						<div
						  class="flex gap-1 my-auto me-2 mb-3"
						  on:click={() => deleteCategoryModal.showModal()}
						>
						  <span class="iconify lucide--trash-2 text-2xl"></span>
						</div>
					  </div>
					</div>
	
					<div class="flex justify-between gap-2">
					  <div class="flex gap-2 mt-1">
						<!-- {#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter} -->
						{#each comic.tags.slice(0, 3) as tag}
						  <a class="badge badge-outline">{tag}</a>
						{/each}
					  </div>
					</div>
					<div class="flex justify-between gap-3 mt-1">
					  <div class="flex gap-3">
						<h4 class="font-semibold text-l">Chapter: {comic.chapter}</h4>
					  </div>
					</div>
					<div class=" text-sm font-normal">
					  <span class="block text-base overflow-hidden max-h-20" id="description">
						{comic.description}
					  </span>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  {/each}
		</div>
	  </div>
	<div class="flex justify-center mt-4">
		<div class="join">
			<button class="join-item btn">
				<!-- chevron-left -->
				<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="black"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m15 18l-6-6l6-6"
					/></svg
				>
			</button>
			<button class="join-item btn">1</button>
			<button class="join-item btn">
				<!-- chevron-right -->
				<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="black"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m9 18l6-6l-6-6"
					/></svg
				>
			</button>
		</div>
	</div>
</div>

<!-- DIALOG DELETE COMIC -->
<dialog bind:this={deleteCategoryModal} class="modal">
	<div class="modal-box flex flex-col items-center text-center">
	  <span class="iconify lucide--alert-circle text-4xl text-error"></span>
	  <h3 class="text-lg font-bold">Are you sure you want to Delete Comic?</h3>
	  <div class="modal-action">
		<form method="dialog">
		  <button class="btn btn-outline btn-error">Delete</button>
		  <button class="btn">Close</button>
		</form>
	  </div>
	</div>
  </dialog>

<style>
	.custom-divider {
		height: 1px;
		width: calc(100% - 2rem);
		margin: 0 auto;
		background-color: #e2e8f0;
	}
	.content {
		display: none;
	}
	.content.active {
		display: block;
	}
</style>
