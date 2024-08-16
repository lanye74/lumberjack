<script lang="ts">
	import {currentDate, currentFormattedTime} from "$lib/time.js";
	import generateGreeting from "$lib/generateGreeting.js";
    import SubmitLocationForm from "$lib/components/SubmitLocationForm.svelte";



	export let data;
	export let form;

	// no nice way to use destructuring to get around this
	const user = data.user!;


	// this really doesn't need to be reactive but it'll make me feel fancy
	// there's no way that this is an expensive enough operation i really have to trash it
	$: greeting = generateGreeting(user, $currentDate);
</script>

<style>
	#greeting-box {
		display: flex;
		flex-direction: column;

		margin: 2rem;
		box-sizing: border-box;
	}

	#greeting-box {
		border-radius: 0.25rem;
		border: 0.25rem solid #ccc;
		padding: 2rem;

		gap: 2rem;
		overflow-wrap: break-word;
	}

	h2, p {
		margin: 0;
	}

	h2 {
		font: normal bold 3.25rem var(--font-family);
	}

	p {
		font-size: 2rem;
	}

	span.time {
		font: normal 600 2rem var(--time-font);
	}
</style>



<div id="greeting-box">
	<h2>{greeting}</h2>

	<!-- i need a better name for this class but whatever it's not that important -->
	<p>What have you been up to? It's currently <span class="time">{$currentFormattedTime}.</span></p>
</div>



<SubmitLocationForm />



{#if form}
	{#if form.error}
		<p>something went wrong!!!!</p>
	{:else}
		<p>yay!!!</p>
	{/if}
{/if}
