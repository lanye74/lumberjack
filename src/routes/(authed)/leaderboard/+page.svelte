<script lang="ts">
	import BorderBox from "$lib/components/BorderBox.svelte";
	import LeaderboardEntry from "$lib/components/LeaderboardEntry.svelte";
	import Podium from "$lib/components/Podium.svelte";
    import type {PointsLeaderboardEntry} from "$lib/types/database.js";



	export let data;
	const {leaderboard} = data;


	let topThree: PointsLeaderboardEntry[] = [];
	let lastSeven: PointsLeaderboardEntry[] = [];


	leaderboard.then(leaderboardEntries => {
		topThree = leaderboardEntries?.slice(0, 3) ?? [];
		lastSeven = leaderboardEntries?.slice(3, 10) ?? [];
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

		text-align: center;
	}

	.leaderboard-header h2, .leaderboard-header p {
		margin: 0;
	}

	.leaderboard-header h2 {
		font: bold 2.5rem var(--font-serif);
	}

	.leaderboard-header p {
		font: italic 1.5rem var(--font-serif);
		color: var(--subtext-color);
	}
</style>



{#await leaderboard}
	<p>Loading!</p>
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

			<Podium users={topThree} />
		</BorderBox>

		<section class="leaderboard">
			{#each lastSeven as user, index}
				<LeaderboardEntry {user} index={index + 3} />
			{/each}

			{#if lastSeven.length < 7 && topThree.length > 0}
				<p class="last-seven-placeholder">More entries will show here as the leaderboard populates!</p>
			{/if}
		</section>
	{/if}
{/await}
