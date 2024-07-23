<script lang="ts">
    import type { PageData } from '../editProfile/$types';
    
    export let data: PageData;
    let save_profile:HTMLDialogElement;

    import UpdateImage from '../updateImage/+page.svelte'

	let profile = {
		fullname: '',
		username: '',
		email: '',
		birthday: '',
		description: '',
		avatarUrl: ''
	};

	let fullnameError = '';
	let birthdayError = '';
	let emailError = '';
	let usernameError = '';

	let today = new Date().toISOString().split('T')[0];

	const handleAvatarChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				profile.avatarUrl = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const validateFullname = () => {
		if (!profile.fullname) {
			fullnameError = 'Fullname is required';
			return false;
		} else if (profile.fullname.length < 5) {
			fullnameError = 'Fullname must be at least 5 characters';
			return false;
		} else if (!/^[a-zA-Z\s'-]+$/.test(profile.fullname)) {
			fullnameError = 'Fullname can only contain letters, spaces, hyphens, and apostrophes';
			return false;
		} else {
			fullnameError = '';
			return true;
		}
	};

	const validateEmail = () => {
		if (!profile.email) {
			emailError = 'Email is required';
			return false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
			emailError = 'Invalid email address';
			return false;
		} else {
			emailError = '';
			return true;
		}
	};

	const validateUsername = () => {
		if (!profile.username) {
			usernameError = 'Username is required';
			return false;
		} else if (profile.username.length < 8) {
			usernameError = 'Username must be at least 8 characters long';
			return false;
		} else {
			usernameError = '';
			return true;
		}
	};

	const calculateAge = (birthday) => {
		const today = new Date();
		const birth = new Date(birthday);
		let age = today.getFullYear() - birth.getFullYear();
		const m = today.getMonth() - birth.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	};

	const validateBirthday = () => {
		if (!profile.birthday) {
			birthdayError = 'Birthday is required';
			return false;
		} else {
			const age = calculateAge(profile.birthday);
			if (age < 13) {
				birthdayError = 'You must be at least 13 years old to register.';
				return false;
			} else {
				birthdayError = '';
				return true;
			}
		}
	};

	const handleSubmit = () => {
		if (validateFullname() && validateEmail() && validateUsername() && validateBirthday()) {
			alert('Profile updated successfully!');
		}
	};
</script>

<div class="h-screen container mx-auto ">
 	<h1 class="text-3xl font-bold pt-12 mt-12 mb-6 text-center lg:text-left">Edit Profile</h1>
	<div
		class="flex flex-col lg:flex-row items-start lg:items-center space-x-0 lg:space-x-8 space-y-8 lg:space-y-0"
	>
		<div class="flex flex-col items-center">
			<label for="avatarInput">
				<img
					src={profile.avatarUrl}
					alt="Avatar"
					class="w-60 h-60 rounded-full border-4 border-white shadow-md mb-4 cursor-pointer"
				/>
			</label>
			<input type="file" id="avatarInput" class="hidden" on:change={handleAvatarChange} />
			<span class="text-gray-600 ">{profile.username}</span>
		</div>
		<div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div class="form-control">
				<label class="label">
					<span class="label-text font-semibold">Fullname</span>
				</label>
				<input
					type="text"
					id="fullname"
					bind:value={profile.fullname}
					class="input input-md input-bordered w-full"
					placeholder="Fullname"
					required
					on:blur={validateFullname}
				/>
				{#if fullnameError}
					<p class="text-red-500 text-sm text-error">{fullnameError}</p>
				{/if}
			</div>
			<div class="form-control">
				<label class="label">
					<span class="label-text font-semibold">Email</span>
				</label>
				<input
					type="email"
					id="email"
					bind:value={profile.email}
					class="input input-md input-bordered w-full"
					placeholder="Email address"
					required
					on:blur={validateEmail}
				/>
				{#if emailError}
					<p class="text-red-500 text-sm text-error">{emailError}</p>
				{/if}
			</div>
			<div class="form-control">
				<label class="label">
					<span class="label-text font-semibold">Username</span>
				</label>
				<input
					type="text"
					id="username"
					bind:value={profile.username}
					class="input input-md input-bordered w-full"
					placeholder="Username"
					required
					on:blur={validateUsername}
				/>
				{#if usernameError}
					<p class="text-red-500 text-sm text-error">{usernameError}</p>
				{/if}
			</div>

			<div class="form-control">
				<label class="label">
					<span class="label-text">Date of Birth</span>
				</label>
				<input
					type="date"
					id="dob"
					bind:value={profile.birthday}
					class="input input-md input-bordered w-full"
					max={today}
					on:blur={validateBirthday}
				/>
				{#if birthdayError}
					<p class="text-red-500 text-sm text-error mt-1">{birthdayError}</p>
				{/if}
			</div>
			<div class="form-control col-span-1 lg:col-span-2">
				<label class="label">
					<span class="label-text font-semibold">Description</span>
				</label>
				<textarea
					placeholder="Description"
					class="textarea textarea-bordered w-full"
					bind:value={profile.description}
				></textarea>
			</div>
		</div>
	</div>
	<div class="flex justify-center lg:justify-end mt-8 space-x-4">
		<button
			class="btn btn-outline btn-warning"
			on:click={handleSubmit}>Save Profile</button
		>
		<!-- <Alert> -->
			<dialog bind:this={save_profile} class="modal">
				<div class="modal-box flex flex-col items-center text-center">
					<svg
						class="mx-auto mb-4 w-12 h-12 text-success"
						xmlns="http://www.w3.org/2000/svg"
						width="1.4em"
						height="1.4em"
						viewBox="0 0 24 24"
					>
						<g
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 8v4m0 4h.01" />
						</g>
					</svg>

					<h3 class="text-lg font-bold">Profile Updated Successfully</h3>
					<p class="mb-4">Your profile has been updated.</p>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		<!-- </Alert> -->
		<button class="btn btn-outline btn-error">Cancel</button>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin-top: 2rem;
	}
</style>
