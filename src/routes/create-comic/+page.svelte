<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Tags from '../create-comic/tags/+page.svelte';
	import http from '$lib/http.js'; // Assuming http.js correctly handles HTTP requests
	import httpImage from '$lib/utils/httpImage.js';

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			goto('/'); // Navigate to homepage if no history available
		}
	}

	let imageUrl = '';
	let bannerImageUrl = '';
	let fileInputRef;
	let bannerFileInputRef;
	let names = writable([]);
	let showInput = writable(false);
	let newName = '';
	let title = '';
	let anotherTitle = '';
	let description = '';
	let tags = writable([]); // Assuming you handle tags elsewhere
	let selectedAuthors = writable([]);
	let publisherId = 'your-publisher-id'; // Replace with actual publisher ID

	async function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			try {
				const formData = new FormData();
				formData.append('File', file);

				const response = await httpImage.post('/images', formData);
				if (response.status === 201) {
					imageUrl = response.data.images[0]; // Assuming imageUrl is returned from server as string URL
				} else {
					console.error('Failed to upload image:', response.data);
					alert('Failed to upload image. Please try again.');
				}
			} catch (error) {
				console.error('Error uploading image:', error);
				alert('An error occurred while uploading image.');
			}
		}
	}

	async function handleBannerFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			try {
				const formData = new FormData();
				formData.append('File', file);

				const response = await httpImage.post('/images', formData);
				if (response.status === 201) {
					bannerImageUrl = response.data.images[0]; // Assuming bannerImageUrl is returned from server as string URL
				} else {
					console.error('Failed to upload banner:', response.data);
					alert('Failed to upload banner. Please try again.');
				}
			} catch (error) {
				console.error('Error uploading banner:', error);
				alert('An error occurred while uploading banner.');
			}
		}
	}

	function triggerFileInput() {
		fileInputRef.click();
	}

	function triggerBannerFileInput() {
		bannerFileInputRef.click();
	}

	function handleAddName() {
		if (newName.trim()) {
			names.update((n) => [...n, newName.trim()]);
			newName = '';
			showInput.set(false);
		}
	}

	function toggleInput() {
		showInput.update((value) => !value);
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleAddName();
		}
	}

	// Close the input when clicking outside
	onMount(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest('.dropdown')) {
				showInput.set(false);
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	async function createComic() {
		// Ensure imageUrl and bannerImageUrl are updated with string URLs from httpImage
		const payload = {
			name: title,
			aliases: anotherTitle ? [anotherTitle] : [],
			description: description,
			cover: imageUrl,
			banner: bannerImageUrl,
			publicationDate: new Date().toISOString(),
			authors: $names,
			status: 'OnGoing',
			tagIds: $tags,
			publisherId: publisherId
		};

		console.log('Payload:', payload);

		try {
			const response = await http.post('/comics', payload);
			console.log('Response:', response);

			if (response.status === 201) {
				alert('Comic created successfully!');
				goto('/'); // Redirect to homepage or another page
			} else {
				alert('Failed to create comic.');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred while creating the comic.');
		}
	}
</script>

<div class="mt-20">
	<div class="flex my-3 gap-2">
		<button on:click={goBack}>
			<svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24">
				<path
					fill="none"
					stroke="black"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m12 19l-7-7l7-7m7 7H5"
				/>
			</svg>
		</button>
		<div>
			<span class="text-3xl font-semibold">Create Comic</span>
		</div>
	</div>

	<form on:submit|preventDefault={createComic}>
		<div class="flex flex-col gap-2 mt-10">
			<span class="text-2xl font-semibold ml-16">Banner of Comic</span>
			<div
				class="w-full h-96 border-2 border-accent-content border-dashed flex justify-center cursor-pointer"
				on:click={triggerBannerFileInput}
			>
				{#if bannerImageUrl}
					<img src={httpImage.defaults.baseURL+bannerImageUrl} alt="Selected Image" class="w-full h-full object-cover" />
				{:else}
					<svg
						class="place-self-center"
						xmlns="http://www.w3.org/2000/svg"
						width="3em"
						height="3em"
						viewBox="0 0 24 24"
					>
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 12h14m-7-7v14"
						/>
					</svg>
				{/if}
				<input
					type="file"
					class="hidden"
					bind:this={bannerFileInputRef}
					on:change={handleBannerFileChange}
					accept="image/*"
				/>
			</div>
		</div>

		<div class="flex gap-40 mt-10 ml-16">
			<div class="flex flex-col gap-2">
				<div><span class="text-2xl font-semibold">Cover of Comic</span></div>
				<div class="flex gap-3">
					<div
						class="w-48 h-64 border-2 border-accent-content border-dashed flex justify-center cursor-pointer"
						on:click={triggerFileInput}
					>
						{#if imageUrl}
							<img src={httpImage.defaults.baseURL+imageUrl} alt="Selected Image" class="w-full h-full object-cover" />
						{:else}
							<svg
								class="place-self-center"
								xmlns="http://www.w3.org/2000/svg"
								width="3em"
								height="3em"
								viewBox="0 0 24 24"
							>
								<path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 12h14m-7-7v14"
								/>
							</svg>
						{/if}
						<input
							type="file"
							class="file-input hidden"
							bind:this={fileInputRef}
							on:change={handleFileChange}
							accept="image/*"
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-52">
				<div class="flex flex-col gap-10">
					<div class="flex flex-col gap-2">
						<span class="text-xl font-semibold">Title</span>
						<input
							type="text"
							placeholder="Type here"
							class="input input-bordered w-72 max-w-xs"
							bind:value={title}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<span class="text-xl font-semibold">Tags</span>
						<Tags></Tags>
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<div>
						<span class="text-xl font-semibold">Aliases</span>
						<span class="text-base text-neutral-content font-bold">(optional)</span>
					</div>
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-72 max-w-lg"
						bind:value={anotherTitle}
					/>
					<div class="flex flex-col mt-8 gap-2">
						<span class="text-xl font-semibold">Author</span>
						<div class="dropdown relative w-full max-w-sm mx-auto">
							<input
								type="text"
								placeholder="Any"
								class="input input-bordered w-72 max-w-xs"
								on:click={toggleInput}
								value={$names.join(', ')}
							/>
							{#if $showInput}
								<div class="absolute mt-2 w-full z-10">
									<input
										type="text"
										class="input input-bordered w-full"
										bind:value={newName}
										on:keypress={handleKeyPress}
										placeholder="Enter a name and press Enter"
										autofocus
									/>
								</div>
							{/if}
						</div>
					</div>
					<div class="flex flex-col mt-8 gap-2">
						<span class="text-base-content font-medium text-xl">Publication Date</span>
						<input type="date" placeholder="Any" class="input input-bordered w-full max-w-xs" />
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-8 mt-10 ml-16">
			<span class="text-2xl font-semibold">Description</span>
			<div class="form-control">
				<textarea
					placeholder="Add Description Here ..."
					class="textarea textarea-bordered textarea-lg w-full max-w-full h-64"
					bind:value={description}
				></textarea>
			</div>
			<div class="flex justify-end gap-3 mb-10">
				<button type="button" class="btn btn-wide text-lg font-semibold" on:click={goBack}
					>Cancel</button
				>
				<button type="submit" class="btn btn-warning btn-wide text-lg font-semibold"
					>Create Comic</button
				>
			</div>
		</div>
	</form>
</div>
