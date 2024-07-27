<script lang="ts">
	let active = true;
	let mainImageSrc = '../readingmode/anh1.png';
	let images =[
		
	];

	function changeImage(src:string) {
		mainImageSrc = src;
	}
</script>

<div class="flex container mx-auto h-screen relative overflow-hidden mt-16">
	<div id="display-image" class="w-4/6 h-4/5 flex justify-center">
		<img
			id="main-image"
			src={mainImageSrc}
			alt="Main Image"
			class="max-w-full max-h-full object-contain"
		/>
	</div>
	<!-- <button on:click={() => (active = 			{active ? 'Close' : 'Open'} Menu
		</button> -->
	<aside class:active class="h-4/5 w-2/6 relative">
		<div class="flex justify-center">
			<div>
				<select class="select select-bordered w-44">
					<option>Time New Roman</option>
					<option>Aria</option>
					<option>Bold</option>
				</select>
			</div>
			<div class="flex ml-3">
				<div class="flex flex-col self-center">
					<button>
						<!-- !arrow up -->
						<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.45"
								d="m5 12l7-7l7 7m-7 7V5"
							/></svg
						>
					</button>
					<button>
						<!-- !arrow down -->
						<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.45"
								d="M12 5v14m7-7l-7 7l-7-7"
							/></svg
						>
					</button>
				</div>
				<div>
					<select class="select select-bordered w-full">
						<option>1</option>
						<option>2</option>
						<option>3</option>
					</select>
				</div>
			</div>
			<div class="flex ml-3">
				<div class="flex">
					<img class="self-center" src="../gcg.svg" alt="none" />
				</div>
				<div class="ml-2">
					<select class="select select-bordered w-full">
						<option>1.1</option>
						<option>1.2</option>
						<option>1.33</option>
					</select>
				</div>
			</div>
		</div>
		<div class="flex mt-5 gap-5 justify-center">
			<div>
				<input class="w-10 h-10" type="color" name="" id="" />
			</div>
			<div class="self-center border-2 border-black h-8">
				<button>
					<!-- !left side  -->
					<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.45"
							d="M21 6H3m12 6H3m14 6H3"
						/></svg
					>
				</button>
				<button>
					<!-- !mid side  -->
					<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.45"
							d="M21 6H3m14 6H7m12 6H5"
						/></svg
					>
				</button>
				<button>
					<!-- !right side -->
					<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.45"
							d="M21 6H3m18 6H9m12 6H7"
						/></svg
					>
				</button>
			</div>
			<div class="mt-1">
				<button>
					<!-- !bold -->
					<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.45"
							d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"
						/></svg
					>
				</button>
				<button>
					<!-- !italic -->
					<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.45"
							d="M19 4h-9m4 16H5M15 4L9 20"
						/></svg
					>
				</button>
				<button>
					<!-- !under -->
					<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.45"
							d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"
						/></svg
					>
				</button>
			</div>
		</div>
		<div class="flex gap-3 mt-5 justify-center border-2">
			<p class="text-2xl self-center">Stroke</p>
			<select class="select select-bordered w-13">
				<option>0.1</option>
				<option>0.2</option>
				<option>0.3</option>
			</select>
			<div class="self-center">
				<input class="w-10 h-10" type="color" name="" id="" />
			</div>
			<img class="ml-5" src="../gianCachChu.svg" alt="" />
			<select class="select select-bordered w-13">
				<option>0.1</option>
				<option>0.2</option>
				<option>0.3</option>
			</select>
			<p class="text-2xl self-center">px</p>
		</div>
		<div class="flex flex-col mt-5 border-t-2 border-black">
			<div class="flex justify-center mt-5">
				<textarea class="textarea textarea-bordered w-full" placeholder="Bio"></textarea>
			</div>
			<div class="flex justify-center mt-3">
				<textarea class="textarea textarea-bordered w-full" placeholder="Bio"></textarea>
			</div>
		</div>
		<button class="w-20 flex gap-3 absolute bottom-2 right-2 border-2 border-neutral rounded-lg">
			<!-- !play button -->
			<svg class="self-center" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.45"
					d="m6 3l14 9l-14 9z"
				/></svg
			>
			<p class="self-center">Run</p>
		</button>
	</aside>
	<div class="h-1/5 background1 absolute bottom-0">
		<div class="w-screen h-full flex">
			<img
				class="w-28 h-4/5 object-contain self-center cursor-pointer"
				src="../readingmode/anh1.png"
				alt="Image 1"
				on:click={() => changeImage('../readingmode/anh1.png')}
			/>
			<img
				class="w-28 h-4/5 object-contain self-center cursor-pointer"
				src="../readingmode/anh2.png"
				alt="Image 2"
				on:click={() => changeImage('../readingmode/anh2.png')}
			/>
			<img
				class="w-28 h-4/5 object-contain self-center cursor-pointer"
				src="../readingmode/anh3.png"
				alt="Image 3"
				on:click={() => changeImage('../readingmode/anh3.png')}
			/>
			<img
				class="w-28 h-4/5 object-contain self-center cursor-pointer"
				src="../readingmode/anh4.png"
				alt="Image 3"
				on:click={() => changeImage('../readingmode/anh4.png')}
			/>
			<img
				class="w-28 h-4/5 object-contain self-center cursor-pointer"
				src="../readingmode/anh5.png"
				alt="Image 3"
				on:click={() => changeImage('../readingmode/anh5.png')}
			/>
			<img
				class="w-28 h-4/5 object-contain self-center cursor-pointer"
				src="../readingmode/anh6.png"
				alt="Image 3"
				on:click={() => changeImage('../readingmode/anh6.png')}
			/>
			<img
				class="w-28 h-4/5 object-contain self-center cursor-pointer"
				src="../readingmode/anh7.png"
				alt="Image 3"
				on:click={() => changeImage('../readingmode/anh7.png')}
			/>
		</div>
	</div>
</div>

<style>
	aside {
		position: absolute;
		right: -500px;
		border: 1px solid #ddd;
		background-color: #efefef;
		transition: all 0.5s;
		padding: 10px;
	}
	.active {
		right: 0px;
	}
	.background1 {
		background-color: #4f4a4a;
	}
</style>
