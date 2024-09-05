<script lang="ts">
	import {invalidateAll} from "$app/navigation";

	import ImageWithIconFallback from "$lib/components/ImageWithIconFallback.svelte";
	import resizeGoogleAvatarUrl from "$lib/resizeGoogleAvatarUrl.js";
	import UserProfileAction from "$lib/components/UserProfileAction.svelte";
    import BorderBox from "$lib/components/BorderBox.svelte";



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



	// TODO: put formatters in a helper file
	const pointsFormatter = new Intl.NumberFormat().format;
</script>

<style>
	.page-header {
		display: flex;
		flex-direction: row;
		align-items: center;

		gap: 2rem;
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



	.user-info {
		display: flex;
		flex-direction: column;
		align-items: left;

		gap: 0.5rem;
	}

	.user-info h2, .user-info p {
		margin: 0;
		text-align: left;
	}

	.user-info h2 {
		font: bold 2.25rem var(--font-serif);
	}

	.user-info p {
		font: italic 1.5rem var(--font-serif);
		color: #666;
	}
</style>



<section class="profile-preview">
	<!-- TODO: once again lamenting the loss of ability to style borderbox directly -->
	<BorderBox>
		<div class="page-header">
			<div class="image-wrapper">
				<ImageWithIconFallback
				src={avatarUrl} alt="User profile picture"
				iconId="fa-solid:user-circle" />
			</div>

			<div class="user-info">
				<h2>{user.user_metadata.full_name}</h2>
				<p>{pointsFormatter(data.points ?? 0)} points</p>
			</div>
		</div>
	</BorderBox>

	<div class="options">
		{#each userProfileActions as action}
			<UserProfileAction {...action} />
		{/each}
	</div>
</section>
