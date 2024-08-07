<script lang="ts">
	export let data;



	const {leaderboard} = data;
</script>

<style>
	.user {
		display: flex;
		flex-direction: row;

		align-items: center;

		border-bottom: 0.25rem solid #ccc;
	}

	.user img {
		height: 6rem;
	}
</style>



{#each leaderboard as user}
	<div class="user">
		<!-- TODO: store a local user missing asset -->
		<!-- svelte-ignore a11y-img-redundant-alt -->
		<img src={user.avatarUrl ?? "https://www.ais.unwater.org/ais/aiscm/pdf/lib/tcpdf/images/logo_example.png"} alt="User profile picture">

		<p>user name {user.fullName} has {user.points}</p>
	</div>
{/each}
