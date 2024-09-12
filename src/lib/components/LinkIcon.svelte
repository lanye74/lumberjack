<script lang="ts">
	import "iconify-icon";

	import type {AuthedRoute} from "$lib/types/routes.js";



	export let path: AuthedRoute;



	const routeIconMappings: {[key in AuthedRoute]: string} = {
		"/home": "fa-solid:home",
		"/editor": "fa-solid:pencil-alt",
		"/leaderboard": "fa-solid:trophy",
		"/profile": "fa-solid:user-circle"
	};

	const ariaLabelMappings: {[key in AuthedRoute]: string} = {
		"/home": "Navigate to home page",
		"/editor": "Navigate to log editor",
		"/leaderboard": "Navigate to the points leaderboad",
		"/profile": "Navigate to your profile page"
	};



	const mappedIconName = routeIconMappings[path];
	const mappedAriaLabel = ariaLabelMappings[path]
</script>

<style>
	iconify-icon {
		font-size: 4rem;
	}

	a {
		color: #000;

		/* increase touch area for icon */
		padding: 1rem;

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
	<!-- TODO: the icons don't populate in edge?????? -->
	<iconify-icon icon={mappedIconName} />
</a>
