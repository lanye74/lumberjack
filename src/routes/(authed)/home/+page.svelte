<script lang="ts">
	import BorderBox from "$components/BorderBox.svelte";

    import LinkTile from "$components/LinkTile.svelte";

	import {currentDate, currentFormattedTime} from "$utils/stores/time.js";
	import generateGreeting from "$utils/generateGreeting.js";



	let {data} = $props();
	const user = data.user!;

	// this really doesn't need to be reactive but it'll make me feel fancy
	// there's no way that this is an expensive enough operation i really have to trash it
	let greeting = $derived(generateGreeting(user, $currentDate));
</script>

<style>
	h2, p {
		margin: 0;
	}

	h2 {
		font: bold 2.8rem var(--font-serif);
	}

	p {
		font-size: 2rem;
	}

	span.time {
		font: 600 2rem var(--time-font);
	}


	.tiles {
		display: flex;
		flex-direction: column;
		padding: 0 2rem;
	}
</style>



<BorderBox direction="column" gap="1rem">
	<h2>{greeting}</h2>

	<p>What have you been up to? It’s currently <span class="time">{$currentFormattedTime.string}.</span></p>
</BorderBox>

<!-- is this really a nav?
     ...should this file be exempted from the layout? -->
<section class="tiles">
	<LinkTile href="/leaderboard" background="/tiles/trophy.svg">
		Leaderboard
	</LinkTile>
</section>
