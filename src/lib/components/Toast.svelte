<script lang="ts">
    import {fly} from "svelte/transition";

	import {navbarHeight} from "../stores.js";
    import type {MouseEventHandler} from "svelte/elements";



	export let content: string;
	export let dismiss: MouseEventHandler<HTMLDivElement>;
</script>

<style>
	.toast {
		position: fixed;
		bottom: calc(var(--navbar-height) + 4vh);
		right: 0;

		cursor: pointer;

		display: flex;
		flex-direction: column;

		background-color: white;
		border-radius: 0.5rem;

		max-width: 70vw;

		padding-right: 1rem;
	}



	h3, p {
		margin: 0;
	}

	h3 {
		font: bold 1.75rem var(--font-serif);
		background-color: var(--jcs-blue);
		color: white;

		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		border: 0.25rem solid var(--jcs-blue);
		border-bottom: 0;

		padding: 0.25rem 0.75rem;
	}

	p {
		font-size: 1.25rem;
		box-sizing: border-box;

		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
		border: 0.25rem solid var(--border-color);
		border-top: none;

		padding: 0.375rem 0.75rem;
	}
</style>



<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<!-- oh my god using these transitions was so much easier why didn't i do this from the start -->
<div class="toast"
	style:--navbar-height={`${$navbarHeight}px`}
	aria-live="assertive"
	role="alert"

	in:fly={{x: "100%", duration: 500, opacity: 1}}
	out:fly={{x: "100%", duration: 750, opacity: 1}}

	on:click={dismiss}
>
	<!-- TODO: possibly put an icon & progress bar here -->
	<h3>Lumberjack</h3>

	<p>{content}</p>
</div>
