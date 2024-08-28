<script lang="ts">
	import "iconify-icon";

	import type {MouseEventHandler} from "svelte/elements";



	export let iconId: string; // these can be one line, really, but i don't want to put multiple typed variable declarations on one line
	export let text: string;
	export let callback: MouseEventHandler<HTMLButtonElement>;
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

		border-bottom: 0.25rem solid #ccc;

		display: flex;
		flex-direction: row;
		gap: 2rem;

		align-items: center;
	}

	iconify-icon {
		font-size: 3rem;
	}
</style>



<button on:click={callback}>
	<iconify-icon icon={iconId} />

	{text}
</button>
