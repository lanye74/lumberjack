<script lang="ts">
	import {applyAction, enhance} from "$app/forms";
	import type {SubmitFunction} from "@sveltejs/kit";

	import {parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";
	import {navbarHeight} from "$lib/stores.js";
	import type {ProfilePrefix} from "$lib/profiles.js";



	export let currentProfile: ProfilePrefix;
	export let siteChoices: string[];
	export let purposeChoices: string[];



	let currentlySelectedPurpose: string = "";



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
			return ({result, update}) => {
				if(result.type === "success") {
					currentlySelectedPurpose = "";
				}

				update({reset: true});
			}
		}


		cancel();
		console.error("Invalid form submitted!");


		// simulate that that form did fail, so that we can display the error
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
		border: 0.25rem solid #ccc;
		border-radius: 0.25rem;

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



	.text-purpose-container {
		--gap: 2rem;
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
		border-bottom: 1px solid #000;
	}

	.text-purpose-container span::after {
		content: "";
		position: absolute;

		width: 0.25rem;
		height: calc(100% - var(--gap));
		top: calc(var(--gap) / 2);
		left: 0.5rem;

		background-color: #ccc;
	}



	button {
		border: none;
		border-radius: 0.25rem;
		padding: 0.5rem 2rem;

		background-color: var(--jcs-blue);

		color: white;
		font: bold 2rem var(--font-serif);

		cursor: pointer;
		position: relative;
		/* TODO: use below code
		         and also don't commit a hate crime on UX while doing so. if you scroll with below code, it will block the lower content unless i make navbar height bigger */
		/* position: fixed; */

		/* width: calc(100% - 4rem); */
		/* bottom: calc(var(--navbar-height) + 2rem); */
	}


	/* transitioning the box-shadow property is slow and requires a bazillion re-paints. opacity shift instead */
	button::after {
		content: "";
		position: absolute;

		width: 100%;
		height: 100%;
		left: 0;
		top: 0;

		border-radius: 0.25rem;

		box-shadow: 0 0.25rem 1.5rem 0rem #0006;

		opacity: 0;
		transition: opacity 0.2s;
	}

	button:hover::after {
		opacity: 1;
	}
</style>



<form method="POST" action="?/submitLocation" use:enhance={performClientSideValidation}>
	<!-- TODO: more a11y here -->
	<fieldset>
		<legend id="location-legend">Location</legend>

		<select name="location-selector" aria-labelledby="location-legend">
			<option selected hidden value={""}>Select a site...</option>
			{#each siteChoices as site}
				<option>{site}</option>
			{/each}
		</select>
	</fieldset>


	<fieldset>
		<legend id="purpose-legend">Purpose for visiting</legend>

		<select name="purpose-selector" aria-labelledby="purpose-legend" bind:value={currentlySelectedPurpose}>
			<option selected hidden value={""}>Select a reason...</option>
			{#each purposeChoices as purpose}
				<option>{purpose}</option>
			{/each}
		</select>

		{#if currentlySelectedPurpose === "Other"}
			<div class="text-purpose-container">
				<!-- bar thing -->
				<span></span>
				<input type="text" name="location-purpose" aria-labelledby="purpose-legend" placeholder="Type a reason...">
			</div>
		{/if}
	</fieldset>


	<button type="submit" style:--navbar-height={`${$navbarHeight}px`}>Submit</button>

	<input name="user-profile" type="hidden" bind:value={currentProfile}>
</form>
