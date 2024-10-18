<script lang="ts">
    import {iconComponentMap, type IconComponentId} from "$lib/icons.js";
	import type {MouseEventHandler} from "svelte/elements";



	export let iconId: IconComponentId; // these can be one line, really, but i don't want to put multiple typed variable declarations on one line
	export let text: string;
	export let callback: MouseEventHandler<HTMLButtonElement>;



	const mappedIcon = iconComponentMap[iconId];
</script>

<style>
	button {
		border: none;
		background: none;
		padding: 1.25rem 2rem;

		font-size: 1.75rem;
		cursor: pointer;

		width: 100%;
		text-align: left;

		border-bottom: 0.25rem solid var(--border-color);

		display: flex;
		flex-direction: row;
		gap: 2rem;

		align-items: center;

		color: #000;
	}

	button:first-child {
		border-top: 0.25rem solid var(--border-color);
	}
</style>



<button on:click={callback}>
	<svelte:component this={mappedIcon} font-size="3rem" />

	{text}
</button>
