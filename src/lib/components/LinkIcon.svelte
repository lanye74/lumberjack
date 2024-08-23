<script lang="ts">
	import "iconify-icon";

    import type {LumberjackRoute} from "../../app.js";
    import {onNavigate} from "$app/navigation";



	export let path: LumberjackRoute;



	const routeIconMappings: {[key in LumberjackRoute]: string} = {
		"/home": "fa-solid:home",
		"/editor": "fa-solid:pencil-alt",
		"/leaderboard": "fa-solid:trophy",
		"/profile": "fa-solid:user-circle"
	};


	const mappedIconName = routeIconMappings[path];



	let isNavigating = false;


	onNavigate(navigation => {
		// @ts-ignore
		if(!document.startViewTransition) return;

		isNavigating = true;

		return new Promise(resolve => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();

				await navigation.complete;

				isNavigating = false;
			});
		});
	});
</script>

<style>
	iconify-icon {
		font-size: 4rem;
	}

	a {
		color: black;

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



<a href={path} class:navigating={isNavigating} data-sveltekit-preload-data="hover">
	<!-- TODO: the icons don't populate in edge?????? -->
	<iconify-icon icon={mappedIconName} />
</a>
