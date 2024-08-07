<script lang="ts">
    import LinkIcon from "./LinkIcon.svelte";
</script>

<style>
	nav {
		position: fixed;
		bottom: 0;

		width: 100%;

		border-top: 2px solid #ccc;
		/* box-shadow: 0px; */

		font: 1.5rem Lora;

		display: flex;
		flex-direction: row;
		justify-content: space-between;

		/* effective top padding: 2rem */
		padding: 1rem calc(6vw + 1rem);

		box-sizing: border-box;

		background-color: white;
	}
</style>



<nav id="bottom-bar">
	<LinkIcon path="/home" />
	<LinkIcon path="/logger" />
	<LinkIcon path="/leaderboard" />
	<LinkIcon path="/profile" />
</nav>
