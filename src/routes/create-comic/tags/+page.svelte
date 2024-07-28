
<script>
	import { slide } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	let isOpen = false;
	let selectedTagsFormat = [];
	let selectedTags = [];
	let selectedOperator = '&';

	const tags = [
		'Action',
		'Comedy',
		'Adventure',
		'Crime',
		'Fantasy',
		'Daram',
		'Historycal',
		'Horror',
		'Wuxia',
		'Mystery',
		'Romance',
		'Medical',
		'Tragedy',
		'Thriller',
		'Sci-fi',
		'Mecha',
		'Isekai',
		'Sports',
		'Superhero',
		'Medical',
		'Philosophical'
	];

	const tagsFormat = ['4-Koma', 'Doujiinshi', 'Full Color', 'Oneshot', 'Self-published'];

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function toggleTag(tag, tagFormat) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}

		if (selectedTagsFormat.includes(tagFormat)) {
			selectedTagsFormat = selectedTagsFormat.filter((t) => t !== tagFormat);
		} else {
			selectedTagsFormat = [...selectedTagsFormat, tagFormat];
		}
	}

	function resetTags() {
		selectedTags = [];
		selectedTagsFormat = [];
	}

	function handleOperatorChange(event) {
		selectedOperator = event.target.value;
	}



	$: displayValue = selectedTags.join(` ${selectedOperator} `) || 'any';
</script>

<div class="relative-container z-50">
	<div class="w-full">
		<label
			class="input input-bordered input-sm flex items-center gap-1 font-medium text-lg bg-base-300"
		>
			<input
				type="text"
				readonly
				class="cursor-pointer"
				value={displayValue}
				on:click={toggleDropdown}
			/>
		</label>
	</div>

	{#if isOpen}
		<div
			class="dropdown-content bg-white shadow-md rounded mt-2 absolute z-50"
			transition:slide={{ duration: 300 }}
		>
			<div tabindex="0" class=" w-85 bg-base-200">
				<div class="flex flex-col z-50 p-4 gap-4">
					<div class="flex z-50 gap-3">
						<label class="input input-bordered flex items-center gap-2 w-75">
							<input type="text" class="grow" placeholder="Search" />
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								class="w-4 h-4 opacity-70"
								><path
									fill-rule="evenodd"
									d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
									clip-rule="evenodd"
								/></svg
							>
						</label>
						<button
							class="w-36 bg-red-200 font-medium text-red-500 rounded hover:bg-red-100"
							on:click={resetTags}>Reset</button
						>
					</div>
					
					<div class="flex gap-4">
						<span class="text-xl font-semibold">Gerne</span>
						<hr class="border-1 my-4 border-black flex-grow" />
					</div>

					<ul class="list-none grid grid-cols-8 gap-3">
						{#each tags as tag}
							<li
								class="bg-base-100 hover:bg-gray-100 cursor-pointer flex justify-center text-sm truncate py-2 break-words"
								on:click={() => toggleTag(tag)}
							>
								{tag}
								{#if selectedTags.includes(tag)}
									<span class="text-blue-600">✓</span>
								{/if}
							</li>
						{/each}
					</ul>

					<div class="flex gap-4">
						<span class="text-xl font-semibold">Format</span>
						<hr class="border-1 my-4 border-black flex-grow" />
					</div>
					<ul class="list-none grid grid-cols-7 gap-3">
						{#each tagsFormat as tagFormat}
							<li
								class="bg-base-100 hover:bg-gray-100 cursor-pointer flex justify-center text-sm truncate py-2 break-words"
								on:click={() => toggleTag(tagFormat)}
							>
								{tagFormat}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.relative-container {
		position: relative;
	}
	
</style>
