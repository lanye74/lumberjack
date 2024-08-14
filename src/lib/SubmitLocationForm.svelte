<script lang="ts">
	import {enhance} from "$app/forms";



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
	form {
		display: flex;
		flex-direction: column;

		margin: 2rem;
		box-sizing: border-box;
	}

	fieldset {
		border: none;
		margin: 0;
		padding: 0;
	}
</style>



<form method="POST" action="?/submitLocation" use:enhance>
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
