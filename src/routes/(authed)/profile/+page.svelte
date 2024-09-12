<script lang="ts">
	import {invalidateAll} from "$app/navigation";

	import BorderBox from "$lib/components/BorderBox.svelte";
	import ImageWithIconFallback from "$lib/components/ImageWithIconFallback.svelte";
	import UserProfileAction from "$lib/components/UserProfileAction.svelte";
	import {currentProfile, currentProfileIndex, nextProfile, profilePrefixes} from "$lib/profiles.js";
	import {formatPoints} from "$lib/formatters.js";
	import resizeGoogleAvatarUrl from "$lib/resizeGoogleAvatarUrl.js";



	export let data;

	const user = data.user!;
	const profile = data.profile!;

	currentProfileIndex.set(profilePrefixes.indexOf(profile));


	let avatarUrl = user.user_metadata.avatar_url as string;
	avatarUrl = resizeGoogleAvatarUrl(avatarUrl);


	let pointsText = formatPoints(data.points ?? 0);


	// should the
	$: userProfileActions = [
		{
			text: `Switch to ${$nextProfile}`,
			iconId: "fa-solid:exchange-alt",
			callback: async () => {
				const formData = new FormData();
				formData.append("new-profile", $nextProfile);

				const response = await fetch("?/swapProfile", {
					method: "POST",
					body: formData
				});



				if(response.ok) {
					// i wonder if there's a better pattern than having to read into the underlying store
					currentProfileIndex.increment();

					// TODO: this sucks
					const json = await response.json();

					const points = JSON.parse(json.data)[2] as number;

					pointsText = formatPoints(points ?? 0);
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
		align-items: flex-start;

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
			<p>Profile: {$currentProfile}</p>
			<p>{pointsText} points</p>
		</div>
	</BorderBox>

	<div class="options">
		{#each userProfileActions as action}
			<UserProfileAction {...action} />
		{/each}
	</div>
</section>
