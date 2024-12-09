<script lang="ts">
	import {applyAction, enhance} from "$app/forms";
	import type {SubmitFunction} from "@sveltejs/kit";

	import EditableTime from "$components/EditableTime.svelte";

    import {FormStateManager} from "$utils/forms/FormStateManager.svelte.js";
	import {jcsSites, possibleVisitPurposes} from "$utils/forms/options.js";
	import parseSubmitLocationForm from "$utils/forms/parseSubmitLocationForm.js";
	import toaster from "$utils/stores/toaster.js";



	let {data, form} = $props();
	// no nice way to use destructuring to get around this

	const {currentProfile} = data;
	const siteChoices = jcsSites[currentProfile];
	const purposeChoices = possibleVisitPurposes[currentProfile];



	let formState = new FormStateManager(currentProfile);

	let exportedTime = $derived(formState.timeInputMethod === "Use current time" ? null : JSON.stringify(formState.customTime));


	// my `function` syntax.....
	const performClientSideValidation: SubmitFunction = ({formData, cancel}) => {
		const {isValid, errorMessage} = parseSubmitLocationForm(formData);


		if(isValid === true) {
			// fun fact:
			// as i'm continuing to learn svelte and sveltekit, whenever i have problems i can't solve (for example making currentlySelectedPurpose actually reset) i'll ask an LLM for pointers
			// i hate the idea of AI replacing jobs with a passion but i do enjoy having a semi-intelligent interface between me (a mortal) and the entire sum of humanity's knowledge
			// i try to solve problems by myself but really the issue is that i was focusing too much on running things based on the state of form, $page, etc.
			// chatgpt-4o mini is useless and i spend an hour banging my head into a wall. no, stop asking me to use onMount, it doesn't re-run after form submission
			// i feed my code to claude 3.5 sonnet and it immediately shows me how to provide a callback in SubmitFunction that runs after the form completes (which is what i was really trying to emulate the whole time)
			// maybe it's a training cutoff diff. but thank you claude
			// if i stared at the use:enhance documentation perhaps i would've realized my error but i mistakenly assumed that it entirely wasn't possible. honestly, i enjoy reading documentation—but sveltekit's drives me insane
			// oh well. i know whom to ask questions to instead of chatgpt now lmao
			return async ({result, update}) => {
				if(result.type === "success") {
					formState.reset();
				}


				await update({reset: true});
			}
		}


		// simulate that that form did fail, so that we can display the error
		cancel();

		applyAction({
			type: "failure",
			status: 400,

			data: {
				error: true,
				message: errorMessage
				// source: "client"
			}
		});
	}



	$effect(() => {
		if(form?.message) {
			toaster.toast({duration: 4000, content: form.message});
		}
	});



	function navigateTo(question: number) {
		formState.currentQuestion = question - 1;
	}
</script>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		margin: 2rem;
		box-sizing: border-box;
	}

	fieldset {
		border: none;
		margin: 0;
		padding: 0;

		display: flex;
		flex-direction: column;
	}

	legend {
		/* i love u variable fonts */
		font: 600 2rem var(--font-serif);
		margin-bottom: 0.25rem;
		padding: 0;
	}

	select {
		border: 0.25rem solid var(--border-color);
		border-radius: 0.25rem;

		padding: 0.25rem;

		background-color: #fff;
		color: #000;
	}

	select:focus, input[type="text"]:focus {
		/* TODO: make a "focusable" class that does this */
		outline: 0.25rem solid #000;
		border-radius: 0.25rem;
	}

	select, option, input[type="text"] {
		font-size: 1.5rem;
	}



	.has-bar {
		--gap: 1rem;
		position: relative;
	}

	/* TODO: clean this up it's so ungodly unprocessable */
	/* TODO: (2) learn SASS */
	input[type="text"] {
		position: relative;

		margin: var(--gap) 2rem;
		/* padding  left margin  right margin */
		/* 0.25 * 2 + 2          + 2 = 4.5rem */
		width: calc(100% - 4.5rem);
		padding: 0.25rem;

		border: none;
		border-bottom: 0.25rem solid var(--gray-1);
	}

	.has-bar span::after {
		content: "";
		position: absolute;

		width: 0.25rem;
		height: calc(100% - var(--gap));
		top: calc(var(--gap) / 2);
		left: 0.5rem;

		background-color: var(--border-color);
	}



	button[type="submit"] {
		border: none;
		border-radius: 0.25rem;
		padding: 0.5rem 2rem;

		background-color: var(--jcs-blue);

		color: white;
		font: bold 2rem var(--font-serif);

		cursor: pointer;
		position: relative;
	}


	/* transitioning the box-shadow property is slow and requires a bazillion re-paints. opacity shift instead */
	button[type="submit"]::after {
		content: "";
		position: absolute;

		width: 100%;
		height: 100%;
		left: 0;
		top: 0;

		border-radius: 0.25rem;

		box-shadow: 0 0.25rem 1.5rem 0 #0006;

		opacity: 0;
		transition: opacity 0.2s;
	}

	button[type="submit"]:hover::after {
		opacity: 1;
	}



	#question-cycler {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;

		max-width: 70vw;
		align-self: center;
	}

	#question-cycler > button {
		width: 2.5rem;
		height: 2.5rem;

		background-color: transparent;
		outline: none;

		box-sizing: border-box;
		border: 0.25rem solid black;
		border-radius: 50%;
		cursor: pointer;
	}

	#question-cycler > .progress-bar {
		width: 2.5rem;
		height: 0.25rem;
		background-color: transparent;
		align-self: center;
	}

	#question-cycler .filled {
		background-color: black;
	}
