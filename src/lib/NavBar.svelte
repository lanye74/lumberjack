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

		padding: 2rem calc(8vw + 1rem);

		box-sizing: border-box;
	}
</style>



<nav id="bottom-bar">
	<LinkIcon path="/home" />
	<LinkIcon path="/logger" />
	<LinkIcon path="/leaderboard" />
	<LinkIcon path="/profile" />
</nav>
