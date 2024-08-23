<script lang="ts">
	import LinkIcon from "./LinkIcon.svelte";
	import type {LumberjackRoute} from "../../app.js";



	const routes: LumberjackRoute[] = ["/home", "/editor", "/leaderboard", "/profile"];
</script>

<style>
	nav {
		position: fixed;
		bottom: 0;

		width: 100%;

		border-top: 0.25rem solid #ccc;
		/* box-shadow: 0px; */

		font-size: 1.5rem;

		display: flex;
		flex-direction: row;
		justify-content: space-between;

		/* effective top padding: 2rem */
		padding: 1rem 2rem;

		box-sizing: border-box;

		background-color: white;

		view-transition-name: navbar;
		transition: none;
	}

	:root::view-transition-group(navbar) {
		view-transition-name: none;
	}
</style>



<nav id="bottom-bar">
	{#each routes as path}
		<LinkIcon {path} />
	{/each}
</nav>
