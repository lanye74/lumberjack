<script lang="ts">
	import {invalidateAll} from "$app/navigation";

	import ImageWithIconFallback from "$lib/components/ImageWithIconFallback.svelte";
	import resizeGoogleAvatarUrl from "$lib/resizeGoogleAvatarUrl.js";
	import UserProfileAction from "$lib/components/UserProfileAction.svelte";



	export let data;
	const user = data.user!;


	let avatarUrl = user.user_metadata.avatar_url as string;
	avatarUrl = resizeGoogleAvatarUrl(avatarUrl);



	const userProfileActions = [
		{
			text: "Sign out",
			iconId: "fa-solid:sign-out-alt",
			callback: async () => {
				await fetch("/auth/logout", {method: "POST"});
				invalidateAll();
			}
		}
	];
</script>

<style>
	.name-icon {
		padding: 2rem;

		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;

		gap: 2rem;

		border-bottom: 0.25rem solid #ccc;
	}

	.name-icon span {
		font: bold 2.25rem var(--font-serif);
	}

	.image-wrapper {
		display: flex;
		justify-content: center;

		width: 6rem;
		height: 6rem;
		font-size: 6rem;

		border-radius: 50%;

		color: #aaa;
	}

	.image-wrapper:has(img) {
		filter: drop-shadow(0.5rem 0.5rem 1rem #0004);
	}
</style>



<section class="profile-preview">
	<!-- TODO: maybe turn this into a card-not-card-block-thing like the "welcome" on the home page? -->
	<div class="name-icon">
		<div class="image-wrapper">
			<ImageWithIconFallback
				src={avatarUrl} alt="User profile picture"
				iconId="fa-solid:user-circle" />
		</div>

		<span>{user.user_metadata.full_name}</span>
	</div>

	<div class="options">
		{#each userProfileActions as action}
			<UserProfileAction {...action} />
		{/each}
	</div>
</section>
