<script lang="ts">
	import {applyAction, enhance} from "$app/forms";
	import {jcsSites, possibleVisitPurposes, parseSubmitLocationForm} from "$lib/parseSubmitLocationForm.js";
	import type {SubmitFunction} from "@sveltejs/kit";



	let currentlySelectedPurpose: string;


	// my `function` syntax.....
	const performClientSideValidation: SubmitFunction = ({formData, cancel}) => {
		const {isValid, errorMessage} = parseSubmitLocationForm(formData);

		if(isValid === false) {
			cancel();
			console.error("Invalid form submitted!");


			// simulate that that form did fail, so that we can display the error
			applyAction({
				type: "failure",
				status: 400,

				data: {
					error: true,
					message: errorMessage,
					source: "client"
				}
			});
		}
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
		font-size: 2rem;
		/* i love u variable fonts */
		font-weight: 600;
		margin-bottom: 0.25rem;
		padding: 0;
	}

	select {
		border: 0.25rem solid #ccc;
		border-radius: 0.25rem;
	}

	select:focus, input[type="text"]:focus {
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
		margin-top: 1rem;

		background-color: var(--jcs-blue);

		color: white;
		font: normal bold 2rem var(--font-family);

		cursor: pointer;

		position: relative;
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
	<!-- TODO: a11y here -->
	<fieldset>
		<legend>Location</legend>

		<select name="location-selector">
			<option selected hidden value={""}>Select a site...</option>
			{#each jcsSites as site}
				<option>{site}</option>
			{/each}
		</select>
	</fieldset>


	<fieldset>
		<legend>Purpose for visiting</legend>

		<select name="purpose-selector" bind:value={currentlySelectedPurpose}>
			<option selected hidden value={""}>Select a reason...</option>
			{#each possibleVisitPurposes as purpose}
				<option>{purpose}</option>
			{/each}
		</select>

		{#if currentlySelectedPurpose === "Other"}
			<div class="text-purpose-container">
				<!-- bar thing -->
				<span></span>
				<input type="text" name="location-purpose" placeholder="Type a reason...">
			</div>
		{/if}
	</fieldset>


	<button type="submit">Submit</button>
</form>
