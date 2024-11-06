<script lang="ts">
	import type {TimePeriod, TimeSelector} from "$types/forms";
    import {untrack} from "svelte";



	type Props = {
		margin: string;
		time: TimeSelector;
	};


	let {
		margin = "0",
		// TODO: a default empty time selector
		time = $bindable({
			hours: NaN,
			minutes: NaN,
			period: "AM"
		})
	}: Props = $props();


	let selectedHour = $state("NaN");
	let selectedMinute = $state("NaN");
	let selectedPeriod = $state<TimePeriod>("AM");


	let internalTime = $derived<TimeSelector>({
		hours: parseInt(selectedHour),
		minutes: parseInt(selectedMinute),
		period: selectedPeriod
	});


	// https://svelte.dev/docs/svelte/$effect#When-not-to-use-$effect
	// TODO: figure out if there is a better way to do this
	$effect(() => {
		time = internalTime;
	})


	// >:(
	// https://itnext.io/heres-why-mapping-a-constructed-array-doesn-t-work-in-javascript-f1195138615a
	const possibleHours = Array(12).fill(0).map((_, index) => (index + 1).toString().padStart(2, "0"));
	const possibleMinutes = Array(12).fill(0).map((_, index) => (index * 5).toString().padStart(2, "0"));
</script>

<style>
	.editable-time {
		display: inline-flex;
		flex-direction: row;
	}

	span, select, option {
		font: 1.8rem var(--time-font);
	}

	span, select {
		box-sizing: border-box;
		height: 2.4rem !important;
		align-self: end;
	}

	select {
		border: none;
		border-radius: 0;
		border-bottom: 0.2rem solid #000;
		background-color: #fff;
		color: #000;
	}

	.spacer {
		width: 0.6rem;
	}
</style>



<!-- TODO: perhaps this should be a fieldset(s) -->
<div class="editable-time" style:margin={margin}>
	<!-- TODO: use snippets -->
	<label hidden={true} for="hours-input">Hours input</label>
	<select id="hours-input" bind:value={selectedHour}>
		<option selected hidden value="">--</option>

		{#each possibleHours as hour}
			<option>{hour}</option>
		{/each}
	</select>

	<span class="colon">:</span>

	<label hidden={true} for="minutes-input">Minutes input</label>
	<select id="minutes-input" bind:value={selectedMinute}>
		<option selected hidden value="">--</option>

		{#each possibleMinutes as minute}
			<option>{minute}</option>
		{/each}
	</select>

	<span class="spacer"></span>

	<label hidden={true} for="am-pm-input">AM/PM Selector</label>
	<select id="am-pm-input" bind:value={selectedPeriod}>
		<option selected hidden value="">--</option>
		<option>AM</option>
		<option>PM</option>
	</select>
</div>
