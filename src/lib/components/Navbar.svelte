<script lang="ts">
	import LinkIcon from "$components/LinkIcon.svelte";

    import {navbarRoutes} from "$utils/routing/maps.js";



	export let height;
</script>

<style>
	nav {
		position: fixed;
		z-index: 100;
		bottom: 0;

		width: 100%;

		border-top: 0.25rem solid var(--border-color);

		font-size: 1.5rem;

		display: flex;
		flex-direction: row;
		justify-content: space-around;

		/* effective top padding: 2rem */
		/* bonus bottom padding for easy thumb access */
		padding: 1rem 1rem 2rem;

		box-sizing: border-box;

		background-color: white;

		view-transition-name: navbar;
	}
</style>



<nav bind:clientHeight={height}>
	{#each navbarRoutes as path}
		<LinkIcon {path} />
	{/each}
</nav>