</style>

<section>
	<!-- TODO: more a11y here -->
	{#snippet timeInput()}
		<fieldset>
			<legend id="time-legend">Log time</legend>

			<select aria-labelledby="time-legend" bind:value={formState.timeInputMethod}>
				<option>Use current time</option>
				<option>Input custom time</option>
			</select>

			{#if formState.timeInputMethod === "Input custom time"}
				<div class="has-bar">
					<span></span>
					<EditableTime margin="1rem 2rem"
						initialTime={formState.customTime}
						onchange={newTime => formState.customTime = newTime} />
				</div>
			{/if}
		</fieldset>
	{/snippet}

	{#snippet locationInput()}
		<fieldset>
			<legend id="location-legend">Location</legend>

			<select aria-labelledby="location-legend" bind:value={formState.selectedSite}>
				<option selected hidden value="">Select a site...</option>
				{#each siteChoices as site}
					<option>{site}</option>
				{/each}
			</select>
		</fieldset>
	{/snippet}

	{#snippet purposeInput()}
		<fieldset>
			<legend id="purpose-legend">Purpose for visiting</legend>

			<select aria-labelledby="purpose-legend" bind:value={formState.selectedPurpose}>
				<option selected hidden value="">Select a reason...</option>
				{#each purposeChoices as purpose}
					<option>{purpose}</option>
				{/each}
			</select>

			{#if formState.selectedPurpose === "Other"}
				<div class="has-bar">
					<span></span>
					<input type="text" aria-labelledby="purpose-legend" placeholder="Type a reason..." bind:value={formState.typedPurpose}>
				</div>
			{/if}
		</fieldset>
	{/snippet}

	{#snippet submitPage()}
		<p>Time: {formState.customTime}</p>
		<p>Location: {formState.selectedSite}</p>
		<p>Purpose: {formState.selectedPurpose === "Other" ? formState.typedPurpose : formState.selectedPurpose}</p>
		<button type="submit">Submit</button>
	{/snippet}



	<form method="POST" action="?/submitLocation" use:enhance={performClientSideValidation}>
		{#if formState.currentQuestion === 0}
			{@render timeInput()}
		{:else if formState.currentQuestion === 1}
			{@render locationInput()}
		{:else if formState.currentQuestion === 2}
			{@render purposeInput()}
		{:else if formState.currentQuestion === 3}
			{@render submitPage()}
		{:else}
			<p>uhhhhh</p>
		{/if}

		<nav id="question-cycler">
			{#each {length: 4} as _, index}
				{@const questionNumber = index + 1}

				<!-- TODO: i don't have to use `` here. can i do this elsewhere? -->
				<button type="button"
				        onclick={() => navigateTo(questionNumber)}
				        aria-label="Navigate to question {questionNumber}"
				        class:filled={formState.currentQuestion > index}
				>
				<!-- TODO: update above -->
					<div class="button-center"></div>
				</button>

				{#if index !== 3}
					<div class="progress-bar"
					     class:filled={formState.currentQuestion > index}></div>
				{/if}
			{/each}
		</nav>



		<input name="time-selector" type="hidden" value={formState.customTime}>
		<input name="location-selector" type="hidden" value={formState.selectedSite}>
		<input name="purpose-selector" type="hidden" value={formState.selectedPurpose}>
		<input name="typed-purpose" type="hidden" value={formState.typedPurpose}>

		<input name="log-time" type="hidden" value={exportedTime}>
		<input name="user-profile" type="hidden" value={currentProfile}>
	</form>
</section>
