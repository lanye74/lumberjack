<script lang="ts">
	import LeaderboardEntry from "$lib/components/LeaderboardEntry.svelte";
	import Podium from "$lib/components/Podium.svelte";



	export let data;
	const {leaderboard} = data;


	// i really shouldn't non-null assert but bleh
	const topThree = leaderboard!.slice(0, 3);
	const lastSeven = leaderboard!.slice(-7);


	// IMPORTANT TODO: make sure this works when there are <10 users in the database
</script>

<style>
	.leaderboard {
		display: grid;
		grid-template-columns: min-content min-content auto;
		grid-template-rows: auto;
		column-gap: 1rem;
	}
</style>



{#if leaderboard !== null}
	<!-- TODO: i dislike section being declared in-component here, but not below. cope i guess? -->
	<Podium users={topThree} />

	<section class="leaderboard">
		{#each lastSeven as user, index}
			<LeaderboardEntry {user} index={index + 3} />
		{/each}
	</section>
{:else}
	<p>Something went terribly terribly wrong while loading the data...</p>
{/if}
