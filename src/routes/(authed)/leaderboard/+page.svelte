<script lang="ts">
	export let data;



	const {leaderboard} = data;

	const formatNumber = new Intl.NumberFormat().format;
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


		/* TODO: standardize some properties e.g. this specific padding */
		padding: 1.25rem 2rem;
		box-sizing: border-box;

		border-bottom: 0.25rem solid #ccc;

		grid-column: 1 / span 3;
	}

	.user:last-child {
		border-bottom: none;
	}



	.user .place {
		grid-column: 1;

		font: normal bold 2.5rem Lora;
	}

	.user img {
		grid-column: 2;

		height: 5rem;
		border-radius: 50%;
	}

	.user .text {
		grid-column: 3;


		display: flex;
		flex-direction: column;
	}



	.user .text p {
		margin: 0;
	}

	.text .name {
		font: normal bold 1.5rem Lora;
	}

	.text .points {
		font: italic normal 1.25rem Lora;
		color: #666;
	}
</style>



{#if leaderboard !== null}
	<div class="leaderboard">
		{#each leaderboard as user, index}
			<div class="user">
				<span class="place">{index + 1}.</span>

				<!-- TODO: store a local user missing asset -->
				<!-- TODO: (2) figure out how to use skeleton loaders for this stuff
				           currently waiting for the server halts page loading = bad UX -->
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src={user.avatarUrl ?? "https://www.ais.unwater.org/ais/aiscm/pdf/lib/tcpdf/images/logo_example.png"} alt="User profile picture">

				<div class="text">
					<p class="name">{user.fullName}</p>
					<p class="points">{formatNumber(user.points)} points</p>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p>Something went terribly terribly wrong while loading the data...</p>
{/if}
