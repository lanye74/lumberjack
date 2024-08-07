<script lang="ts">
	export let data;



	const {leaderboard} = data;
</script>



{#each leaderboard as user}
	<p>user id {user.google_user_id} has {user.points} points</p>
{/each}
