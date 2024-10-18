<script lang="ts">
	import {type AuthedRoute, routeAriaLabelMappings} from "$lib/routes.js";
	import {routeIconMappings} from "$lib/icons.js";



	export let path: AuthedRoute;



	const mappedIcon = routeIconMappings[path];
	const mappedAriaLabel = routeAriaLabelMappings[path];
</script>

<style>
	a {
		color: #000;

		/* increase touch area for icon */
		padding: 1rem 0.5rem;

		display: inline-flex;
		align-items: center;
		justify-content: center;

		/* will-change: transform; */
		transition: transform 0.2s;
	}

	a:hover {
		transform: scale(1.1);
	}

	a:active {
		transform: scale(1.3);
	}
</style>


<a href={path} data-sveltekit-preload-data="hover" aria-label={mappedAriaLabel}>
	<svelte:component this={mappedIcon} font-size="3.5rem" />
</a>
