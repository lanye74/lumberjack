<script lang="ts">
	import {validateTimeSelector, type TimePlace, type TimeSelector} from "$lib/time.js";



	export let margin = "0";

	export let time: TimeSelector = {
		places: [
			{name: "hours", value: "12", isInvalid: false},
			{name: "minutes", value: "00", isInvalid: false},
			{name: "seconds", value: "00", isInvalid: false}
		],

		period: "PM"
	};



	$: time = validateTimeSelector(time);



	function pad(name: TimePlace) {
		// this would be so much nicer if i could trust javascript's pass by reference
		const index = time.places.findIndex(place => place.name === name);
		if(time.places[index].isInvalid) return;

		const paddedValue = time.places[index].value.padStart(2, "0");
		time.places[index].value = paddedValue;
	}

	function wipe(name: TimePlace) {
		const index = time.places.findIndex(place => place.name === name);
		time.places[index].value = "";
	}
</script>

<style>
	/* TODO: why did i write these styles like this */
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


	select {
		background-color: #fff;
	}
</style>



<!-- TODO: perhaps this should be a fieldset -->
<div class="editable-time" style:margin={margin}>
	{#each time.places as place, index}
		<!-- TODO: accessibility with hidden labels -->
		<!-- TODO: this sucks -->
		<label hidden={true} for={`${place.name}-input`}>{place.name} input</label>
		<input id={`${place.name}-input`}
			type="number"
			inputmode="numeric"
			class:is-invalid={place.isInvalid}
			bind:value={place.value}
			on:focus={() => wipe(place.name)}
			on:click={() => wipe(place.name)}
			on:blur={() => pad(place.name)}>

		{#if index < time.places.length - 1}
			<span class="colon">:</span>
		{/if}

	{/each}

	<span class="spacer"></span>

	<label hidden={true} for="am-pm-input">AM/PM Selector</label>
	<select id="am-pm-input" bind:value={time.period}>
		<option>AM</option>
		<option>PM</option>
	</select>
</div>
