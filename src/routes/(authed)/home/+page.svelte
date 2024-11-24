<script lang="ts">
	import BorderBox from "$components/BorderBox.svelte";
    import LinkTile from "$components/LinkTile.svelte";

	import {currentDate} from "$utils/stores/time.js";
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

	.tiles {
		display: flex;
		flex-direction: column;
		padding: 0 2rem;
		gap: 1rem;
	}
</style>



<BorderBox direction="column" gap="1rem">
	<h2>{greeting}</h2>

	<p>What have you been up to?</p>
</BorderBox>


<section class="tiles">
	<LinkTile background="/tiles/trophy.svg"
	          backgroundSize="4.5rem"
	          href="/leaderboard"
	>
		View the leaderboard
	</LinkTile>

	<!-- oklch(34.9% 0.108 253) = jcs blue -->
	<!-- oklch(34.9% 0.108 145) = #02480f -->
	<LinkTile background="/tiles/tree.svg"
	          backgroundSize="3.75rem"
			  backgroundColor="#02480f"
	          href="/form"
	>
		Submit a log
	</LinkTile>
</section>
