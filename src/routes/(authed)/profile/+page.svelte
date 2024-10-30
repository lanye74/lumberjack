<script lang="ts">
    import {applyAction, enhance} from "$app/forms";
	import {invalidateAll} from "$app/navigation";
    import type {SubmitFunction} from "@sveltejs/kit";

	import BorderBox from "$components/BorderBox.svelte";
	import UserAvatar from "$components/UserAvatar.svelte";

	import {currentProfile, nextProfile, profilePrefixes} from "$utils/profiles.js";
	import {formatPoints} from "$utils/formatters.js";
	import resizeGoogleAvatarUrl from "$utils/resizeGoogleAvatarUrl.js";
    import toaster from "$utils/stores/toaster.js";
    import {iconComponentMap} from "$utils/icons.js";



	export let data, form;


	const user = data.user!;
	const profilePrefix = data.profilePrefix!;

	currentProfile.setPrefix(profilePrefix);


	let avatarUrl = user.user_metadata.avatar_url as string;
	avatarUrl = resizeGoogleAvatarUrl(avatarUrl);


	let pointsText = formatPoints(data.profilePoints ?? 0);


	// TODO: should this be in a separate file?
	$: userProfileActions = [
		{
			iconId: "sign-out-alt",
			text: "Sign out",
			callback: async () => {
				await fetch("/auth/logout", {method: "POST"});
				invalidateAll();
			}
		}
	];


	const swapProfile: SubmitFunction = ({formData, cancel}) => {
		const profile = formData.get("new-profile");

		// TODO: how to not have to ts-ignore this?
		// @ts-ignore
		if(profilePrefixes.includes(profile)) {
			return async ({result, update}) => {
				if(result.type !== "success") {
					// TODO: clean this up
					console.log(":(");
					return;
				}


				currentProfile.increment();
				pointsText = formatPoints(result.data?.profilePoints ?? 0);

				// is `update` needed here?
				// update({reset: false});
			}
		}


		console.log("bowomp");

		cancel();
		// applyAction();
	}
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



	button {
		border: none;
		background: none;
		padding: 1.25rem 2rem;

		font-size: 1.75rem;
		cursor: pointer;

		width: 100%;
		text-align: left;

		border-bottom: 0.25rem solid var(--border-color);

		display: flex;
		flex-direction: row;
		gap: 2rem;

		align-items: center;

		color: #000;
	}

	button:first-child {
		border-top: 0.25rem solid var(--border-color);
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
		<form method="POST" action="?/swapProfile" use:enhance={swapProfile}>
			<button type="submit">
				<svelte:component this={iconComponentMap["exchange-alt"]} font-size="3rem" />

				<input type="hidden" name="new-profile" value={$nextProfile.prefix}>

				Switch to {$nextProfile.pretty}
			</button>
		</form>
	</div>
</section>
