<script lang="ts">
	import {invalidateAll} from "$app/navigation";

    import BorderBox from "$lib/components/BorderBox.svelte";
	import ImageWithIconFallback from "$lib/components/ImageWithIconFallback.svelte";
    import {formatPoints} from "$lib/formatters.js";
	import resizeGoogleAvatarUrl from "$lib/resizeGoogleAvatarUrl.js";
	import UserProfileAction from "$lib/components/UserProfileAction.svelte";



	export let data;
	const user = data.user!;


	let avatarUrl = user.user_metadata.avatar_url as string;
	avatarUrl = resizeGoogleAvatarUrl(avatarUrl);



	// TODO: make this not horrible xd
	// this is actually the worst code i've ever had the displeasure of writing
	// like i tried to do this in a expandable way with getIncrementedProfileNumber but it's just so bad
	const profiles = ["AST", "Maintenance"];

	let selectedProfile = 0;

	function getIncrementedProfileNumber(from: number) {
		return (from + 1) % profiles.length;
	}

	// can't reactive declare this because it complains about non-existent cyclical dependencies
	let nextProfile = getIncrementedProfileNumber(selectedProfile);


	$: userProfileActions = [
		{
			text: `Swap to ${profiles[nextProfile]}`,
			iconId: "fa-solid:exchange-alt",
			callback: async () => {
				const formData = new FormData();
				formData.append("new-profile", profiles[nextProfile]);

				const response = await fetch("?/swapProfile", {
					method: "POST",
					body: formData
				});


				if(response.ok) {
					selectedProfile = getIncrementedProfileNumber(selectedProfile);
					nextProfile = getIncrementedProfileNumber(nextProfile);
				}
			}
		},

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
	<BorderBox direction="row" alignItems="center" gap="2rem">
		<div class="image-wrapper">
			<ImageWithIconFallback
				src={avatarUrl} alt="User profile picture"
				iconId="fa-solid:user-circle" />
		</div>

		<div class="user-info">
			<h2>{user.user_metadata.full_name}</h2>
			<p>Profile: {profiles[selectedProfile]}</p>
			<p>{formatPoints(data.points ?? 0)} points</p>
		</div>
	</BorderBox>

	<div class="options">
		{#each userProfileActions as action}
			<UserProfileAction {...action} />
		{/each}
	</div>
</section>
