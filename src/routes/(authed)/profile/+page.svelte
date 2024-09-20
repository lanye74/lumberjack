<script lang="ts">
	import {invalidateAll} from "$app/navigation";

	import BorderBox from "$lib/components/BorderBox.svelte";
	import {currentProfile, nextProfile} from "$lib/profiles.js";
	import {formatPoints} from "$lib/formatters.js";
	import type {MouseEventHandler} from "svelte/elements";
	import resizeGoogleAvatarUrl from "$lib/resizeGoogleAvatarUrl.js";
	import UserAvatar from "$lib/components/UserAvatar.svelte";
	import UserProfileAction from "$lib/components/UserProfileAction.svelte";



	export let data;

	const user = data.user!;
	const profilePrefix = data.profilePrefix!;

	currentProfile.setPrefix(profilePrefix);


	let avatarUrl = user.user_metadata.avatar_url as string;
	avatarUrl = resizeGoogleAvatarUrl(avatarUrl);


	let pointsText = formatPoints(data.profilePoints ?? 0);


	// TODO: should this be in a separate file?
	$: userProfileActions = [
		{
			icon: "exchange-alt",
			text: `Switch to ${$nextProfile.pretty}`,
			callback: async () => {
				const formData = new FormData();
				formData.append("new-profile", $nextProfile.prefix);

				const response = await fetch("?/swapProfile", {
					method: "POST",
					body: formData
				});

				// TODO: actually handle this
				if(!response.ok) return;


				currentProfile.increment();

				const json = await response.json();

				const points = JSON.parse(json.data)[1] as number;
				pointsText = formatPoints(points ?? 0);
			}
		},

		{
			icon: "sign-out-alt",
			text: "Sign out",
			callback: async () => {
				await fetch("/auth/logout", {method: "POST"});
				invalidateAll();
			}
		}
		// TODO: this sucks
	] as {icon: "exchange-alt" | "sign-out-alt"; text: string; callback: MouseEventHandler<HTMLButtonElement>}[];
</script>

<style>
	.user-avatar-name {
		width: 100%;

		display: grid;
		/* prevent avatar from being squished */
		grid-template-columns: auto 1fr;
		align-items: center;

		gap: 2rem;

	}

	.user-avatar-name h2 {
		margin: 0;
		font: bold 2.25rem var(--font-serif);
	}



	.user-info {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		width: 100%;
		gap: 0.3rem;
	}

	.user-info p {
		margin: 0;
		display: inline-block;

		font: italic 1.5rem var(--font-serif);
		color: var(--subtext-color);
	}

	.bold {
		font: inherit;
		font-weight: 600;
	}
</style>



<section class="profile-preview">
	<BorderBox direction="column" alignItems="center" gap="1.25rem">
		<div class="user-avatar-name">
			<UserAvatar src={avatarUrl} absoluteSize="6rem" />

			<h2>{user.user_metadata.full_name}</h2>
		</div>

		<div class="user-info">
			<p><span class="bold">{$currentProfile.pretty}</span> profile,</p>
			<p><span class="bold">{pointsText}</span> points</p>
		</div>
	</BorderBox>

	<div class="options">
		{#each userProfileActions as action}
			<UserProfileAction {...action} />
		{/each}
	</div>
</section>
