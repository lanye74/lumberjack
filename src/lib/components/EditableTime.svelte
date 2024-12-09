<script lang="ts">
	import type {TimePeriod, TimeSelector} from "$types/forms";



	const formatNumber = (number: number) => number.toString().padStart(2, "0");

	// >:(
	// https://itnext.io/heres-why-mapping-a-constructed-array-doesn-t-work-in-javascript-f1195138615a
	const possibleHours = Array(12).fill(0).map((_, index) => formatNumber(index + 1));
	const possibleMinutes = Array(12).fill(0).map((_, index) => formatNumber(index * 5));



	// TODO: this whole thing sucks
	type Props = {
		margin: string;
		initialTime?: TimeSelector;
		onchange: (time: TimeSelector) => unknown;
	};


	let {
		margin = "0",

		initialTime = {
			hours: NaN,
			minutes: NaN,
			period: "AM"
		},

		onchange = (time) => {}
	}: Props = $props();


	let internalTime = $state(initialTime);


	// https://svelte.dev/docs/svelte/$effect#When-not-to-use-$effect
	function updateTime(field: keyof TimeSelector, value: string | TimePeriod) {
		internalTime = {
			...internalTime,
			[field]: field === "period" ?
				value as TimePeriod :
				parseInt(value as string)
		}

		onchange(internalTime);
	}
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
	<label hidden for="hours-input">Hours input</label>
	<select id="hours-input"
		value={formatNumber(internalTime.hours)}
		onchange={e => updateTime("hours", e.currentTarget.value)}
	>
		<option hidden value="NaN">--</option>

		{#each possibleHours as hour}
			<option>{hour}</option>
		{/each}
	</select>

	<span class="colon">:</span>

	<label hidden for="minutes-input">Minutes input</label>
	<select id="minutes-input"
		value={formatNumber(internalTime.minutes)}
		onchange={e => updateTime("minutes", e.currentTarget.value)}
	>
		<option hidden value="NaN">--</option>

		{#each possibleMinutes as minute}
			<option>{minute}</option>
		{/each}
	</select>

	<span class="spacer"></span>

	<label hidden for="am-pm-input">AM/PM Selector</label>
	<select id="am-pm-input"
		value={internalTime.period}
		onchange={e => updateTime("period", e.currentTarget.value)}
	>
		<option hidden value="">--</option>
		<option>AM</option>
		<option>PM</option>
	</select>
</div>
