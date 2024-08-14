<script lang="ts">
	import {currentDate, currentFormattedTime} from "$lib/time.js";
    import {enhance} from "$app/forms";
	import generateGreeting from "$lib/generateGreeting.js";



	export let data;
	export let form;

	// no nice way to use destructuring to get around this
	const user = data.user!;


	// this really doesn't need to be reactive but it'll make me feel fancy
	// there's no way that this is an expensive enough operation i really have to trash it
	$: greeting = generateGreeting(user, $currentDate);


	const jcsSites = [
		"EJMS",
		"WJMS"
	];

	const visitPurposes = [
		"Administration",
		"Class monitoring",
		"Other"
	];


	let currentlySelectedPurpose: string;
</script>

<style>
	#greeting-box, #location-input {
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



	fieldset {
		border: none;
		margin: 0;
		padding: 0;
	}
</style>



<!-- TODO: semantic HTML this -->
<div id="greeting-box">
	<h2>{greeting}</h2>

	<!-- i need a better name for this class but whatever it's not that important -->
	<p>What have you been up to? It's currently <span class="time">{$currentFormattedTime}.</span></p>
</div>



<form id="location-input" method="POST" action="?/submitLocation" use:enhance>
	<!-- TODO: a11y here -->
	<label for="location-selector">Location</label>
	<select name="location-selector">
		<option selected hidden value={""}>Select a site...</option>
		{#each jcsSites as site}
			<option>{site}</option>
		{/each}
	</select>


	<fieldset>
		<legend>Purpose for visiting</legend>

		<select name="purpose-selector" bind:value={currentlySelectedPurpose}>
			<option selected hidden value={""}>Select a reason...</option>
			{#each visitPurposes as purpose}
				<option>{purpose}</option>
			{/each}
		</select>

		<input name="location-purpose" disabled={currentlySelectedPurpose !== "Other"}>
	</fieldset>


	<button id="submit">Submit</button>
</form>



{#if form}
	{#if form.error}
		<p>something went wrong!!!!</p>
	{:else}
		<p>yay!!!</p>
	{/if}
{/if}
