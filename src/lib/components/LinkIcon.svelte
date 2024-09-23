<script lang="ts">
	import HomeIcon from "virtual:icons/fa-solid/home";
	import PencilIcon from "virtual:icons/fa-solid/pencil-alt";
	import TrophyIcon from "virtual:icons/fa-solid/trophy";
	import ProfileIcon from "virtual:icons/fa-solid/user-circle";

	import type {AuthedRoute} from "$lib/types/routes.js";



	export let path: AuthedRoute;



	const routeIconMappings: {[key in AuthedRoute]: typeof HomeIcon} = {
		"/home": HomeIcon,
		"/editor": PencilIcon,
		"/leaderboard": TrophyIcon,
		"/profile": ProfileIcon
	};

	const ariaLabelMappings: {[key in AuthedRoute]: string} = {
		"/home": "Navigate to home page",
		"/editor": "Navigate to log editor",
		"/leaderboard": "Navigate to the points leaderboad",
		"/profile": "Navigate to your profile page"
	};



	const mappedIcon = routeIconMappings[path];
	const mappedAriaLabel = ariaLabelMappings[path];
</script>

<style>
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
	<svelte:component this={mappedIcon} font-size="3.5rem" />
</a>
