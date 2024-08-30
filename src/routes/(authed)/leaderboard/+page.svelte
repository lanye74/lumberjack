<script lang="ts">
	import LeaderboardEntry from "$lib/components/LeaderboardEntry.svelte";
	import Podium from "$lib/components/Podium.svelte";



	export let data;
	const {leaderboard} = data;


	const topThree = leaderboard?.slice(0, 3) ?? [];
	const lastSeven = leaderboard?.slice(3, 10) ?? [];
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
</style>



{#if leaderboard !== null}
	<!-- TODO: i dislike section being declared in-component here, but not below. cope i guess? -->
	<Podium users={topThree} />

	<section class="leaderboard">
		{#each lastSeven as user, index}
			<LeaderboardEntry {user} index={index + 3} />
		{/each}

		{#if lastSeven.length < 7 && topThree.length > 0}
			<p class="last-seven-placeholder">More entries will show here as the leaderboard populates!</p>
		{/if}
	</section>
{:else}
	<!-- TODO: make these defaults look half okay -->
	<p>Something went terribly terribly wrong while loading the data...</p>
{/if}
