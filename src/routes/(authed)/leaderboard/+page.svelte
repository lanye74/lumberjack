<script lang="ts">
	import {onDestroy} from "svelte";

	import BorderBox from "$components/BorderBox.svelte";
	import LeaderboardEntry from "$components/LeaderboardEntry.svelte";
	import Podium from "$components/Podium.svelte";

	import type {PointsLeaderboardEntry} from "$types/database.js";



	export let data;
	const {leaderboard, avatarAtlas} = data;


	let topThree: PointsLeaderboardEntry[] = [];
	let lastSeven: PointsLeaderboardEntry[] = [];

	leaderboard.then(leaderboardEntries => {
		topThree = leaderboardEntries?.slice(0, 3) ?? [];
		lastSeven = leaderboardEntries?.slice(3) ?? [];
	});



	let atlasSrc = "";
	let avatarErrors: boolean[] = [];

	avatarAtlas.then(texture => {
		if(texture === null) return;


		// overrides for avatars that didn't load
		avatarErrors = texture.avatarErrors;


		const byteData = atob(texture.imageData.split(",")[1]); // remove the mime type
		const bytes = new Uint8Array(byteData.length);

		for(let i = 0; i < byteData.length; i++) {
			bytes[i] = byteData.charCodeAt(i);
		}

		const blob = new Blob([bytes], {type: "image/jpeg"});
		atlasSrc = URL.createObjectURL(blob);
	});


	onDestroy(() => {
		if(atlasSrc.startsWith("blob:")) URL.revokeObjectURL(atlasSrc);
	});
</script>

<style>
	.leaderboard {
		display: grid;
		grid-template-columns: min-content min-content auto;
		grid-template-rows: auto;
		column-gap: 1rem;
	}

	.last-seven-placeholder {
		display: flex;

		box-sizing: border-box;
		/* TODO: standardize some properties e.g. this specific padding */
		padding: 1.25rem 2rem;
		margin: 0;

		grid-column: 1 / span 3;

		font: italic 1.5rem var(--font-serif);
	}



	.leaderboard-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	h2 {
		margin: 0;
		text-align: center;
		font: bold 2.5rem var(--font-serif);
	}

	.leaderboard-header p {
		margin: 0;
		text-align: center;
		font: italic 1.5rem var(--font-serif);
		color: var(--subtext-color);
	}
</style>



{#await leaderboard}
	<BorderBox direction="column">
		<h2>Loading...</h2>
	</BorderBox>
{:then leaderboardData}
	{#if leaderboardData === null}
		<p>Something went terribly terribly wrong while loading the data...</p>
	{:else}
		<BorderBox direction="column" gap="1.5rem">
			{#if topThree.length > 0}
				<div class="leaderboard-header">
					<h2>Points Leaderboard</h2>
					<p>Refreshes when logs are submitted</p>
				</div>
			{/if}

			<Podium {atlasSrc} users={topThree} />
		</BorderBox>

		<section class="leaderboard">
			{#each lastSeven as user, index}
				<LeaderboardEntry {atlasSrc} {user} index={index + 3} />
			{/each}

			{#if lastSeven.length < 7 && topThree.length > 0}
				<p class="last-seven-placeholder">More entries will show here as the leaderboard populates!</p>
			{/if}
		</section>
	{/if}
{/await}
