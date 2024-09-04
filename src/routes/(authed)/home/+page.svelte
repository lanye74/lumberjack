<script lang="ts">
    import BorderBox from "$lib/components/BorderBox.svelte";
	import {currentDate, currentFormattedTime} from "$lib/stores.js";
	import generateGreeting from "$lib/generateGreeting.js";
	import SubmitLocationForm from "$lib/components/SubmitLocationForm.svelte";
	import Toast from "$lib/components/Toast.svelte";



	export let data, form;
	// no nice way to use destructuring to get around this
	const user = data.user!;


	// this really doesn't need to be reactive but it'll make me feel fancy
	// there's no way that this is an expensive enough operation i really have to trash it
	$: greeting = generateGreeting(user, $currentDate);
</script>

<style>
	.greeting-box {
		display: flex;
		flex-direction: column;

		gap: 2rem;
		/* overflow-wrap: break-word; */
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



<BorderBox>
	<!-- TODO: i haaaaate that this needs a wrapper -->
	<div class="greeting-box">
		<h2>{greeting}</h2>

		<p>What have you been up to? It's currently <span class="time">{$currentFormattedTime}.</span></p>
	</div>
</BorderBox>

<section>
	<SubmitLocationForm {data} />
</section>



<!-- TODO: make toast a programmatic call and put all of them in their own wrapper -->
{#if form}
	<Toast duration={4000}>{form.message}</Toast>
{/if}
