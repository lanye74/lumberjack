<script lang="ts">
	// @ts-ignore wehhhhhh
	import FaHome from "svelte-icons/fa/FaHome.svelte";
	// @ts-ignore
	import FaRegClock from "svelte-icons/fa/FaRegClock.svelte";
	// @ts-ignore
	import FaTrophy from "svelte-icons/fa/FaTrophy.svelte";
	// @ts-ignore
	import FaRegUserCircle from "svelte-icons/fa/FaRegUserCircle.svelte";


	export let path: IconShortName;


	const iconNameMappings = {
		"/home": FaHome,
		"/logger": FaRegClock,
		"/leaderboard": FaTrophy,
		"/profile": FaRegUserCircle
	};

	type IconShortName = keyof typeof iconNameMappings;


	const mappedIconName = iconNameMappings[path];
</script>

<style>
	a {
		color: black;

		aspect-ratio: 1 / 1;

		height: 4rem;

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



<a href={path}>
	<svelte:component this={mappedIconName} />
</a>
