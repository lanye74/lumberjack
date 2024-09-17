<script lang="ts">
	export let margin = "0";



	const timePlaces = [
		{name: "hours", value: "12", isInvalid: false},
		{name: "minutes", value: "00", isInvalid: false},
		{name: "seconds", value: "00", isInvalid: false}
	];

	const minutesSecondsRegex = new RegExp(/^[0-9]{1,2}$/);


	$: {
		timePlaces.forEach(place => {
			if(!place.value.match(minutesSecondsRegex)) {
				place.isInvalid = true;
				return;
			}

			if(place.value.length > 2) {
				place.isInvalid = true;
				return;
			}

			const maximumValue = place.name === "hours" ? 12 : 59;
			const parsedValue = parseInt(place.value);

			if(parsedValue > maximumValue) {
				place.isInvalid = true;
				return;
			}

			place.isInvalid = false;
		});
	}

	let selectedPeriod = "PM";



	function pad(name: string) {
		const index = timePlaces.findIndex(place => place.name === name);
		if(timePlaces[index].isInvalid) return;

		const paddedValue = timePlaces[index].value.padStart(2, "0");
		timePlaces[index].value = paddedValue;
	}
</script>

<style>
	.editable-time {
		display: inline-flex;
		flex-direction: row;
	}

	.editable-time input, span, select, option {
		font: 1.8rem var(--time-font);
	}

	.editable-time input, span, select {
		box-sizing: border-box;
		height: 2.3rem !important;
		align-self: end;
	}

	.editable-time input, select {
		border: none;
		border-bottom: 0.2rem solid #000;
	}

	.editable-time input {
		/* TODO: pray for field-sizing to become a standard CSS property */
		width: 1.4em;
		padding: 0rem 0.2rem;

		text-align: center;
	}

	.editable-time .spacer {
		width: 0.6rem;
	}

	.is-invalid {
		color: red;
		border-bottom-color: red !important;
	}
</style>



<!-- TODO: perhaps this should be a fieldset -->
<div class="editable-time" style:margin={margin}>
	{#each timePlaces as place, index}
		<input id={`${place.name}-input`}
			bind:value={place.value}
			class:is-invalid={place.isInvalid}
			on:blur={() => pad(place.name)}>

		{#if index < timePlaces.length - 1}
			<span class="colon">:</span>
		{/if}

	{/each}

	<span class="spacer"></span>
	<select class="am-pm-input" bind:value={selectedPeriod}>
		<option>AM</option>
		<option>PM</option>
	</select>
</div>
