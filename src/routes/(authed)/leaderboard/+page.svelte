<script lang="ts">
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



	.user {
		display: grid;

		grid-template-columns: subgrid;
		grid-template-rows: subgrid;

		align-items: center;


		padding: 1rem 2rem;
		box-sizing: border-box;

		border-bottom: 0.25rem solid #ccc;

		grid-column: 1 / 4;
		grid-row: var(--grid-row);
	}



	.user span.place {
		grid-column: 1;

		font: normal bold 2rem Lora;
	}

	.user img {
		grid-column: 2;

		height: 5rem;
		border-radius: 50%;
	}

	.user p {
		grid-column: 3;

		font: 1.5rem Lora;
		margin: 0;
	}
</style>



{#if leaderboard !== null}
	<div class="leaderboard">
		{#each leaderboard as user, index}
			<div class="user" style:--grid-row={index + 1}>
				<span class="place">{index + 1}.</span>

				<!-- TODO: store a local user missing asset -->
				<!-- TODO: (2) figure out how to use skeleton loaders for this stuff -->
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src={user.avatarUrl ?? "https://www.ais.unwater.org/ais/aiscm/pdf/lib/tcpdf/images/logo_example.png"} alt="User profile picture">

				<p>{user.fullName} - {user.points} points</p>
			</div>
		{/each}
	</div>
{:else}
	<p>Something went terribly terribly wrong while loading the data...</p>
{/if}
