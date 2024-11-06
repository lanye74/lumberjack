<script lang="ts">
	import {routeIconMappings} from "$utils/icons.js";
	import {routeAriaLabelMappings} from "$utils/routing/maps.js";

	import type {AuthedRoute} from "$types/routing.js";



	const {path}: {path: AuthedRoute} = $props();

	const Icon = routeIconMappings[path];
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



<!-- TODO: aria-current -->
<a href={path} data-sveltekit-preload-data="hover" aria-label={mappedAriaLabel}>
	<Icon font-size="3.5rem" />
</a>
