<script lang="ts">
	import LinkIcon from "./LinkIcon.svelte";
	import type {AuthedRoute} from "$lib/types/routes.js";



	// const routes: AuthedRoute[] = ["/home", "/editor", "/leaderboard", "/profile"];
	const routes: AuthedRoute[] = ["/home", "/leaderboard", "/profile"];



	export let height;
</script>

<style>
	nav {
		position: fixed;
		z-index: 100;
		bottom: 0;

		width: 100%;

		border-top: 0.25rem solid #ccc;
		/* box-shadow: 0px; */

		font-size: 1.5rem;

		display: flex;
		flex-direction: row;
		justify-content: space-between;

		/* effective top padding: 2rem */
		padding: 1rem 3rem;

		box-sizing: border-box;

		background-color: white;

		view-transition-name: navbar;
		transition: none;
	}

	:root::view-transition-group(navbar) {
		view-transition-name: none;
	}
</style>



<nav id="bottom-bar" bind:clientHeight={height}>
	{#each routes as path}
		<LinkIcon {path} />
	{/each}
</nav>
