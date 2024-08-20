<script lang="ts">
    import LeaderboardEntry from "$lib/components/LeaderboardEntry.svelte";

	export let data;



	const {leaderboard} = data;
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
	<div class="leaderboard">
		{#each leaderboard as user, index}
			<LeaderboardEntry {user} {index} />
		{/each}
	</div>
{:else}
	<p>Something went terribly terribly wrong while loading the data...</p>
{/if}
