<script lang="ts">
	export let data;



	const {leaderboard} = data;
</script>



{#each leaderboard as user}
	<p>user name {user.fullName} has {user.points} points and has a profile url of {user.avatarUrl}</p>
{/each}
