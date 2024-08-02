<script lang="ts">
	import AuthButtons from "$lib/AuthButtons.svelte";
	import LocationSubmit from "$lib/LocationSubmit.svelte";
	import {manager} from "$lib/main.js";

	$: welcomeHeader = manager.authManager.authState === "SIGNED_IN" ? `Welcome, ${manager.authManager.user!.user_metadata.full_name}` : "Welcome";

	// $: pointsText = manager.userManager.getPoints() !== -1 ? `You have ${manager.userManager.getPoints()} points ` : "Your points will show up here";

	const pointsText = "Your points will show up here";

	(async () => {
		await manager.authManager.updateAuthState();
		await manager.userManager.getPoints();
	})();
</script>

<style>
	:global(body) {
		margin: 0;
		height: 100vh;

		--bg-color: #222;
		/* great variable naming scheme here */
		--text-white: #eee;
		--white-darker: #aaa;
		--white-darkest: #777;

		background-color: var(--bg-color);
	}

	#container {
		padding: 2em 2em;
		width: 100%;
		height: 100%;

		box-sizing: border-box;


		font: 1em system-ui, arial;
		color: var(--text-white);
	}

	h1 {
		font: 2em system-ui, arial;
		color: var(--text-white);

		margin: 0;
		/* I LOVE RELATIVE UNITS!!!! I LOVE RELATIVE UNITS!!!!! */
		margin-bottom: 0.5em;
	}

	#points {
		font-style: italic;
		/* 0.5EM THERE AND 2EM HERE!!!! */
		/* TODO: please just use rem */
		margin-bottom: 2em;
	}
</style>



<div id="container">
	<h1>{welcomeHeader}</h1>

	<AuthButtons />

	<p id="points">{pointsText}</p>

	<LocationSubmit />
</div>
