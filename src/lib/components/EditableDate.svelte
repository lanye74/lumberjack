<script lang="ts">
	import type {DateSelector} from "$types/forms";



	// TODO: this whole thing sucks
	type Props = {
		margin: string;
		initialDate?: DateSelector;
		onchange: (date: DateSelector) => unknown;
	};

	let {
		margin = "0",

		initialDate = {},

		onchange = (date) => {}
	}: Props = $props();


	let internalDate = $state(initialDate);


	// https://svelte.dev/docs/svelte/$effect#When-not-to-use-$effect
	function updateDate(field: keyof DateSelector, value: string) {
		internalDate = {
			...internalDate,
			// [field]: field === "period" ?
			// 	value as TimePeriod :
			// 	parseInt(value as string)
		}

		onchange(internalDate);
	}
</script>

<style>
	.editable-date {
		display: inline-flex;
		flex-direction: row;
	}

	span, select, option {
		font: 1.8rem var(--time-font);
		font-weight: 600;
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



<div class="editable-date" style:margin={margin}>
	<!-- TODO: use snippets -->
	<label hidden for="hours-input">Hours input</label>
	<select id="hours-input"
		value={formatNumber(internalDate.hours)}
		onchange={e => updateDate("hours", e.currentTarget.value)}
	>
		<option hidden value="NaN">--</option>

		{#each possibleHours as hour}
			<option>{hour}</option>
		{/each}
	</select>

	<span class="colon">:</span>

	<label hidden for="minutes-input">Minutes input</label>
	<select id="minutes-input"
		value={formatNumber(internalDate.minutes)}
		onchange={e => updateDate("minutes", e.currentTarget.value)}
	>
		<option hidden value="NaN">--</option>

		{#each possibleMinutes as minute}
			<option>{minute}</option>
		{/each}
	</select>

	<span class="spacer"></span>

	<label hidden for="am-pm-input">AM/PM Selector</label>
	<select id="am-pm-input"
		value={internalDate.period}
		onchange={e => updateDate("period", e.currentTarget.value)}
	>
		<option hidden value="">--</option>
		<option>AM</option>
		<option>PM</option>
	</select>
</div>
