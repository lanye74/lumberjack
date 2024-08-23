<script lang="ts">
	import {currentDate, currentFormattedTime} from "$lib/time.js";
	import generateGreeting from "$lib/generateGreeting.js";
    import SubmitLocationForm from "$lib/components/SubmitLocationForm.svelte";



	export let data, form;
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
		font: bold 3.25rem var(--font-serif);
	}

	p {
		font-size: 2rem;
	}

	span.time {
		font: 600 2rem var(--time-font);
	}
</style>



<!-- <section bind:clientWidth={sectionWidth} bind:clientHeight={sectionHeight}
         in:fly={{x: sectionWidth, duration: 500}} out:fly={{x: sectionHeight, duration: 500}}> -->
<section>
	<!-- TODO: is it better to wrap this in its own section? -->
	<div id="greeting-box">
		<h2>{greeting}</h2>

		<p>What have you been up to? It's currently <span class="time">{$currentFormattedTime}.</span></p>
	</div>



	<SubmitLocationForm />



	{#if form}
		{#if form.error}
			<p>something went wrong!!!! message: {form.message}</p>
		{:else}
			<p>yay!!!</p>
		{/if}
	{/if}
</section>
