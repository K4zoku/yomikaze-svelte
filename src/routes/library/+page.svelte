<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    let {libraryEntries} = data;
    let content:HTMLDialogElement;
    let create_personal:HTMLDialogElement;

	let title = '2';
	let comics = [
		{
			cover:  "https://i.yomikaze.org/images/misc/72733305899966464.webp",
			name: 'Naruto',
			chapter: '1',
			author: 'Kishimoto Masashi',
			description:
				"Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
			tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
			status: 'Completed',
			timeAgo: '22 days ago'
		},
		{
			cover:  "https://i.yomikaze.org/images/misc/72733305899966464.webp",
			chapter: '1',
			name: 'Naruto',
			author: 'Kishimoto Masashi',
			description:
				"Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
			tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
			status: 'Completed',
			timeAgo: '22 days ago'
		},
		{
			cover:  "https://i.yomikaze.org/images/misc/72733305899966464.webp",
			chapter: '1',
			name: 'Naruto',
			author: 'Kishimoto Masashi',
			description:
				"Before Naruto's birth, a great demon fox had attacked the Hidden Leaf Village. The 4th Hokage from the leaf village sealed the demon inside the newly born Naruto, causing him to unknowingly grow up detested by his fellow villagers. Despite his lack of talent in many areas of ninjutsu, Naruto strives for only one goal: to gain the title of Hokage, the strongest ninja in his village. Desiring the respect he never received, Naruto works toward his dream with fellow friends Sasuke and Sakura and mentor Kakashi as they go through many trials and battles that come with being a ninja.",
			tags: ['Action', 'Ninja', 'Comedy', 'Martial Arts', 'Adventure', 'Drama', 'Fantasy'],
			status: 'Completed',
			timeAgo: '22 days ago'
		}
		// Các comic khác...
	];
	let activeContent = 'content1';

	function showContent(content) {
		activeContent = content;
	}
</script>

<div class="h-screen container mx-auto p-6 bg-white">
	<!-- <NavBar title={title} /> -->
	<div class="">
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
				<span class="text-xl mb-1">Library</span>
			</a>
		</div>
		<div class="flex justify-between items-center p-4">
			<!-- Center part -->
			<div class="flex justify-between items-center bg-base-200 p-2 rounded  ">
				<div class="flex space-x-2 ">
					<button class="tab tab-active btn-outline rounded" data-tab="reading">Reading</button>
					<button class="tab btn-outline rounded" data-tab="plan-to-read">Plan to read</button>
					<button class="tab btn-outline rounded" data-tab="completed">Completed</button>
					<button class="tab btn-outline rounded" data-tab="on-hold">On hold</button>
					<button class="tab btn-outline rounded" data-tab="re-reading">Re-reading</button>
					<button class="tab btn-outline rounded" data-tab="dropped">Dropped</button>
				</div>
				<button class="tab btn-outline rounded" on:click={() => create_personal.showModal()}>
					<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
						<g fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
							<rect width="18" height="18" x="3" y="3" rx="2" />
							<path d="M8 12h8m-4-4v8" />
						</g>
					</svg>
				</button>
			</div>
				
			

			<!-- Right part -->
			<div class="flex space-x-2">
				<div class="form-control">
					<label
						class="input input-bordered flex items-center gap-2 pr-4 w-73 border-2 border-black"
					>
						<input type="text" class="grow-0" placeholder="Search" />
					</label>
				</div>
				<button class="btn">
					<!-- search -->
					<svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"
						><g
							fill="none"
							stroke="black"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21l-4.3-4.3" /></g
						></svg
					>
				</button>
				
					<dialog id="create_personal" bind:this={create_personal} class="modal">
						<div class="modal-box flex flex-col items-center text-center">
							<h3 class="text-lg font-bold">Create new personal category</h3>
							<h5 class="mb-2">Name for personal category</h5>
							<input
								type="text"
								placeholder="Type here"
								class="input input-bordered w-full max-w-xs"
							/>
							<div class="modal-action">
								<form method="dialog">
									<button class="btn btn-outline btn-success">Create</button>
									<button class="btn">Close</button>
								</form>
							</div>
						</div>
					</dialog>
			</div>
		</div>
		<div class="flex justify-between items-center p-4">
			<div class=" flex space-x-2 p-4">
				<h2 class="text-xl font-semibold">Title: {title}</h2>
			</div>
			<div class="flex justify-end items-end">
				<button
					on:click={() => showContent('content1')}
					class="rounded-l-lg px-3 py-3 bg-neutral-content focus:bg-accent-content focus:text-base-100 text-lg font-medium text-warning-content"
					autofocus
					><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
						/></svg
					></button
				>
				<button
					on:click={() => showContent('content2')}
					class="rounded-r-lg px-3 py-3 bg-neutral-content focus:bg-accent-content focus:text-base-100 text-lg font-medium text-warning-content"
					><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"
						><g
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							><rect width="20" height="6" x="2" y="4" rx="2" /><rect
								width="20"
								height="6"
								x="2"
								y="14"
								rx="2"
							/></g
						></svg
					></button
				>
			</div>
		</div>
			<div class="content {activeContent === 'content1' ? 'active' : ''}">
				<div class="flex flex-col gap-2.5 h-80">
					{#each comics as comic}
						<div class="card">
							<div class="card-body gird items-center rounded-lg shadow-md">
								<div class="flex gap-1">
									<div class="flex items-center">
										<img
											src={comic.cover}
											alt={comic.name}
											class="w-42 h-56 rounded-lg object-cover mb-auto"
										/>

										<div class="flex-grow flex flex-col justify-evenly ml-2">
											<div class="flex justify-between">
												<div class="flex items-center space-x-2 mb-2">
													<h2 class="text-l font-bold mb-0">{comic.name}</h2>
													<span class="text-l text-gray-600 mb-0">{comic.author}</span>
												</div>
												<div class="flex gap-3 mb-1">
													<div class="flex gap-1 my-auto bg-base-300 rounded px-2 mb-1">
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
											</div>
											<div class="divider custom-divider"></div>

											<div class="flex gap-2 mt-4 mb-3">
												<!-- {#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter} -->
												{#each comic.tags as tag}
													<a class="badge badge-outline">{tag}</a>
												{/each}
											</div>

											<div class=" text-sm font-normal">
												<span class="text-base">{comic.description} </span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="content {activeContent === 'content2' ? 'active' : ''}">
				<div class="grid grid-cols-2 gap-3 mt-4">
					{#each comics as comic}
						<div class="card">
							<div class="card-body gird items-center rounded-lg shadow-md">
								<div class="flex">
									<a href=""
										><div class="w-40 h-56">
											<img class="float-left rounded" src={comic.cover} alt="{comic.name}" />
										</div></a
									>

									<div class="flex-grow flex flex-col justify-evenly ml-2">
										<div class="flex justify-between gap-3 mt-1">
											<div class="flex gap-3">
												<span class="font-semibold text-xl">{comic.name}</span>
											</div>

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

										<div class="flex justify-between gap-3 mt-1">
											<div class="flex gap-2 mt-1">
												<!-- {#each showAll ? chapters.slice(0, 5) : chapters.slice(0, 3) as chapter} -->
												{#each comic.tags.slice(0, 3) as tag}
													<a class="badge badge-outline">{tag}</a>
												{/each}
											</div>

										
										</div>

										<div class="flex gap-3">
											<h4 class="font-semibold text-l">Chapter: {comic.chapter}</h4>
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
	</div>
</div>

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
