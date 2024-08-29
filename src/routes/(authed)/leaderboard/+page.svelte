<script lang="ts">
	import LeaderboardEntry from "$lib/components/LeaderboardEntry.svelte";
	import Podium from "$lib/components/Podium.svelte";
    import type {UserPublicInfo} from "$lib/types/database.js";



	export let data;
	const {leaderboard} = data;


	let topThree: UserPublicInfo[] = [];
	let lastSeven: UserPublicInfo[] = [];


	if(leaderboard) {
		topThree = leaderboard.slice(0, Math.min(leaderboard.length, 3));

		// ew nested if
		// guard clauses won't save me here
		if(leaderboard.length > 3) {
			// we should never receive more than 10, but just in case
			lastSeven = leaderboard.slice(3, Math.min(leaderboard.length, 10));
		}
	}


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
			<!-- TODO: display fallback if no entries -->
		{/each}
	</section>
{:else}
	<p>Something went terribly terribly wrong while loading the data...</p>
{/if}
